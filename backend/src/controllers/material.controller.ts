import { Request, Response } from 'express';
import { MaterialService } from '../services/material.service';
import fs from 'fs';
import path from 'path';
import multer from 'multer';
import { memoryDb } from '../config/db';

const getUserId = () => "user-1";

// Setup multer for file uploads
const uploadDir = path.join(process.cwd(), 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir)
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`)
  }
})

export const upload = multer({ storage: storage });

export const getMaterials = async (req: Request, res: Response) => {
  try {
    const userId = getUserId();
    const chatId = req.query.chatId as string;
    
    let materials = memoryDb.studyMaterials.filter(m => m.userId === userId);
    if (chatId) {
      materials = materials.filter(m => m.chatSessionId === chatId);
    }
    
    materials = materials.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    res.json(materials);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch materials" });
  }
};

export const createMaterial = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const userId = getUserId();
    if (!memoryDb.users.find(u => u.id === userId)) {
      memoryDb.users.push({ id: userId, email: "student@example.com", name: "Student" });
    }

    const material = await MaterialService.createMaterial(userId, {
      fileName: req.file.originalname,
      filePath: `/uploads/${req.file.filename}`,
      chatSessionId: req.body.chatId
    });

    res.json(material);
  } catch (error) {
    res.status(500).json({ error: "Failed to upload material" });
  }
};
