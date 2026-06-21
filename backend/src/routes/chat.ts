import { Router, Request, Response } from 'express';
import { AIService } from '../services/ai.service';
import { ChatService } from '../services/chat.service';
import { memoryDb } from '../config/db';

const router = Router();
const getUserId = () => "user-1";

router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    console.log(`\n[Chat API] --- New Request Received ---`);
    console.log(`[Chat API] Body:`, JSON.stringify(req.body, null, 2));
    
    const { message, chatId } = req.body;
    
    if (!message || typeof message !== 'string') {
      console.warn(`[Chat API] Validation failed: 'message' string is required.`);
      res.status(400).json({ error: "Invalid request. 'message' string is required." });
      return;
    }

    if (chatId && typeof chatId !== 'string') {
      console.warn(`[Chat API] Validation failed: 'chatId' must be a string if provided.`);
      res.status(400).json({ error: "Invalid request. 'chatId' must be a string." });
      return;
    }

    const userId = getUserId();
    console.log(`[Chat API] Processing for userId: ${userId}, chatId: ${chatId || 'None'}`);

    if (chatId) {
      let chat = memoryDb.chatSessions.find(c => c.id === chatId && c.userId === userId);
      if (!chat) {
        console.log(`[Chat API] Chat ${chatId} not found in DB. Creating new session.`);
        chat = await ChatService.createChat(userId, "New Session", chatId);
      }

      console.log(`[Chat API] Adding message to chat ${chatId}...`);
      const response = await ChatService.addMessage(userId, chatId, message);
      console.log(`[Chat API] Successfully added message. Returning AI response.`);
      res.json({ content: response.aiMessage.content });
    } else {
      console.log(`[Chat API] No chatId provided. Processing as stateless message.`);
      let content = "";
      try {
        content = await AIService.chat(message) as string;
        console.log(`[Chat API] Stateless message successful. Returning response.`);
      } catch (error: any) {
        console.error("[Chat API] Stateless AI generation failed:", error.message);
        content = `Sorry, I encountered an error while processing your request: ${error.message}`;
      }
      res.json({ content });
    }
  } catch (error: any) {
    console.error("\n[Chat API] FATAL ERROR:", error);
    res.status(500).json({ 
      error: error.message || "An unexpected internal server error occurred while processing the chat.",
      details: error.stack ? error.stack.split('\n').slice(0, 3) : undefined
    });
  }
});

export default router;
