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

  async complete(prompt: string, model: string = 'meta-llama/llama-3.1-8b-instruct:free') {
    try {
      const completion = await this.client.chat.completions.create({
        model: model,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 2000,
      });

      return completion.choices[0].message.content;
    } catch (error: any) {
      if (error.status === 429) {
        console.error('Rate limit reached. Please try again later.');
        // TODO: Implement proper rate limit handling with backoff
        return null;
      }
      console.error('An error occurred while communicating with the OpenRouter API:', error.message);
      return null;
    }
  }

  private async handleRateLimit() {
    // TODO: Implement exponential backoff or other retry logic
    console.log('Rate limit reached, waiting before retry...');
  }
}

export default new OpenRouterClient(OPENROUTER_API_KEY);
