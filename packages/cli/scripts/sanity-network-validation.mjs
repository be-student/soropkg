import assert from "node:assert/strict";
import { assertNetwork, getServer } from "../dist/utils/stellar.js";

for (const network of ["mainnet", "testnet", "futurenet"]) {
  assert.doesNotThrow(() => assertNetwork(network));
}

assert.throws(
  () => getServer("bogusnet"),
  /unknown network 'bogusnet' \(valid: mainnet, testnet, futurenet\)/
);
assert.throws(
  () => getServer("bogusnet", "https://example.com"),
  /unknown network 'bogusnet'/
);

console.log("network validation sanity checks passed");
