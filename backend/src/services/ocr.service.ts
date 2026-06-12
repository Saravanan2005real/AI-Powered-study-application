import { HfInference } from '@huggingface/inference';
import fs from 'fs';

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

export class OcrService {
  /**
   * Run Florence-2 OCR on an image file.
   */
  static async extractTextFromImage(imagePath: string): Promise<string> {
    console.log(`[OCR] Running Florence-2 OCR on: ${imagePath}`);
    try {
      const bufferData = fs.readFileSync(imagePath);
      const dataBlob = new Blob([bufferData]);
      
      const response = await hf.imageToText({
        data: dataBlob,
        model: 'microsoft/Florence-2-large',
      });
      
      const extracted = response.generated_text || "";
      console.log(`[OCR] Florence-2 returned ${extracted.length} characters.`);
      return extracted;
    } catch (error: any) {
      console.error("[OCR] Failed to process image with Florence-2:", error.message);
      throw error;
    }
  }
}
