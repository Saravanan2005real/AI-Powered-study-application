import { memoryDb, generateId } from '../config/db';

export class AIService {
  private static baseUrl = 'https://api.groq.com/openai/v1/chat/completions';

  static async generateResponse(chatSessionId: string, userMessage: string) {
    // Fetch previous context
    const messages = memoryDb.messages
      .filter(m => m.chatSessionId === chatSessionId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
      .slice(-10);

    const apiKey = process.env.GROQ_API_KEY || '';

    if (!apiKey || apiKey === 'your_groq_api_key_here') {
      throw new Error('Groq API Key is not configured.');
    }

    let aiText = '';
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: 'You are an educational AI assistant named EduGenie.' },
            ...messages.map(m => ({ role: m.role, content: m.content })),
            { role: 'user', content: userMessage }
          ],
        }),
      });

      if (!response.ok) {
        let errorMsg = response.statusText;
        try {
          const errorData = await response.json();
          if (errorData.error && errorData.error.message) {
            errorMsg = errorData.error.message;
          }
        } catch (e) {
          // Ignore json parse error
        }
        throw new Error(`Groq API Error: ${errorMsg}`);
      }

      const data = await response.json();
      aiText = data.choices[0].message.content;
    } catch (error) {
      console.error('Error generating Groq response:', error);
      throw error;
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
