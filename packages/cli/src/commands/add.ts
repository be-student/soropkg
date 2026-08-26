import { Command } from "commander";
import chalk from "chalk";

// TODO(contributor): implement registry API client and dependency resolution
//
// This command should:
// 1. Parse the package name (org/name[@version])
// 2. Query GET /packages/:org/:name from the registry API
// 3. Resolve the requested version using semver
// 4. Add it to [dependencies] in soroban.toml
// 5. Run install to materialize the resolved contracts

export const addCommand = new Command("add")
  .description("Add a package dependency to soroban.toml")
  .argument("<package>", "Package to add: org/name or org/name@version")
  .option("--registry <url>", "Registry URL")
  .action(async (pkg: string) => {
    console.log(chalk.yellow(`"soropkg add" is not yet implemented.`));
    console.log(chalk.dim(`\nWant to contribute? See CONTRIBUTING.md`));
    void pkg;
  });
