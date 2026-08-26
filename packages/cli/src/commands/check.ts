import path from "path";
import { Command } from "commander";
import ora from "ora";
import chalk from "chalk";
import type { Network } from "@soropkg/core";
import { fetchContractWasm } from "../utils/stellar";
import { extractSpecSection, parseSpecEntries, buildContractInterface } from "../utils/wasm";
import { snapshotFromInterface, diffSnapshots, type SpecChange } from "../utils/specdiff";
import {
  readWatchlist,
  readSnapshotStore,
  writeSnapshotStore,
  scaffoldWatchlist,
  WATCHLIST_FILENAME,
  type SnapshotStore,
} from "../utils/watchlist";

type EntryStatus = "baselined" | "clean" | "drift" | "error";

interface EntryResult {
  name: string;
  contractId: string;
  network: string;
  status: EntryStatus;
  wasmHash?: string;
  changes: SpecChange[];
  breaking: number;
  nonBreaking: number;
  error?: string;
}

// soropkg check — for every contract in the watchlist, fetch its current
// on-chain interface and diff it against the recorded baseline. First run (or
// --update) records baselines; later runs report drift and exit 1 on any
// breaking change or fetch error, so CI can gate on it.
export const checkCommand = new Command("check")
  .description("Check watched contracts for interface drift against recorded baselines")
  .option("--init", `Scaffold a ${WATCHLIST_FILENAME} in the current directory and exit`)
  .option("-f, --file <path>", "Path to the watchlist file")
  .option("--update", "Record the current interfaces as the new baselines")
  .option("--rpc <url>", "Custom RPC endpoint URL")
  .option("--json", "Output machine-readable JSON")
  .action(
    async (options: {
      init?: boolean;
      file?: string;
      update?: boolean;
      rpc?: string;
      json?: boolean;
    }) => {
      if (options.init) {
        try {
          const created = scaffoldWatchlist();
          console.log(chalk.green(`Created ${path.relative(process.cwd(), created)}`));
          console.log(chalk.dim(`\nNext: list your contracts, then run "soropkg check" to baseline them.`));
        } catch (err) {
          console.error(chalk.red((err as Error).message));
          process.exit(1);
        }
        return;
      }

      let watchPath: string;
      let contracts;
      let defaultNetwork: Network;
      try {
        const { path: p, watchlist } = readWatchlist(options.file);
        watchPath = p;
        contracts = watchlist.contracts;
        defaultNetwork = watchlist.network;
      } catch (err) {
        console.error(chalk.red((err as Error).message));
        process.exit(1);
      }

      const baseDir = path.dirname(watchPath);
      const store: SnapshotStore = readSnapshotStore(baseDir);
      const results: EntryResult[] = [];
      let storeChanged = false;

      for (const entry of contracts) {
        const network = (entry.network ?? defaultNetwork) as Network;
        const result: EntryResult = {
          name: entry.name,
          contractId: entry.id,
          network,
          status: "clean",
          changes: [],
          breaking: 0,
          nonBreaking: 0,
        };
        const spinner = options.json ? null : ora(`${entry.name}: fetching from ${network}…`).start();

        try {
          const { wasm, wasmHash } = await fetchContractWasm(entry.id, network, options.rpc);
          const iface = buildContractInterface(
            parseSpecEntries(extractSpecSection(wasm)),
            entry.id,
            wasmHash,
            network
          );
          const live = snapshotFromInterface(iface);
          result.wasmHash = wasmHash;

          const stored = store[entry.name];
          if (!stored || options.update) {
            store[entry.name] = {
              contractId: entry.id,
              network,
              wasmHash,
              capturedAt: new Date().toISOString(),
              snapshot: live,
            };
            storeChanged = true;
            result.status = "baselined";
            spinner?.succeed(
              `${entry.name}: ${stored ? "baseline updated" : "baseline recorded"} (${wasmHash.slice(0, 12)}…)`
            );
          } else {
            const changes = diffSnapshots(stored.snapshot, live);
            result.changes = changes;
            result.breaking = changes.filter((c) => c.severity === "breaking").length;
            result.nonBreaking = changes.length - result.breaking;
            if (changes.length === 0) {
              result.status = "clean";
              spinner?.succeed(`${entry.name}: no drift`);
            } else {
              result.status = "drift";
              const label =
                result.breaking > 0
                  ? chalk.red(`${result.breaking} breaking`)
                  : chalk.yellow(`${result.nonBreaking} non-breaking`);
              spinner?.warn(`${entry.name}: drift — ${label}`);
            }
          }
        } catch (err) {
          result.status = "error";
          result.error = (err as Error).message;
          spinner?.fail(`${entry.name}: ${(err as Error).message.split("\n")[0]}`);
        }

        results.push(result);
      }

      if (storeChanged) {
        const p = writeSnapshotStore(baseDir, store);
        if (!options.json) {
          console.log(chalk.dim(`\nSnapshots written to ${path.relative(process.cwd(), p)}`));
        }
      }

      if (options.json) {
        console.log(JSON.stringify({ watchlist: watchPath, results }, null, 2));
      } else {
        renderCheckSummary(results);
      }

      const anyBreaking = results.some((r) => r.status === "drift" && r.breaking > 0);
      const anyError = results.some((r) => r.status === "error");
      if (anyBreaking || anyError) process.exit(1);
    }
  );

function renderCheckSummary(results: EntryResult[]): void {
  for (const r of results) {
    if (r.status !== "drift") continue;
    console.log("");
    console.log(chalk.bold(`${r.name}  (${r.contractId.slice(0, 8)}…, ${r.network})`));
    for (const c of r.changes.filter((c) => c.severity === "breaking")) {
      console.log(`  ${chalk.red("✗")} ${c.message}`);
    }
    for (const c of r.changes.filter((c) => c.severity === "nonbreaking")) {
      console.log(`  ${chalk.yellow("+")} ${c.message}`);
    }
  }

  const count = (s: EntryStatus) => results.filter((r) => r.status === s).length;
  const breaking = results.filter((r) => r.status === "drift" && r.breaking > 0).length;
  const parts: string[] = [];
  if (count("baselined")) parts.push(`${count("baselined")} baselined`);
  if (count("clean")) parts.push(chalk.green(`${count("clean")} clean`));
  if (count("drift")) {
    const tint = breaking > 0 ? chalk.red : chalk.yellow;
    parts.push(tint(`${count("drift")} drifted${breaking > 0 ? ` (${breaking} breaking)` : ""}`));
  }
  if (count("error")) parts.push(chalk.red(`${count("error")} errored`));

  console.log("");
  console.log(`─── ${parts.join(", ") || "nothing to check"} ───`);
}
