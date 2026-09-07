import crypto from "crypto";
import { Contract, rpc as StellarRpc } from "@stellar/stellar-sdk";
import type { Network } from "@soropkg/core";

// Public RPC endpoints (no API key required). Inlined here so the published
// CLI has no runtime dependency on the private @soropkg/core workspace package.
const PUBLIC_RPC_URLS: Record<Network, string> = {
  mainnet: "https://rpc.ankr.com/stellar_soroban",
  testnet: "https://soroban-testnet.stellar.org",
  futurenet: "https://rpc-futurenet.stellar.org",
};

export const VALID_NETWORKS = ["mainnet", "testnet", "futurenet"] as const;

export function assertNetwork(network: string): asserts network is Network {
  if (!VALID_NETWORKS.includes(network as Network)) {
    throw new Error(`unknown network '${network}' (valid: ${VALID_NETWORKS.join(", ")})`);
  }
}

export function getServer(network: string, rpcUrl?: string): StellarRpc.Server {
  assertNetwork(network);
  const url = rpcUrl ?? PUBLIC_RPC_URLS[network];
  return new StellarRpc.Server(url, { allowHttp: url.startsWith("http://") });
}

export async function fetchContractWasm(
  contractId: string,
  network: Network,
  rpcUrl?: string
): Promise<{ wasm: Buffer; wasmHash: string }> {
  const server = getServer(network, rpcUrl);

  // The SDK has getContractWasmByContractId which wraps the two-step
  // instance-lookup → wasm-fetch pattern for us.
  let wasm: Buffer;
  try {
    // Returns raw WASM bytes
    const result = await server.getContractWasmByContractId(contractId);
    wasm = Buffer.from(result);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : JSON.stringify(err);
    if (network === "mainnet" && !rpcUrl) {
      throw new Error(
        `Failed to fetch contract from mainnet: ${msg}\n\n` +
        `The default public mainnet RPC may be rate-limited.\n` +
        `Provide your own endpoint with --rpc <url>\n` +
        `Free options: Validation Cloud (validationcloud.io), Blockdaemon, Ankr`
      );
    }
    throw new Error(`Failed to fetch contract from ${network}: ${msg}`);
  }

  // WASM hash = SHA-256 of the WASM bytes (matches what's stored on-chain)
  const wasmHash = crypto.createHash("sha256").update(wasm).digest("hex");

  return { wasm, wasmHash };
}

// Fetch a WASM binary directly by its content hash (no contract instance
// needed). This is how historical versions of an upgraded contract are
// retrieved — the chain keeps every uploaded blob addressable by hash.
export async function fetchWasmByHash(
  wasmHashHex: string,
  network: Network,
  rpcUrl?: string
): Promise<Buffer> {
  const server = getServer(network, rpcUrl);

  try {
    const result = await server.getContractWasmByHash(wasmHashHex, "hex");
    return Buffer.from(result);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : JSON.stringify(err);
    if (network === "mainnet" && !rpcUrl) {
      throw new Error(
        `Failed to fetch WASM ${wasmHashHex} from mainnet: ${msg}\n\n` +
        `The default public mainnet RPC may be rate-limited.\n` +
        `Provide your own endpoint with --rpc <url>\n` +
        `Free options: Validation Cloud (validationcloud.io), Blockdaemon, Ankr`
      );
    }
    throw new Error(`Failed to fetch WASM ${wasmHashHex} from ${network}: ${msg}`);
  }
}

// Convenience: get just the WASM hash for a deployed contract without
// fetching the full WASM binary (cheaper RPC call).
export async function fetchContractWasmHash(
  contractId: string,
  network: Network,
  rpcUrl?: string
): Promise<string> {
  const server = getServer(network, rpcUrl);
  const contractLedgerKey = new Contract(contractId).getFootprint();
  const response = await server.getLedgerEntries(contractLedgerKey);

  if (!response.entries.length || !response.entries[0]?.val) {
    throw new Error(`Contract ${contractId} not found on ${network}`);
  }

  const wasmHash = response.entries[0].val
    .contractData()
    .val()
    .instance()
    .executable()
    .wasmHash();

  return Buffer.from(wasmHash).toString("hex");
}
