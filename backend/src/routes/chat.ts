import { Router, Request, Response } from 'express';
import { AIService } from '../services/ai.service';

const router = Router();

router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { message } = req.body;
    
    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: "Invalid request. 'message' string is required." });
      return;
    }

    const content = await AIService.chat(message);
    res.json({ content });
  } catch (error: any) {
    console.error("Chat API Route Error:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
});

export default router;
