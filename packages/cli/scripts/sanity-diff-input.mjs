import assert from "node:assert/strict";
import { validateWasmHash } from "../dist/commands/diff.js";

const validLowercase = "a".repeat(64);
const validUppercase = "A".repeat(64);

assert.doesNotThrow(() => validateWasmHash(validLowercase, "hash-a"));
assert.doesNotThrow(() => validateWasmHash(validUppercase, "hash-b"));
assert.throws(
  () => validateWasmHash("ABCDEF1234", "hash-a"),
  /hash-a must be a 64-character hexadecimal WASM hash/
);
assert.throws(
  () => validateWasmHash("g".repeat(64), "hash-b"),
  /hash-b must be a 64-character hexadecimal WASM hash/
);

console.log("diff hash validation sanity checks passed");
