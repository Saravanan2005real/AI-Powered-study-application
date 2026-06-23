import { Router, Request, Response } from 'express';
import { AIService } from '../services/ai.service';
import { ChatService } from '../services/chat.service';
import { memoryDb } from '../config/db';

const router = Router();
const getUserId = () => "user-1";

router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    console.log(`\n[Chat API] --- New Request Received ---`);
    console.log(`[Chat API] Request Payload:`, JSON.stringify(req.body, null, 2));
    
    const { message, chatId } = req.body;
    
    console.log(`[Chat API] Incoming message: "${message}"`);
    console.log(`[Chat API] Incoming chatId: "${chatId}"`);

    if (!message || typeof message !== 'string' || message.trim() === '') {
      console.warn(`[Chat API] Validation failed: 'message' cannot be empty.`);
      res.status(400).json({ error: "Validation failed: 'message' cannot be empty." });
      return;
    }

    if (!chatId || typeof chatId !== 'string' || chatId.trim() === '') {
      console.warn(`[Chat API] Validation failed: 'chatId' is required.`);
      res.status(400).json({ error: "Validation failed: 'chatId' is required." });
      return;
    }

    const userId = getUserId();
    console.log(`[Chat API] Processing for userId: ${userId}, chatId: ${chatId}`);

    let chat = memoryDb.chatSessions.find(c => c.id === chatId && c.userId === userId);
    if (!chat) {
      console.log(`[Chat API] Chat session ${chatId} does not exist. Creating new chat.`);
      const title = message.substring(0, 20) + (message.length > 20 ? '...' : '');
      chat = await ChatService.createChat(userId, title, chatId);
    }

    console.log(`[Chat API] Adding message to chat ${chatId}...`);
    try {
      const response = await ChatService.addMessage(userId, chatId, message);
      console.log(`[Chat API] Successfully added message. Returning AI response.`);
      res.json({ content: response.aiMessage.content });
    } catch (err: any) {
      console.error(`[Chat API] ChatService.addMessage failed:`, err);
      res.status(500).json({ error: err.message || "Failed to process chat message." });
    }
  } catch (error: any) {
    console.error("\n[Chat API] FATAL ERROR:");
    console.error("Stack trace:", error.stack);
    res.status(500).json({ 
      error: error.message || "An unexpected internal server error occurred while processing the chat."
    });
  }
});

export default router;
