import Groq from "groq-sdk";
import { memoryDb, generateId } from '../config/db';

let groqClient: Groq | null = null;

const getGroqClient = () => {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("Missing GROQ_API_KEY in environment variables. Please check your .env file.");
  }
  if (!groqClient) {
    groqClient = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });
  }
  return groqClient;
};

const handleGroqError = (error: any) => {
  console.error('Groq API Error Details:', error);
  if (error.error?.message) {
    throw new Error(`Groq API Error: ${error.error.message}`);
  }
  if (error.status === 401) {
    throw new Error('Invalid Groq API Key. Please verify your GROQ_API_KEY in .env.');
  }
  throw new Error(error.message || 'An unexpected error occurred with the AI service.');
};

const BASE_SYSTEM_PROMPT = `You are an educational AI assistant named EduGenie.

IMPORTANT FORMATTING RULES:
1. Always display answers in a clean, structured point-wise format whenever possible.
2. Use numbered points for explanations and steps. Use bullet points for lists and key concepts.
3. Keep paragraphs short instead of long text blocks. Use headings and subheadings when relevant.
4. For educational questions: Start with a brief definition or direct answer, follow with key points, include examples when applicable, and end with a short summary.
5. For PDF-based questions: Extract the answer directly from the document, present it in clear points, highlight important facts/dates/formulas/concepts using bold text, and avoid large paragraphs.
6. For practice tests and study materials: Show answers in easy-to-read sections using bullets and numbering consistently.
7. Use markdown formatting properly (Headings, **Bold text**, Bullet lists, Numbered lists, Tables when needed).
8. Maintain conversational quality while improving readability.`;

export class AIService {
  static async chat(message: string) {
    try {
      console.log('Sending message to Groq...');
      const groq = getGroqClient();
      const completion = await groq.chat.completions.create({
        messages: [
          { role: 'system', content: BASE_SYSTEM_PROMPT },
          { role: 'user', content: message }
        ],
        model: 'llama-3.3-70b-versatile',
        temperature: 0.7,
        max_tokens: 1024,
      });

      return completion.choices[0]?.message?.content || '';
    } catch (error: any) {
      handleGroqError(error);
    }
  }

  static async generateResponse(chatSessionId: string, userMessage: string) {
    const messages = memoryDb.messages
      .filter(m => m.chatSessionId === chatSessionId && m.role !== 'system')
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
      .slice(-10);

    const materials = memoryDb.studyMaterials.filter(m => m.chatSessionId === chatSessionId);
    let systemContent = BASE_SYSTEM_PROMPT;
    
    if (materials.length > 0) {
      const contents = materials.map((m: any) => `--- Document: ${m.fileName} ---\n${m.content || "No text could be extracted."}\n---`).join("\n\n");
      systemContent += "\n\nUploaded Document Context (Use this to answer the user's questions if relevant):\n" + contents;
    }

    let aiText = '';
    try {
      const groq = getGroqClient();
      const response = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemContent },
          ...messages.map(m => {
            let validRole = m.role?.toLowerCase() || 'user';
            if (['ai', 'bot', 'assistant', 'pdf', 'document'].includes(validRole)) {
              validRole = 'assistant';
            } else if (validRole !== 'system' && validRole !== 'user') {
              validRole = 'user';
            }
            return { role: validRole as any, content: m.content || "" };
          }),
          { role: 'user', content: userMessage }
        ],
      });

      aiText = response.choices[0]?.message?.content || '';
    } catch (error: any) {
      handleGroqError(error);
    }

    const aiMessage = {
      id: generateId(),
      chatSessionId,
      role: 'assistant',
      content: aiText,
      createdAt: new Date()
    };
    memoryDb.messages.push(aiMessage);

    return aiMessage;
  }
}
