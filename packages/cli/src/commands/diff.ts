import crypto from "crypto";
import { Command } from "commander";
import ora from "ora";
import chalk from "chalk";
import type { Network } from "@soropkg/core";
import { fetchWasmByHash, fetchContractWasmHash } from "../utils/stellar";
import { extractSpecSection, parseSpecEntries, buildContractInterface } from "../utils/wasm";
import {
  snapshotFromInterface,
  diffSnapshots,
  renderSpecDiffReport,
} from "../utils/specdiff";

const WASM_HASH_PATTERN = /^[0-9a-fA-F]{64}$/;

export function validateWasmHash(value: string, name: string): void {
  if (!WASM_HASH_PATTERN.test(value)) {
    throw new Error(`${name} must be a 64-character hexadecimal WASM hash`);
  }
}

// soropkg diff — compare the contractspecv0 interface between two WASM
// versions of a contract. Exit code 1 when breaking changes are found, so a
// CI job can fail the build when a dependency upgrades unsafely.
export const diffCommand = new Command("diff")
  .description("Diff a contract's interface between two WASM versions")
  .argument("<contract-id>", "Deployed contract ID (C... address) the versions belong to")
  .argument("<hash-a>", "Old WASM hash (hex)")
  .argument("<hash-b>", "New WASM hash (hex)")
  .option("-n, --network <network>", "Network to query: mainnet | testnet | futurenet", "mainnet")
  .option("--rpc <url>", "Custom RPC endpoint URL")
  .option("--json", "Output machine-readable JSON instead of a formatted report")
  .action(
    async (
      contractId: string,
      hashA: string,
      hashB: string,
      options: { network: string; rpc?: string; json?: boolean }
    ) => {
      const network = options.network as Network;
      const normalizedHashA = hashA.toLowerCase();
      const normalizedHashB = hashB.toLowerCase();

      try {
        validateWasmHash(hashA, "hash-a");
        validateWasmHash(hashB, "hash-b");
      } catch (err) {
        console.error(chalk.red((err as Error).message));
        process.exit(1);
      }

      if (normalizedHashA === normalizedHashB) {
        console.error(chalk.red("hash-a and hash-b are identical — nothing to diff"));
        process.exit(1);
      }

      async function loadSnapshot(hash: string) {
        const spinner = ora(`Fetching WASM ${hash.slice(0, 12)}… from ${network}`).start();
        let wasm: Buffer;
        try {
          wasm = await fetchWasmByHash(hash, network, options.rpc);
        } catch (err) {
          spinner.fail(chalk.red((err as Error).message));
          process.exit(1);
        }

        // Verify the chain returned exactly the blob we asked for.
        const actual = crypto.createHash("sha256").update(wasm).digest("hex");
        if (actual !== hash.toLowerCase()) {
          spinner.fail(chalk.red(`RPC returned WASM with hash ${actual}, expected ${hash}`));
          process.exit(1);
        }

        spinner.text = `Parsing contract spec for ${hash.slice(0, 12)}…`;
        const entries = parseSpecEntries(extractSpecSection(wasm));
        const iface = buildContractInterface(entries, contractId, actual, network);
        spinner.succeed(`Parsed ${entries.length} spec entries from ${actual.slice(0, 12)}…`);
        return snapshotFromInterface(iface);
      }

      const snapA = await loadSnapshot(normalizedHashA);
      const snapB = await loadSnapshot(normalizedHashB);
      const changes = diffSnapshots(snapA, snapB);

      // Sanity: warn when neither version is what's currently deployed.
      try {
        const liveHash = await fetchContractWasmHash(contractId, network, options.rpc);
        if (liveHash !== normalizedHashA && liveHash !== normalizedHashB) {
          console.log(
            chalk.yellow(
              `Note: live contract is currently at ${liveHash.slice(0, 12)}… — neither diffed version matches it`
            )
          );
        }
      } catch {
        // Non-fatal: the hashes may be historical; skip the liveness check.
      }

      if (options.json) {
        console.log(
          JSON.stringify(
            {
              contractId,
              network,
              from: normalizedHashA,
              to: normalizedHashB,
              breaking: changes.filter((c) => c.severity === "breaking").length,
              nonBreaking: changes.filter((c) => c.severity === "nonbreaking").length,
              changes,
            },
            null,
            2
          )
        );
      } else {
        console.log(renderSpecDiffReport(contractId, network, normalizedHashA, normalizedHashB, changes));
      }

      if (changes.some((c) => c.severity === "breaking")) {
        process.exit(1);
      }
    }
  );
