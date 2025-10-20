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
    const response = await client.complete(prompt);
    spinner.stop();

    if (response) {
      console.log(chalk.green(response));
    } else {
      console.log(chalk.red('Failed to get a response.'));
    }
  });

export { chat as chatCommand };
