import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export class AIService {
  static async sendMessage(message: string, chatId?: string | null) {
    try {
      console.log("Sending message to backend AI service...", { API_URL, message, chatId });
      const response = await axios.post(`${API_URL}/api/chat`, {
        message,
        chatId
      }, {
        headers: { "Content-Type": "application/json" },
        timeout: 30000 // Timeout handling
      });

      return response.data.content;
    } catch (error: any) {
      console.error("AIService Error:", error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        throw new Error("Unauthorized: Please check your API credentials.");
      }
      throw new Error(error.response?.data?.error || error.message || "An unexpected error occurred in AI Service");
    }
  }

  static async generatePracticeTest(context: any) {
    try {
      console.log("Generating personalized test via backend API...");
      const response = await axios.post(`${API_URL}/api/tests/generate`, {
        context
      }, {
        headers: { "Content-Type": "application/json" },
        timeout: 60000 // Higher timeout for AI generation
      });
      
      // Expected response: { testId: string, questions: any[] }
      return response.data;
    } catch (error: any) {
      console.error("Test Generation Error:", error);
      throw new Error(error.response?.data?.error || error.message || "Failed to generate test.");
    }
  }
}
