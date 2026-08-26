import { Command } from "commander";
import chalk from "chalk";

// TODO(contributor): implement registry search
//
// This command should:
// 1. Call GET /search?q=<query>&category=<cat>&network=<net> on the registry
// 2. Display results in a formatted table: name | version | description | network
// 3. Support --json flag for machine-readable output

export const searchCommand = new Command("search")
  .description("Search the registry for packages")
  .argument("<query>", "Search query")
  .option("--registry <url>", "Registry URL")
  .option("--json", "Output raw JSON")
  .action(async (query: string) => {
    console.log(chalk.yellow(`"soropkg search" is not yet implemented.`));
    console.log(chalk.dim(`Query was: ${query}`));
    console.log(chalk.dim(`\nWant to contribute? See CONTRIBUTING.md`));
  });
