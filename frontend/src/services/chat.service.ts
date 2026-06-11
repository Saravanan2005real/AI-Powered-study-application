import { prisma } from '@/lib/prisma';
import { AIService } from './ai.service';

export class ChatService {
  static async getChats(userId: string) {
    return await prisma.chatSession.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      include: {
        messages: {
          take: 1,
          orderBy: { createdAt: 'desc' }
        }
      }
    });
  }

  static async getChatById(userId: string, chatId: string) {
    return await prisma.chatSession.findFirst({
      where: { id: chatId, userId },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' }
        }
      }
    });
  }

  static async createChat(userId: string, title: string) {
    // Ensure the user exists or create a default one
    await prisma.user.upsert({
      where: { id: userId },
      update: {},
      create: { id: userId, name: "Student" }
    });

    return await prisma.chatSession.create({
      data: {
        userId,
        title: title || "New Chat",
      }
    });
  }

  static async addMessage(userId: string, chatId: string, content: string) {
    const chat = await prisma.chatSession.findFirst({
      where: { id: chatId, userId }
    });

    if (!chat) {
      throw new Error("Chat not found");
    }

    // Save user message
    const userMessage = await prisma.message.create({
      data: {
        chatSessionId: chatId,
        role: 'user',
        content: content
      }
    });

    // Update chat session
    await prisma.chatSession.update({
      where: { id: chatId },
      data: { updatedAt: new Date() }
    });

    // Generate AI response
    const aiMessage = await AIService.generateResponse(chatId, content);

    return { userMessage, aiMessage };
  }
}
