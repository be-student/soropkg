// M1 sanity harness for the watchlist + snapshot store + drift decision. Runs
// fully offline: exercises watchlist parsing/validation, snapshot-store
// round-tripping, and the baseline-vs-live drift classification the `check`
// command relies on — no network, no RPC.
//
// Run: node packages/cli/scripts/sanity-check.mjs   (after npm run build -w packages/cli)

import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import {
  readWatchlist,
  writeSnapshotStore,
  readSnapshotStore,
  scaffoldWatchlist,
  WATCHLIST_FILENAME,
} from "../dist/utils/watchlist.js";
import { diffSnapshots } from "../dist/utils/specdiff.js";

let passed = 0;
function check(label, cond) {
  assert.ok(cond, label);
  console.log(`  ✓ ${label}`);
  passed++;
}

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "soropkg-m1-"));

// ── 1. Scaffold + read the watchlist ────────────────────────────────────────
const created = scaffoldWatchlist(tmp);
check("scaffoldWatchlist writes the file", fs.existsSync(created));

const { watchlist } = readWatchlist(path.join(tmp, WATCHLIST_FILENAME));
check("default network parsed", watchlist.network === "mainnet");
check("both example contracts parsed", watchlist.contracts.length === 2);
check("entry has name + id", !!watchlist.contracts[0].name && watchlist.contracts[0].id.startsWith("C"));

// scaffolding twice must refuse to clobber
assert.throws(() => scaffoldWatchlist(tmp), /already exists/);
check("scaffold refuses to overwrite", true);

// ── 2. Watchlist validation ─────────────────────────────────────────────────
const dupPath = path.join(tmp, "dup.toml");
fs.writeFileSync(
  dupPath,
  `network = "testnet"
[[contracts]]
name = "a"
id = "CA1"
[[contracts]]
name = "a"
id = "CA2"
`
);
assert.throws(() => readWatchlist(dupPath), /duplicate contract name/);
check("duplicate names rejected", true);

const emptyPath = path.join(tmp, "empty.toml");
fs.writeFileSync(emptyPath, `network = "mainnet"\n`);
assert.throws(() => readWatchlist(emptyPath), /no \[\[contracts\]\]/);
check("empty watchlist rejected", true);

// ── 3. Snapshot store round-trip ────────────────────────────────────────────
const baseline = {
  functions: { deposit: { inputs: [{ name: "amount", type: "i128" }], outputs: ["i128"] } },
  types: {},
  errors: { InvalidAmount: 2 },
};
const store = {
  svc: {
    contractId: "CAQQR5SWBXKIGZKPBZDH3KM5GQ5GUTPKB7JAFCINLZBC5WXPJKRG3IM7",
    network: "mainnet",
    wasmHash: "abc123",
    capturedAt: new Date().toISOString(),
    snapshot: baseline,
  },
};
writeSnapshotStore(tmp, store);
const reloaded = readSnapshotStore(tmp);
check("store round-trips byte-identically", JSON.stringify(reloaded) === JSON.stringify(store));
check("reading a missing store yields {}", Object.keys(readSnapshotStore(path.join(tmp, "nope"))).length === 0);

// ── 4. Drift classification (the decision `check` makes per contract) ────────
// clean: identical snapshot → no drift
check("identical snapshot → no drift", diffSnapshots(baseline, baseline).length === 0);

// breaking: argument type changed
const breakingLive = {
  functions: { deposit: { inputs: [{ name: "amount", type: "u128" }], outputs: ["i128"] } },
  types: {},
  errors: { InvalidAmount: 2 },
};
const bChanges = diffSnapshots(baseline, breakingLive);
check(
  "arg type change → breaking drift",
  bChanges.length === 1 && bChanges[0].severity === "breaking" && bChanges[0].kind === "arg.type-changed"
);

// non-breaking: additive function
const additiveLive = {
  functions: {
    deposit: { inputs: [{ name: "amount", type: "i128" }], outputs: ["i128"] },
    claim: { inputs: [], outputs: ["i128"] },
  },
  types: {},
  errors: { InvalidAmount: 2 },
};
const nChanges = diffSnapshots(baseline, additiveLive);
check(
  "added function → non-breaking drift only",
  nChanges.length === 1 && nChanges[0].severity === "nonbreaking" && nChanges[0].kind === "function.added"
);

fs.rmSync(tmp, { recursive: true, force: true });

console.log(`\nAll ${passed} M1 sanity assertions passed.`);
