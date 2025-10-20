import OpenAI from 'openai';
import { OPENROUTER_API_KEY } from '../../utils/config';

class OpenRouterClient {
  private client: OpenAI;

  constructor(apiKey: string) {
    this.client = new OpenAI({
      baseURL: 'https://openrouter.ai/api/v1',
      apiKey: apiKey,
      defaultHeaders: {
        'HTTP-Referer': 'https://github.com/codedwithlikhon/codemate',
        'X-Title': 'CodeMate',
      },
    });
  }

  async complete(prompt: string, model: string = 'meta-llama/llama-3.1-8b-instruct:free'): Promise<{ response: string; codeBlocks: any[] } | null> {
    try {
      const completion = await this.client.chat.completions.create({
        model: model,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 2000,
      });

      const content = completion.choices[0].message.content;
      if (content) {
        return this._parseResponse(content);
      }
      return { response: content || '', codeBlocks: [] };
    } catch (error: any) {
      if (error.status === 429) {
        console.error('Rate limit reached. Please try again later.');
        return null;
      }
      console.error('An error occurred while communicating with the OpenRouter API:', error.message);
      return null;
    }
  }

  private _parseResponse(response: string): { response: string; codeBlocks: any[] } {
    const thinkingPattern = /<Thinking>[\s\S]*?<\/Thinking>/g;
    const cleanedResponse = response.replace(thinkingPattern, '').trim();

    const codeBlockPattern = /```(\w+)\s*(.*)\n([\s\S]*?)```/g;
    const codeBlocks: any[] = [];
    let match;

    while ((match = codeBlockPattern.exec(cleanedResponse)) !== null) {
      const language = match[1];
      const metadata = match[2];
      const code = match[3];

      codeBlocks.push({ language, metadata, code });
    }

    return { response: cleanedResponse, codeBlocks };
  }

  private async handleRateLimit() {
    // TODO: Implement exponential backoff or other retry logic
    console.log('Rate limit reached, waiting before retry...');
  }
}

export default new OpenRouterClient(OPENROUTER_API_KEY);
