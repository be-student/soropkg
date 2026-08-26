import { Command } from "commander";
import chalk from "chalk";

// TODO(contributor): implement dependency installation
//
// This command should:
// 1. Read soroban.toml [dependencies]
// 2. Fetch each package's version metadata from the registry
// 3. Write resolved contract IDs into .soropkg/lock.toml
// 4. Optionally run "generate" to emit typed client stubs

export const installCommand = new Command("install")
  .description("Install all dependencies declared in soroban.toml")
  .option("--registry <url>", "Registry URL")
  .action(async () => {
    console.log(chalk.yellow(`"soropkg install" is not yet implemented.`));
    console.log(chalk.dim(`\nWant to contribute? See CONTRIBUTING.md`));
  });
