declare module 'openai' {
  export default class OpenAI {
    constructor(options: { apiKey: string; dangerouslyAllowBrowser?: boolean });
    
    chat: {
      completions: {
        create(options: {
          model: string;
          messages: Array<{
            role: string;
            content: Array<{ type: string; text: string }>;
          }>;
          temperature?: number;
          max_tokens?: number;
          top_p?: number;
          frequency_penalty?: number;
          presence_penalty?: number;
        }): Promise<ChatCompletion>;
      };
    };
  }
  
  export namespace resources {
    export interface ChatCompletion {
      choices: Array<{
        message: {
          content: string;
        };
      }>;
    }
  }
} 