import { Request, Response } from 'express';
import { MaterialService } from '../services/material.service';
import fs from 'fs';
import path from 'path';
import multer from 'multer';
import { memoryDb } from '../config/db';
import mime from 'mime-types';

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

// Optional file filter to reject unsupported types immediately
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const allowedExts = ['.pdf', '.doc', '.docx', '.txt', '.png', '.jpg', '.jpeg'];
  
  if (allowedExts.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error(`Unsupported file type: ${ext}`));
  }
};

export const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

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
      console.warn("[UPLOAD] Request received without file.");
      return res.status(400).json({ error: "No file uploaded" });
    }

    const { originalname, filename, size, mimetype } = req.file;
    const computedMimeType = mime.lookup(originalname) || mimetype;

    console.log(`\n==================================================`);
    console.log(`[UPLOAD START] Processing new document upload`);
    console.log(`[UPLOAD INFO] Original Name: ${originalname}`);
    console.log(`[UPLOAD INFO] Saved As: ${filename}`);
    console.log(`[UPLOAD INFO] MIME Type: ${computedMimeType}`);
    console.log(`[UPLOAD INFO] File Size: ${size} bytes`);
    console.log(`[UPLOAD INFO] Storage Path: /uploads/${filename}`);
    console.log(`==================================================\n`);

    if (size === 0) {
      console.error(`[UPLOAD ERROR] File is empty: ${originalname}`);
      // cleanup empty file
      fs.unlinkSync(path.join(uploadDir, filename));
      return res.status(400).json({ error: "File is empty" });
    }

    const userId = getUserId();
    if (!memoryDb.users.find(u => u.id === userId)) {
      memoryDb.users.push({ id: userId, email: "student@example.com", name: "Student" });
    }

    const material = await MaterialService.createMaterial(userId, {
      fileName: originalname,
      filePath: `/uploads/${filename}`,
      chatSessionId: req.body.chatId,
      size: size,
      mimeType: computedMimeType
    });

    res.json(material);
  } catch (error: any) {
    console.error(`[UPLOAD FATAL] Failed to upload material:`, error.message);
    res.status(500).json({ error: "Failed to process and upload material" });
  }
};
