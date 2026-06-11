export class AIService {
  static async sendMessage(messages: { role: string; content: string }[], systemPrompt?: string) {
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages, systemPrompt })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to communicate with AI");
      }

      return data.content;
    } catch (error: any) {
      console.error("AIService Error:", error);
      throw new Error(error.message || "An unexpected error occurred");
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
      const result = await this.sendMessage([{ role: "user", content: prompt }]);
      
      // Attempt to parse the JSON
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
