import { Router, Request, Response } from 'express';
import { AIService } from '../services/ai.service';
import { memoryDb } from '../config/db';

const router = Router();
const getUserId = () => "user-1";

router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { message, chatId } = req.body;
    
    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: "Invalid request. 'message' string is required." });
      return;
    }

    const userId = getUserId();
    let combinedContext = message;

    if (chatId) {
      const chat = memoryDb.chatSessions.find(c => c.id === chatId && c.userId === userId);
      const materials = memoryDb.studyMaterials.filter(m => m.chatSessionId === chatId && m.userId === userId);

      let historyContext = "";
      if (chat && chat.messages.length > 0) {
        const recentMessages = chat.messages.slice(-6); // Get last 6 messages
        historyContext = "Previous Conversation:\n" + recentMessages.map((m: any) => `${m.role.toUpperCase()}: ${m.content}`).join("\n") + "\n\n";
      }

      let materialContext = "";
      if (materials.length > 0) {
        const contents = materials.map((m: any) => `--- Document: ${m.fileName} ---\n${m.content || "No text could be extracted."}\n---`).join("\n\n");
        materialContext = "Uploaded Document Context (Use this to answer the user's questions if relevant):\n" + contents + "\n\n";
      }

      combinedContext = `${materialContext}${historyContext}Current Question: ${message}`;
    }

    const content = await AIService.chat(combinedContext);
    res.json({ content });
  } catch (error: any) {
    console.error("Chat API Route Error:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
});

export default router;
