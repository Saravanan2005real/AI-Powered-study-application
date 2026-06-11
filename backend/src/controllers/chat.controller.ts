import { Request, Response } from 'express';
import { ChatService } from '../services/chat.service';

const getUserId = () => "user-1";

export const getChats = async (req: Request, res: Response) => {
  try {
    const chats = await ChatService.getChats(getUserId());
    res.json(chats);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch chats" });
  }
};

export const createChat = async (req: Request, res: Response) => {
  try {
    const chat = await ChatService.createChat(getUserId(), req.body.title);
    res.json(chat);
  } catch (error) {
    res.status(500).json({ error: "Failed to create chat" });
  }
};

export const getChatById = async (req: Request, res: Response) => {
  try {
    const chat = await ChatService.getChatById(getUserId(), req.params.id);
    if (!chat) return res.status(404).json({ error: "Chat not found" });
    res.json(chat);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch chat" });
  }
};

export const addMessage = async (req: Request, res: Response) => {
  try {
    if (!req.body.content) return res.status(400).json({ error: "Message content required" });
    const result = await ChatService.addMessage(getUserId(), req.params.id, req.body.content);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to send message" });
  }
};
