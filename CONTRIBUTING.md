# Contributing to soropkg

Thanks for contributing. soropkg is on-chain interface tooling for Soroban: it reads a deployed contract's `contractspecv0` interface straight from the chain, and watches the contracts you depend on for breaking upgrades.

## Quick Start

```bash
git clone https://github.com/soropkg/soropkg
cd soropkg
npm install
npm run build

# Sanity-check the engine (offline, no network)
node packages/cli/scripts/sanity-diff.mjs
node packages/cli/scripts/sanity-diff-input.mjs
node packages/cli/scripts/sanity-network-validation.mjs
node packages/cli/scripts/sanity-check.mjs
```

## How Work Is Organized

Contributable work is tracked as GitHub issues. Each issue is self-contained and states what to build, the inputs/outputs, and which files it touches. Pick one, comment to claim it, and open a PR.

## Where the Code Lives

| Area | File |
|------|------|
| WASM parser + XDR spec decoder | `packages/cli/src/utils/wasm.ts` |
| Stellar RPC (fetch contract WASM / hashes) | `packages/cli/src/utils/stellar.ts` |
| Spec-diff engine (snapshot + severity) | `packages/cli/src/utils/specdiff.ts` |
| Watchlist config + snapshot store | `packages/cli/src/utils/watchlist.ts` |
| `soroban.toml` manifest read/write | `packages/cli/src/utils/toml.ts` |
| CLI commands (`init`/`inspect`/`diff`/`check`) | `packages/cli/src/commands/` |
| Shared types | `packages/core/src/types.ts` |

## Pull Request Guidelines

1. One PR per issue.
2. TypeScript strict mode — no `any` without a comment explaining why.
3. No new external dependencies without discussing in the issue first.
4. If you change a public type in `@soropkg/core`, update the CLI accordingly.
5. Add or update a sanity assertion when you change engine behavior.
6. Squash your commits before merging.

## Key Concepts

**On-chain spec extraction** — `wasm.ts` walks the WASM custom sections, finds `contractspecv0`, and decodes the XDR `ScSpecEntry` stream into a typed interface.

**Stellar RPC** — `stellar.ts` handles all RPC. The pattern is: get contract instance → extract WASM hash → fetch WASM bytes (or fetch a historical blob directly by hash).

**Interface drift** — `specdiff.ts` normalizes two interfaces into comparable snapshots and classifies each change as breaking or non-breaking; `check` diffs a live contract against a recorded baseline.

## Questions

Open a discussion on GitHub or ask in the `#dev-tools` channel on the [Stellar Developers Discord](https://discord.gg/stellardev).
