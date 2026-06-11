import { memoryDb, generateId } from '../config/db';

export class MaterialService {
  static async getMaterials(userId: string) {
    return memoryDb.studyMaterials
      .filter(m => m.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  static async createMaterial(userId: string, data: any) {
    const { fileName, filePath, chatSessionId } = data;

    const newMaterial = {
      id: generateId(),
      userId,
      fileName,
      filePath,
      chatSessionId: chatSessionId || null,
      createdAt: new Date()
    };

    memoryDb.studyMaterials.push(newMaterial);
    return newMaterial;
  }
}
