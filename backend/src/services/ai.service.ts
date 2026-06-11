import { memoryDb, generateId } from '../config/db';

export class AIService {
  private static apiKey = process.env.GROQ_API_KEY || '';
  private static baseUrl = 'https://api.groq.com/openai/v1/chat/completions';

  static async generateResponse(chatSessionId: string, userMessage: string) {
    // Fetch previous context
    const messages = memoryDb.messages
      .filter(m => m.chatSessionId === chatSessionId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
      .slice(-10);

    let aiText = '';

    if (!this.apiKey || this.apiKey === 'your_groq_api_key_here') {
      aiText = `I understand you want to learn about "${userMessage}". This is a placeholder response that will be replaced when Groq API integration is configured.`;
    } else {
      try {
        const response = await fetch(this.baseUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'llama3-8b-8192',
            messages: [
              { role: 'system', content: 'You are an educational AI assistant named EduGenie.' },
              ...messages.map(m => ({ role: m.role, content: m.content })),
              { role: 'user', content: userMessage }
            ],
          }),
        });

        if (!response.ok) {
          throw new Error(`Groq API Error: ${response.statusText}`);
        }

        const data = await response.json();
        aiText = data.choices[0].message.content;
      } catch (error) {
        console.error('Error generating Groq response:', error);
        aiText = "Sorry, I'm having trouble connecting to my AI brain right now.";
      }
    }

    // Save AI response
    const aiMessage = {
      id: generateId(),
      chatSessionId,
      role: 'ai',
      content: aiText,
      createdAt: new Date()
    };
    memoryDb.messages.push(aiMessage);

    return aiMessage;
  }
}
