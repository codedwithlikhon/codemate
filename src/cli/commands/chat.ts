import { Command } from 'commander';
import inquirer from 'inquirer';
import ora from 'ora';
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import client from '../../core/ai/client';

const chat = new Command('chat');

chat
  .description('Chat with the CodeMate AI')
  .option('-s, --schema <path>', 'Path to a JSON schema file for structured output')
  .action(async (options) => {
    const { prompt } = await inquirer.prompt([
      {
        type: 'input',
        name: 'prompt',
        message: 'Enter your prompt:',
      },
    ]);

    let response_format;
    if (options.schema) {
      try {
        const schemaPath = path.resolve(options.schema);
        const schemaContent = fs.readFileSync(schemaPath, 'utf-8');
        const schema = JSON.parse(schemaContent);
        response_format = {
          type: 'json_schema',
          json_schema: {
            name: 'custom_schema',
            strict: true,
            schema: schema,
          },
        };
      } catch (error: any) {
        console.error(chalk.red(`Error reading or parsing schema file: ${error.message}`));
        return;
      }
    }

    const spinner = ora('Thinking...').start();
    const result = await client.complete(prompt, undefined, response_format);
    spinner.stop();

    if (result) {
      if (typeof result === 'object' && !result.response) {
        console.log(chalk.green(JSON.stringify(result, null, 2)));
      } else {
        console.log(chalk.green(result.response));
        if (result.codeBlocks && result.codeBlocks.length > 0) {
          console.log(chalk.yellow('\n--- Code Blocks ---'));
          result.codeBlocks.forEach((block: any, index: number) => {
            console.log(chalk.cyan(`Block ${index + 1}:`));
            console.log(chalk.blue(`  Language: ${block.language}`));
            if (block.metadata) {
              console.log(chalk.blue(`  Metadata: ${block.metadata}`));
            }
            console.log(chalk.gray(block.code));
          });
        }
      }
    } else {
      console.log(chalk.red('Failed to get a response.'));
    }
  });

export { chat as chatCommand };
