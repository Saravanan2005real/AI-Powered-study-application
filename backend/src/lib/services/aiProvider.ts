// src/lib/services/aiProvider.ts

/**
 * AI Provider Service
 * This is structured to allow easy integration with Grok API or any other provider later.
 * Currently, it returns placeholder responses based on the prompt.
 */

export interface AIResponse {
  content: string;
  tokensUsed?: number;
}

export class AIProvider {
  private apiKey: string | undefined;

  constructor() {
    this.apiKey = process.env.GROK_API_KEY;
  }

  /**
   * Send a prompt to the AI model
   */
  async generateResponse(prompt: string, context?: any): Promise<AIResponse> {
    // TODO: Implement actual API call to Grok or another provider when ready.
    // Example:
    // if (this.apiKey) {
    //   const response = await fetch('https://api.grok.com/v1/chat/completions', { ... });
    //   return { content: data.choices[0].message.content };
    // }

    // Mock response for now
    console.log("AI Provider received prompt:", prompt);
    console.log("With context:", context);

    let mockResponse = "I am an AI assistant. I have received your message and am processing it.";

    if (prompt.toLowerCase().includes("test") || prompt.toLowerCase().includes("practice")) {
      mockResponse = `Here is a generated practice test based on your request:\n\n1. What is the main concept of ${context?.subject || 'this topic'}?\n2. How does it apply to real-world scenarios?\n3. Can you give an example?`;
    } else if (prompt.toLowerCase().includes("evaluate")) {
      mockResponse = "I have evaluated your answers. You scored 2 out of 3 correct.";
    }

    return {
      content: mockResponse,
      tokensUsed: 10,
    };
  }

  /**
   * Stream a response (useful for real-time chat typing effect)
   */
  async *streamResponse(prompt: string, context?: any): AsyncGenerator<string, void, unknown> {
    const fullResponse = await this.generateResponse(prompt, context);
    const words = fullResponse.content.split(" ");
    
    for (const word of words) {
      yield word + " ";
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 50));
    }
  }
}

export const aiService = new AIProvider();
