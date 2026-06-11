import Groq from "groq-sdk";
import { memoryDb, generateId } from '../config/db';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export class AIService {
  static async chat(message: string) {
    try {
      console.log('Sending message to Groq...', { message });
      const completion = await groq.chat.completions.create({
        messages: [
          { role: 'system', content: 'You are an educational AI assistant named EduGenie.' },
          { role: 'user', content: message }
        ],
        model: 'llama-3.3-70b-versatile',
        temperature: 0.7,
        max_tokens: 1024,
      });

      return completion.choices[0]?.message?.content || '';
    } catch (error: any) {
      console.error('Error generating Groq response:', error);
      throw new Error(error.message || 'Groq API Error');
    }
  }

  static async generateResponse(chatSessionId: string, userMessage: string) {
    const messages = memoryDb.messages
      .filter(m => m.chatSessionId === chatSessionId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
      .slice(-10);

    let aiText = '';
    try {
      const response = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: 'You are an educational AI assistant named EduGenie.' },
          ...messages.map(m => ({ role: m.role as any, content: m.content })),
          { role: 'user', content: userMessage }
        ],
      });

      aiText = response.choices[0]?.message?.content || '';
    } catch (error: any) {
      console.error('Error generating Groq response:', error);
      throw new Error(error.message || 'Groq API Error');
    }

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
