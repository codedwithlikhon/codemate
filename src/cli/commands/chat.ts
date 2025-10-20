import { Command } from 'commander';
import inquirer from 'inquirer';
import ora from 'ora';
import chalk from 'chalk';
import client from '../../core/ai/client';

const chat = new Command('chat');

chat
  .description('Chat with the CodeMate AI')
  .action(async () => {
    const { prompt } = await inquirer.prompt([
      {
        type: 'input',
        name: 'prompt',
        message: 'Enter your prompt:',
      },
    ]);

    const spinner = ora('Thinking...').start();
    const result = await client.complete(prompt);
    spinner.stop();

    if (result) {
      console.log(chalk.green(result.response));
      if (result.codeBlocks.length > 0) {
        console.log(chalk.yellow('\n--- Code Blocks ---'));
        result.codeBlocks.forEach((block, index) => {
          console.log(chalk.cyan(`Block ${index + 1}:`));
          console.log(chalk.blue(`  Language: ${block.language}`));
          if (block.metadata) {
            console.log(chalk.blue(`  Metadata: ${block.metadata}`));
          }
          console.log(chalk.gray(block.code));
        });
      }
    } else {
      console.log(chalk.red('Failed to get a response.'));
    }
  });

export { chat as chatCommand };
