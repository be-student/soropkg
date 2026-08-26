// TODO(contributor): implement the on-chain contract indexer
//
// The indexer should:
// 1. Poll the Stellar RPC for new contract deployments (getLedgerEntries / stream)
// 2. For each new contract, attempt to extract a contractspecv0 section
// 3. If found, check if the contract matches any registered package (by wasm hash)
// 4. Update packages.latest_wasm_hash and flag version mismatches
//
// Runs as a background process alongside the API server.
// Can be started with: node dist/services/indexer.js

export async function startIndexer(): Promise<void> {
  console.log("[indexer] Contract indexer not yet implemented.");
}
