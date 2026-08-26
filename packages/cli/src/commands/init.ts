import { Command } from "commander";
import prompts from "prompts";
import chalk from "chalk";
import path from "path";
import fs from "fs";
import type { SorobanToml } from "@soropkg/core";
import { writeManifest, MANIFEST_FILENAME } from "../utils/toml";

export const initCommand = new Command("init")
  .description(`Scaffold a ${MANIFEST_FILENAME} in the current directory`)
  .action(async () => {
    const dest = path.join(process.cwd(), MANIFEST_FILENAME);

    if (fs.existsSync(dest)) {
      console.log(chalk.yellow(`${MANIFEST_FILENAME} already exists.`));
      return;
    }

    const answers = await prompts([
      {
        type: "text",
        name: "name",
        message: "Package name (org/package)",
        validate: (v: string) =>
          /^[a-z0-9-]+\/[a-z0-9-]+$/.test(v) || "Must be org/package-name (lowercase, hyphens ok)",
      },
      {
        type: "text",
        name: "version",
        message: "Version",
        initial: "1.0.0",
      },
      {
        type: "text",
        name: "description",
        message: "Description (optional)",
      },
      {
        type: "text",
        name: "license",
        message: "License",
        initial: "Apache-2.0",
      },
      {
        type: "text",
        name: "repository",
        message: "Repository URL (optional)",
      },
    ]);

    const manifest: SorobanToml = {
      package: {
        name: answers.name,
        version: answers.version,
        description: answers.description || undefined,
        license: answers.license || undefined,
        repository: answers.repository || undefined,
      },
      networks: {
        mainnet: {},
        testnet: {},
      },
      dependencies: {},
    };

    writeManifest(manifest, dest);
    console.log(chalk.green(`\nCreated ${MANIFEST_FILENAME}`));
    console.log(chalk.dim(`\nNext steps:`));
    console.log(chalk.dim(`  Edit ${MANIFEST_FILENAME} to add contract IDs under [networks.mainnet]`));
    console.log(chalk.dim(`  Run "soropkg inspect <contract-id>" to preview a contract's interface`));
  });
