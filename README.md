# soropkg

**The package manager for Soroban smart contracts on Stellar.**

Developers building on Soroban today copy-paste contract interfaces from GitHub and manually track contract IDs across networks. `soropkg` reads the interface of any deployed contract directly from the chain, in one command. Dependency resolution and a package registry are planned — see [status](#cli-commands) below.

```bash
npm install -g soropkg

# Inspect any deployed contract's interface directly from the chain
soropkg inspect CAQQR5SWBXKIGZKPBZDH3KM5GQ5GUTPKB7JAFCINLZBC5WXPJKRG3IM7

# Scaffold a manifest for your project
soropkg init

# (coming soon) Add a dependency
soropkg add blend-capital/blend-protocol

# (coming soon) Generate typed TypeScript clients
soropkg generate
```

---

## Why

When you compile a Soroban contract, the WASM binary embeds a full machine-readable interface spec in a custom section called `contractspecv0`. Every deployed contract on Stellar mainnet already has this. `soropkg` reads it directly from the chain — no manual ABI uploads, no trust, the ground truth is on-chain.

A registry adding discovery and versioning on top — named packages, semver pinning, dependency declarations, and audit records — is the long-term vision, but it is not built yet.

---

## Structure

```
packages/
  core/       # @soropkg/core — shared TypeScript types
  cli/        # soropkg CLI (this is what users install)
  registry/   # @soropkg/registry — REST API server
seeds/        # Initial contract data from stellar-ecosystem-db
```

---

## The `soroban.toml` Manifest

Every project scaffolded with `soropkg init` gets a `soroban.toml`:

```toml
[package]
name = "blend-capital/blend-protocol"
version = "2.0.0"
description = "Blend Protocol core contracts"
license = "Apache-2.0"
repository = "https://github.com/blend-capital/blend-contracts"

[networks.mainnet]
pool_factory = "CDSYOAVXFY7SM5S64IZPPPYB4GVGGLMQVFREPSQQEZVIWXX5R23G4QSU"
backstop     = "CAQQR5SWBXKIGZKPBZDH3KM5GQ5GUTPKB7JAFCINLZBC5WXPJKRG3IM7"

[networks.testnet]
pool_factory = "C..."
```

---

## CLI Commands

| Command | Status | Description |
|---------|--------|-------------|
| `soropkg init` | ✅ Working | Scaffold `soroban.toml` interactively |
| `soropkg inspect <id>` | ✅ Working | Fetch and display a contract's interface from the chain |
| `soropkg add <pkg>` | 🚧 Planned | Add a dependency to `soroban.toml` |
| `soropkg install` | 🚧 Planned | Install all declared dependencies |
| `soropkg publish` | 🚧 Planned | Publish to the registry |
| `soropkg search <q>` | 🚧 Planned | Search the registry |
| `soropkg generate` | 🚧 Planned | Generate typed TypeScript clients |

---

## Registry API

The registry is a planned REST API with a Postgres backend. Current status:

| Route | Status | Description |
|-------|--------|-------------|
| `GET /health` | ✅ Working | Health check |
| `GET /packages` | 🚧 Planned | List packages |
| `GET /packages/:org/:name` | 🚧 Planned | Get package metadata |
| `POST /packages` | 🚧 Planned | Publish a package |
| `GET /search` | 🚧 Planned | Full-text search |

---

## Development Setup

```bash
git clone https://github.com/soropkg/soropkg
cd soropkg
npm install
npm run build

# Try the working inspect command
node packages/cli/dist/index.js inspect CAQQR5SWBXKIGZKPBZDH3KM5GQ5GUTPKB7JAFCINLZBC5WXPJKRG3IM7

# Start the registry API (requires Postgres — see packages/registry/.env.example)
cd packages/registry
cp .env.example .env
psql -d soropkg -f schema.sql
npm run dev
```

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Every stub command has a written spec in its source file as a `// TODO(contributor):` comment — pick one and open a PR.

---

## License

Apache-2.0
