#!/usr/bin/env node
import { Command } from "commander";
import { inspectCommand } from "./commands/inspect";
import { initCommand } from "./commands/init";

const program = new Command();

program
  .name("soropkg")
  .description("Package manager for Soroban smart contracts on Stellar")
  .version("0.1.0");

program.addCommand(initCommand);
program.addCommand(inspectCommand);

program.parse(process.argv);
