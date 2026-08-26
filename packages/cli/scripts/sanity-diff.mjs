// M0 sanity harness for the spec-diff engine. Runs fully offline: builds two
// synthetic ScSpecEntry sets with the stellar-sdk XDR builders, decodes them
// through the real buildContractInterface pipeline, and asserts the diff
// engine classifies each seeded change correctly.
//
// Run: node packages/cli/scripts/sanity-diff.mjs   (after npm run build -w packages/cli)

import {
  xdr,
} from "@stellar/stellar-sdk";
import { buildContractInterface } from "../dist/utils/wasm.js";
import { snapshotFromInterface, diffSnapshots } from "../dist/utils/specdiff.js";

const arg = (name, type) => new xdr.ScSpecFunctionInputV0({ name, doc: "", type });
const fn = (name, inputs, outputs) =>
  xdr.ScSpecEntry.scSpecEntryFunctionV0(
    new xdr.ScSpecFunctionV0({
      name,
      doc: "",
      inputs,
      outputs: outputs ?? [],
    })
  );
const errEnum = (name, cases) =>
  xdr.ScSpecEntry.scSpecEntryUdtErrorEnumV0(
    new xdr.ScSpecUdtErrorEnumV0({
      name,
      doc: "",
      lib: "",
      cases: cases.map(([n, v]) => new xdr.ScSpecUdtErrorEnumCaseV0({ name: n, doc: "", value: v })),
    })
  );
const struct = (name, fields) =>
  xdr.ScSpecEntry.scSpecEntryUdtStructV0(
    new xdr.ScSpecUdtStructV0({
      name,
      doc: "",
      lib: "",
      fields: fields.map(([n, t]) => new xdr.ScSpecUdtStructFieldV0({ name: n, type: t })),
    })
  );

const T = {
  address: () => xdr.ScSpecTypeDef.scSpecTypeAddress(),
  i128: () => xdr.ScSpecTypeDef.scSpecTypeI128(),
  u128: () => xdr.ScSpecTypeDef.scSpecTypeU128(),
  u32: () => xdr.ScSpecTypeDef.scSpecTypeU32(),
  string: () => xdr.ScSpecTypeDef.scSpecTypeString(),
};

const V1 = [
  // deposit(from: Address, amount: i128) -> Address
  fn("deposit", [arg("from", T.address()), arg("amount", T.i128())], [T.address()]),
  // withdraw(to: Address, amount: i128)
  fn("withdraw", [arg("to", T.address()), arg("amount", T.i128())]),
  errEnum("Errors", [["InsufficientBalance", 1], ["InvalidAmount", 2]]),
  struct("Reserve", [["asset", T.address()], ["scale", T.u32()]]),
];

const V2 = [
  // BREAKING: amount changed type i128 → u128; return type Address → i128
  fn("deposit", [arg("from", T.address()), arg("amount", T.u128())], [T.i128()]),
  // BREAKING: function removed entirely
  // NON-BREAKING: new function added
  fn("claim", [arg("to", T.address())]),
  // BREAKING: error code repurposed (1 now means something else)
  errEnum("Errors", [["InsufficientBalance", 1], ["InvalidAmount", 3], ["TooManyRequests", 4]]),
  // NON-BREAKING additions among errors…
  // BREAKING: struct field type changed
  struct("Reserve", [["asset", T.address()], ["scale", T.u32()], ["rate", T.i128()]]),
];

function toSnapshot(entries) {
  const iface = buildContractInterface(entries, "CTEST", "a".repeat(64), "mainnet");
  return snapshotFromInterface(iface);
}

const changes = diffSnapshots(toSnapshot(V1), toSnapshot(V2));

const byKind = {};
for (const c of changes) {
  byKind[c.kind] = byKind[c.kind] ?? [];
  byKind[c.kind].push(c);
}

console.log("Detected changes:");
for (const c of changes) console.log(`  [${c.severity}] ${c.kind}: ${c.message}`);

let failures = 0;
function expect(kind, severity, messagePart) {
  const list = byKind[kind] ?? [];
  const hit = list.find((c) => c.message.includes(messagePart));
  if (!hit) {
    console.error(`FAIL: expected ${severity} ${kind} matching "${messagePart}"`);
    failures++;
  } else if (hit.severity !== severity) {
    console.error(`FAIL: "${messagePart}" classified ${hit.severity}, expected ${severity}`);
    failures++;
  }
}

expect("arg.type-changed", "breaking", "amount");
expect("return.changed", "breaking", "deposit");
expect("function.removed", "breaking", "withdraw");
expect("function.added", "nonbreaking", "claim");
expect("error.repurposed", "breaking", "InvalidAmount");
expect("error.added", "nonbreaking", "TooManyRequests");
expect("type.changed", "breaking", "Reserve");

// No unexpected kinds beyond the seven we seeded.
const known = new Set([
  "arg.type-changed", "return.changed", "function.removed",
  "function.added", "error.repurposed", "error.added", "type.changed",
]);
for (const c of changes) {
  if (!known.has(c.kind)) {
    console.error(`FAIL: unexpected change kind ${c.kind}`);
    failures++;
  }
}

if (failures > 0) {
  console.error(`\n${failures} assertion(s) failed`);
  process.exit(1);
}
console.log("\nAll sanity assertions passed.");
