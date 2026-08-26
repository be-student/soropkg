import { Command } from "commander";
import chalk from "chalk";

// TODO(contributor): implement TypeScript client code generation
//
// This command should:
// 1. Read soroban.toml and .soropkg/lock.toml
// 2. For each installed contract, fetch spec via inspect utilities
// 3. Generate a typed TypeScript client in .soropkg/generated/<org>/<name>.ts
//    with method signatures, argument types, return types from the spec
// 4. Optionally wrap stellar contract bindings typescript under the hood
//
// Prior art to study:
//   stellar contract bindings typescript --id <ID> --network mainnet
//   This generates a client already — we wrap and integrate it per-package.

export const generateCommand = new Command("generate")
  .description("Generate typed TypeScript clients from installed dependencies")
  .option("--out <dir>", "Output directory", ".soropkg/generated")
  .action(async () => {
    console.log(chalk.yellow(`"soropkg generate" is not yet implemented.`));
    console.log(chalk.dim(`\nWant to contribute? See CONTRIBUTING.md`));
  });
