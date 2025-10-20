import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import os from 'os';

// Load environment variables from .env file
dotenv.config();

// Define the path for the global and local config files
const globalConfigPath = path.join(os.homedir(), '.codematerc.json');
const localConfigPath = path.join(process.cwd(), '.codemate.json');

// Function to read a JSON file
const readConfigFile = (filePath: string): any => {
  if (fs.existsSync(filePath)) {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(fileContent);
  }
  return {};
};

// Load configurations
const globalConfig = readConfigFile(globalConfigPath);
const localConfig = readConfigFile(localConfigPath);

// Merge configurations: local overrides global
const config = { ...globalConfig, ...localConfig };

// Get API key from environment variables or config files
export const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || config.apiKey || '';

if (!OPENROUTER_API_KEY) {
  console.warn('Warning: OPENROUTER_API_KEY is not set. Please set it in your .env file or a config file.');
}
