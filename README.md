# soropkg

**On-chain interface tooling for Soroban smart contracts on Stellar.**

Every deployed Soroban contract embeds a full, machine-readable interface spec in its WASM. `soropkg` reads that spec directly from the chain — so you can inspect any contract's interface, and watch the contracts your app depends on for **breaking upgrades** before they break you.

```bash
npm install -g soropkg

# Inspect any deployed contract's interface, straight from the chain
soropkg inspect CAQQR5SWBXKIGZKPBZDH3KM5GQ5GUTPKB7JAFCINLZBC5WXPJKRG3IM7

# Scaffold a project manifest
soropkg init

# Diff a contract's interface between two WASM versions
soropkg diff <contract-id> <old-wasm-hash> <new-wasm-hash>

# Watch the contracts you depend on for interface drift (great in CI)
soropkg check --init      # scaffold soroban-watch.toml
soropkg check             # baseline, then detect breaking upgrades
```

---

## Why

When you compile a Soroban contract, the WASM binary embeds a machine-readable interface spec in a custom section (`contractspecv0`, standardized in SEP-48). Every deployed contract on Stellar mainnet already has this. `soropkg` reads it directly from the chain — no manual ABI uploads, no trust, the ground truth is on-chain.

Soroban contracts can also **upgrade in place**: `update_current_contract_wasm(new_hash)` swaps a contract's code while keeping the same address, silently changing its interface and breaking every generated client that talks to it. `soropkg check` snapshots the interfaces you depend on and flags breaking drift — so a dependency's upgrade fails your CI instead of your users.

---

## Structure

```
packages/
  core/       # @soropkg/core — shared TypeScript types
  cli/        # soropkg CLI (this is what users install)
  website/    # landing page
  docs/       # documentation site
seeds/        # curated mainnet contract data (reference / examples)
```

---

## The `soroban.toml` Manifest

`soropkg init` scaffolds a `soroban.toml` for declaring your package metadata and contract IDs per network:

```toml
[package]
name = "blend-capital/blend-protocol"
version = "2.0.0"
license = "Apache-2.0"
repository = "https://github.com/blend-capital/blend-contracts"

[networks.mainnet]
pool_factory = "CDSYOAVXFY7SM5S64IZPPPYB4GVGGLMQVFREPSQQEZVIWXX5R23G4QSU"
backstop     = "CAQQR5SWBXKIGZKPBZDH3KM5GQ5GUTPKB7JAFCINLZBC5WXPJKRG3IM7"
```

---

## Watching for interface drift

Declare the deployed contracts your app depends on in a `soroban-watch.toml`:

```toml
network = "mainnet"

[[contracts]]
name = "soroswap-router"
id   = "CAG5LRYQ5JVEUI5TEID72EYOVX44TTUJT5BQR2J6J77FH65PCCFAJDDH"
```

Run `soropkg check` once to record baselines (stored in `.soroban/snapshots.json`), then again — in CI, or after a dependency ships an upgrade — to detect drift. It exits non-zero on any **breaking** change, so it drops straight into a pipeline.

---

## CLI Commands

| Command | Description |
|---------|-------------|
| `soropkg init` | Scaffold a `soroban.toml` interactively |
| `soropkg inspect <id>` | Fetch and display a deployed contract's interface from the chain |
| `soropkg diff <id> <hashA> <hashB>` | Diff a contract's interface between two WASM versions |
| `soropkg check` | Watch declared contracts for interface drift against recorded baselines |

---

## Development Setup

```bash
git clone https://github.com/soropkg/soropkg
cd soropkg
npm install
npm run build

# Try it
node packages/cli/dist/index.js inspect CAQQR5SWBXKIGZKPBZDH3KM5GQ5GUTPKB7JAFCINLZBC5WXPJKRG3IM7

# Run the offline test harnesses
node packages/cli/scripts/sanity-diff.mjs
node packages/cli/scripts/sanity-check.mjs
```

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

---

## License

Apache-2.0
