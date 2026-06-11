import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export class AIService {
  static async sendMessage(message: string) {
    try {
      console.log("Sending message to backend AI service...", { API_URL, message });
      const response = await axios.post(`${API_URL}/api/chat`, {
        message
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

  static async generatePracticeTest(subject: string, goal: string) {
    const prompt = `Generate a 3-question multiple choice practice test for a student studying "${subject}" with the goal to "${goal}". 
Return ONLY a valid JSON array of objects with the exact following structure:
[
  {
    "question": "Question text here",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 0
  }
]
No markdown wrapping, no explanation, just the raw JSON array.`;

    try {
      const result = await this.sendMessage(prompt);
      
      try {
        const jsonMatch = result.match(/\[[\s\S]*\]/);
        const jsonStr = jsonMatch ? jsonMatch[0] : result;
        return JSON.parse(jsonStr);
      } catch (e) {
        throw new Error("AI returned malformed test data.");
      }
    } catch (error: any) {
      throw error;
    }
  }
}
