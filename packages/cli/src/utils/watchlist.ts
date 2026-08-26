import fs from "fs";
import path from "path";
import TOML from "@iarna/toml";
import type { Network } from "@soropkg/core";
import type { SpecSnapshot } from "./specdiff";

// M1 — a watchlist declares which deployed contracts a project depends on and
// wants to monitor for interface drift. Recorded interface baselines live in a
// machine-managed snapshot store next to the watchlist; `soropkg check` diffs
// each contract's current on-chain interface against its stored baseline.

export const WATCHLIST_FILENAME = "soroban-watch.toml";
export const SNAPSHOT_DIR = ".soroban";
export const SNAPSHOT_FILENAME = "snapshots.json";

export interface WatchEntry {
  name: string;          // unique label; keys the snapshot store
  id: string;            // deployed contract ID (C… address)
  network?: Network;     // overrides the watchlist default
}

export interface Watchlist {
  network: Network;      // default network for entries that don't set one
  contracts: WatchEntry[];
}

// A recorded baseline for one watched contract.
export interface StoredSnapshot {
  contractId: string;
  network: string;
  wasmHash: string;
  capturedAt: string;    // ISO timestamp
  snapshot: SpecSnapshot;
}

export type SnapshotStore = Record<string, StoredSnapshot>; // keyed by watch entry name

// Walk up from cwd to find the nearest watchlist (same pattern as the manifest).
export function findWatchlist(cwd = process.cwd()): string | null {
  let dir = cwd;
  while (true) {
    const candidate = path.join(dir, WATCHLIST_FILENAME);
    if (fs.existsSync(candidate)) return candidate;
    const parent = path.dirname(dir);
    if (parent === dir) return null;
    dir = parent;
  }
}

export function readWatchlist(filePath?: string): { path: string; watchlist: Watchlist } {
  const resolved = filePath ?? findWatchlist();
  if (!resolved) {
    throw new Error(
      `No ${WATCHLIST_FILENAME} found. Run "soropkg check --init" to create one.`
    );
  }

  const parsed = TOML.parse(fs.readFileSync(resolved, "utf8")) as Record<string, unknown>;
  const network = (typeof parsed.network === "string" ? parsed.network : "mainnet") as Network;

  const rawContracts = Array.isArray(parsed.contracts) ? parsed.contracts : [];
  const contracts: WatchEntry[] = rawContracts.map((c: unknown, i: number) => {
    const entry = c as Record<string, unknown>;
    if (!entry || typeof entry.name !== "string" || typeof entry.id !== "string") {
      throw new Error(`${WATCHLIST_FILENAME}: contracts[${i}] must have string "name" and "id"`);
    }
    return {
      name: entry.name,
      id: entry.id,
      network: typeof entry.network === "string" ? (entry.network as Network) : undefined,
    };
  });

  if (contracts.length === 0) {
    throw new Error(`${WATCHLIST_FILENAME} has no [[contracts]] entries to check.`);
  }

  // Names key the snapshot store, so they must be unique.
  const seen = new Set<string>();
  for (const c of contracts) {
    if (seen.has(c.name)) {
      throw new Error(`${WATCHLIST_FILENAME}: duplicate contract name "${c.name}"`);
    }
    seen.add(c.name);
  }

  return { path: resolved, watchlist: { network, contracts } };
}

export function storePath(baseDir: string): string {
  return path.join(baseDir, SNAPSHOT_DIR, SNAPSHOT_FILENAME);
}

export function readSnapshotStore(baseDir: string): SnapshotStore {
  const p = storePath(baseDir);
  if (!fs.existsSync(p)) return {};
  try {
    return JSON.parse(fs.readFileSync(p, "utf8")) as SnapshotStore;
  } catch (err) {
    throw new Error(`Corrupt snapshot store at ${p}: ${(err as Error).message}`);
  }
}

export function writeSnapshotStore(baseDir: string, store: SnapshotStore): string {
  const p = storePath(baseDir);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, JSON.stringify(store, null, 2) + "\n");
  return p;
}

const EXAMPLE_WATCHLIST = `# soroban-watch.toml — deployed contracts to monitor for interface drift.
# Run "soropkg check" once to record baselines, then again (e.g. in CI) to
# detect when a watched contract upgrades in a way that breaks your clients.

network = "mainnet"   # default network; override per-contract with a "network" key

[[contracts]]
name = "blend-backstop"
id   = "CAQQR5SWBXKIGZKPBZDH3KM5GQ5GUTPKB7JAFCINLZBC5WXPJKRG3IM7"

[[contracts]]
name = "soroswap-router"
id   = "CAG5LRYQ5JVEUI5TEID72EYOVX44TTUJT5BQR2J6J77FH65PCCFAJDDH"
`;

export function scaffoldWatchlist(baseDir = process.cwd()): string {
  const target = path.join(baseDir, WATCHLIST_FILENAME);
  if (fs.existsSync(target)) {
    throw new Error(`${WATCHLIST_FILENAME} already exists at ${target}`);
  }
  fs.writeFileSync(target, EXAMPLE_WATCHLIST);
  return target;
}
