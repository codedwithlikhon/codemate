#!/usr/bin/env node

import { Command } from 'commander';
import { chatCommand } from './cli/commands/chat';

const program = new Command();

program
  .name('codemate')
  .description('A CLI to interact with the CodeMate AI')
  .version('0.1.0');

program.addCommand(chatCommand);

program.parse(process.argv);
