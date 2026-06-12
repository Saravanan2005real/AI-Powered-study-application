import { memoryDb, generateId } from '../config/db';
import fs from 'fs';
import path from 'path';
import { fromPath } from 'pdf2pic';
import { OcrService } from './ocr.service';
import mime from 'mime-types';

const pdfParse = require('pdf-parse');
import * as mammoth from 'mammoth';

// Helper to perform OCR on a PDF using Florence-2
async function performOCR(pdfPath: string, originalName: string): Promise<string> {
  console.log(`[OCR] Starting Florence-2 OCR fallback for ${originalName}`);
  try {
    const tempDir = path.join(process.cwd(), 'public', 'temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    const options = {
      density: 300,
      saveFilename: `ocr_${Date.now()}`,
      savePath: tempDir,
      format: "png",
      width: 2550,
      height: 3300
    };

    const convert = fromPath(pdfPath, options);
    let fullText = "";
    
    // Process up to 3 pages to avoid memory/timeout issues
    for (let i = 1; i <= 3; i++) {
      try {
        console.log(`[OCR] Converting page ${i} to image...`);
        const result = await convert(i, { responseType: "image" });
        if (result && result.path) {
          console.log(`[OCR] Running Florence-2 on page ${i}...`);
          const text = await OcrService.extractTextFromImage(result.path);
          fullText += text + "\n\n";
          
          // Cleanup temp image
          if (fs.existsSync(result.path)) {
            fs.unlinkSync(result.path);
          }
        }
      } catch (err: any) {
        // Usually means the page doesn't exist (e.g., 1-page PDF)
        break;
      }
    }
    
    console.log(`[OCR] Finished. Extracted ${fullText.length} chars.`);
    return fullText.trim();
  } catch (error: any) {
    console.error(`[OCR] Fatal error during OCR:`, error.message);
    throw error;
  }
}

export class MaterialService {
  static async getMaterials(userId: string) {
    return memoryDb.studyMaterials
      .filter(m => m.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  static async extractText(filePath: string, originalName: string): Promise<string> {
    try {
      console.log(`[EXTRACTION] Starting extraction for file: ${originalName}`);
      const fullPath = path.join(process.cwd(), 'public', filePath);
      console.log(`[EXTRACTION] Reading file from path: ${fullPath}`);
      
      if (!fs.existsSync(fullPath)) {
        console.error(`[EXTRACTION] Error: File does not exist at ${fullPath}`);
        return "";
      }

      const mimeType = mime.lookup(originalName) || 'application/octet-stream';
      const ext = path.extname(originalName).toLowerCase();
      let extractedText = "";
      
      console.log(`[EXTRACTION] Detected MIME type: ${mimeType}`);

      if (mimeType === 'application/pdf' || ext === '.pdf') {
        const dataBuffer = fs.readFileSync(fullPath);
        const data = await pdfParse(dataBuffer);
        extractedText = data.text;
      } 
      else if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || ext === '.docx' || ext === '.doc') {
        const result = await mammoth.extractRawText({ path: fullPath });
        extractedText = result.value;
      }
      else if (mimeType.startsWith('text/') || ext === '.txt') {
        extractedText = fs.readFileSync(fullPath, 'utf8');
      } 
      else if (mimeType.startsWith('image/') || ['.png', '.jpg', '.jpeg'].includes(ext)) {
        console.log(`[EXTRACTION] Image detected. Routing directly to Florence-2 OCR...`);
        extractedText = await OcrService.extractTextFromImage(fullPath);
      }
      else {
        console.warn(`[EXTRACTION] Unsupported file format: ${ext} / ${mimeType}`);
        return "[Unsupported File Format]";
      }
      
      extractedText = extractedText?.trim() || "";
      
      // OCR Fallback for Scanned PDFs
      if ((mimeType === 'application/pdf' || ext === '.pdf') && extractedText.length < 20) {
        console.warn(`[EXTRACTION] Warning: Text too short (${extractedText.length} chars). Triggering OCR for ${originalName}.`);
        try {
          const ocrText = await performOCR(fullPath, originalName);
          if (ocrText.length > 0) {
            extractedText = ocrText;
            console.log(`[EXTRACTION] OCR successful. Extracted ${extractedText.length} characters.`);
          } else {
            console.warn(`[EXTRACTION] OCR returned empty text for ${originalName}.`);
            return "[Image-only or Scanned Document - No readable text found via OCR]";
          }
        } catch (ocrError: any) {
          console.warn(`[EXTRACTION] OCR Failed: ${ocrError.message}. Proceeding with empty text warning.`);
          return "[Image-only or Scanned Document - OCR Failed: Check logs]";
        }
      } else if (extractedText.length === 0) {
        console.warn(`[EXTRACTION] Warning: Extraction returned empty text for ${originalName}.`);
        return "[Empty Document - No readable text found]";
      }
      
      console.log(`[EXTRACTION] Success: Extracted ${extractedText.length} characters from ${originalName}`);
      return extractedText;
    } catch (error: any) {
      console.error(`[EXTRACTION] Fatal Error extracting text from ${originalName}:`, error.message);
      return "[Extraction Failed: " + error.message + "]";
    }
  }

  static async createMaterial(userId: string, data: any) {
    const { fileName, filePath, chatSessionId, size, mimeType } = data;
    
    console.log(`[UPLOAD] Processing uploaded file: ${fileName} | Size: ${size} bytes | MIME: ${mimeType}`);

    const extractedText = await this.extractText(filePath, fileName);
    
    const extractionStatus = extractedText.startsWith("[") && extractedText.endsWith("]") 
      ? "FAILED_OR_EMPTY" 
      : "SUCCESS";

    const newMaterial = {
      id: generateId(),
      userId,
      fileName,
      filePath,
      chatSessionId: chatSessionId || null,
      content: extractedText,
      extractionStatus, 
      createdAt: new Date(),
      size: size || 0,
      mimeType: mimeType || 'unknown',
      extractedTextLength: extractedText.length
    };

    memoryDb.studyMaterials.push(newMaterial);
    console.log(`[UPLOAD] Material saved to database. Chat context linked: ${chatSessionId || "None"}`);
    return newMaterial;
  }
}
