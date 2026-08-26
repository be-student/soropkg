import { Command } from "commander";
import chalk from "chalk";

// TODO(contributor): implement package publishing flow
//
// This command should:
// 1. Read and validate soroban.toml
// 2. Authenticate via GitHub OAuth device flow
// 3. For each contract in [networks.*], fetch on-chain WASM hash and verify it matches
// 4. POST /packages to registry API with manifest + verified wasm hashes
// 5. Print the published package URL

export const publishCommand = new Command("publish")
  .description("Publish the current package to the registry")
  .option("--registry <url>", "Registry URL")
  .option("--dry-run", "Validate and preview without publishing")
  .action(async () => {
    console.log(chalk.yellow(`"soropkg publish" is not yet implemented.`));
    console.log(chalk.dim(`\nWant to contribute? See CONTRIBUTING.md`));
  });
