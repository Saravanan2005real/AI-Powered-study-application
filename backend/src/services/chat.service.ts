import { memoryDb, generateId } from '../config/db';
import { AIService } from './ai.service';

export class ChatService {
  static async getChats(userId: string) {
    const chats = memoryDb.chatSessions
      .filter(c => c.userId === userId)
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
      .map(chat => {
        const chatMessages = memoryDb.messages
          .filter(m => m.chatSessionId === chat.id)
          .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        
        return {
          ...chat,
          messages: chatMessages.slice(0, 1) // include only the latest message
        };
      });
      
    return chats;
  }

  static async createChat(userId: string, title: string = "New Chat") {
    // Ensure user exists
    if (!memoryDb.users.find(u => u.id === userId)) {
      memoryDb.users.push({ id: userId, email: "student@example.com", name: "Student" });
    }

    const newChat = {
      id: generateId(),
      userId,
      title,
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    memoryDb.chatSessions.push(newChat);
    return newChat;
  }

  static async getChatById(userId: string, chatId: string) {
    const chat = memoryDb.chatSessions.find(c => c.id === chatId && c.userId === userId);
    if (!chat) return null;

    const chatMessages = memoryDb.messages
      .filter(m => m.chatSessionId === chatId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

    return { ...chat, messages: chatMessages };
  }

  static async addMessage(userId: string, chatId: string, content: string) {
    const chat = memoryDb.chatSessions.find(c => c.id === chatId && c.userId === userId);
    if (!chat) throw new Error("Chat not found");

    const userMessage = {
      id: generateId(),
      chatSessionId: chatId,
      role: "user",
      content,
      createdAt: new Date()
    };
    
    memoryDb.messages.push(userMessage);
    chat.updatedAt = new Date();

    const aiMessage = await AIService.generateResponse(chatId, content);

    return {
      userMessage,
      aiMessage
    };
  }
}
