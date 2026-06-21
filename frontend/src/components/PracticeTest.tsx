"use client";

import React, { useState } from "react";
import { useAppContext } from "@/context/AppContext";
import { AIService } from "@/services/ai.service";

type Question = {
  question: string;
  options: string[];
  correctAnswer: number;
};

export default function PracticeTest() {
  const { studentData, addCompletedTest, setIsMobileMenuOpen } = useAppContext();
  const [testState, setTestState] = useState<"start" | "loading" | "in_progress" | "results" | "error">("start");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [errorMsg, setErrorMsg] = useState("");

  const startTest = async () => {
    setTestState("loading");
    try {
      const subject = studentData?.subject || "General Knowledge";
      const goal = studentData?.goal || "Learn something new";
      
      const generatedQuestions = await AIService.generatePracticeTest(subject, goal);
      
      if (!Array.isArray(generatedQuestions) || generatedQuestions.length === 0) {
        throw new Error("Invalid format received from AI.");
      }

      setQuestions(generatedQuestions);
      setTestState("in_progress");
      setCurrentQuestionIdx(0);
      setAnswers([]);
    } catch (error: any) {
      setErrorMsg(error.message || "Failed to generate test. Make sure your Groq API key is valid.");
      setTestState("error");
    }
  };

  const handleAnswer = (optionIdx: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIdx] = optionIdx;
    setAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (currentQuestionIdx < questions.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
    } else {
      addCompletedTest();
      setTestState("results");
    }
  };

  const calculateScore = () => {
    let score = 0;
    answers.forEach((ans, idx) => {
      if (ans === questions[idx].correctAnswer) score++;
    });
    return score;
  };

  return (
    <div className="flex-1 h-full bg-[#1c1b1a] overflow-y-auto custom-scrollbar p-8 animate-fade-in relative">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden p-2 -ml-2 text-foreground-muted hover:bg-[#3d3b38] rounded-lg transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h2 className="text-2xl font-bold text-foreground">Practice Test</h2>
        </div>
        
        {testState === "start" && (
          <div className="luxury-card p-8 flex flex-col items-center justify-center text-center py-16">
            <div className="w-16 h-16 bg-primary-400/20 text-primary-400 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-foreground mb-3">Ready to test your knowledge?</h3>
            <p className="text-foreground-muted mb-8 max-w-md">We will generate a quick 3-question quiz based on your focus in {studentData?.subject || 'this subject'}.</p>
            <button 
              onClick={startTest}
              className="bg-primary-400 hover:bg-primary-500 text-[#1c1b1a] px-8 py-3 rounded-xl font-medium transition-all shadow-sm hover:scale-105 active:scale-95"
            >
              Generate AI Test
            </button>
          </div>
        )}

        {testState === "loading" && (
          <div className="luxury-card p-8 flex flex-col items-center justify-center text-center py-16">
            <svg className="w-12 h-12 text-primary-400 animate-spin mb-6" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <h3 className="text-xl font-bold text-foreground mb-2">EduGenie is thinking...</h3>
            <p className="text-foreground-muted">Crafting personalized questions for you.</p>
          </div>
        )}

        {testState === "error" && (
          <div className="luxury-card p-8 flex flex-col items-center justify-center text-center py-16 border-red-500/30 bg-red-500/5">
            <div className="w-16 h-16 bg-red-500/20 text-red-500 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-foreground mb-3">Test Generation Failed</h3>
            <p className="text-red-400 mb-8 max-w-md">{errorMsg}</p>
            <button 
              onClick={() => setTestState("start")}
              className="bg-[#3d3b38] hover:bg-[#4a4845] text-foreground px-8 py-3 rounded-xl font-medium transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {testState === "in_progress" && questions.length > 0 && (
          <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <span className="text-sm font-medium text-foreground-muted">Question {currentQuestionIdx + 1} of {questions.length}</span>
              <div className="flex gap-1">
                {questions.map((_, i) => (
                  <div key={i} className={`w-8 h-2 rounded-full ${i <= currentQuestionIdx ? 'bg-primary-400' : 'bg-[#3d3b38]'}`}></div>
                ))}
              </div>
            </div>

            <div className="luxury-card p-8 mb-6">
              <h3 className="text-xl font-medium text-foreground mb-6 leading-relaxed">
                {questions[currentQuestionIdx].question}
              </h3>

              <div className="flex flex-col gap-3">
                {questions[currentQuestionIdx].options.map((opt, idx) => (
                  <button 
                    key={idx}
                    onClick={() => handleAnswer(idx)}
                    className={`w-full text-left p-4 rounded-xl border transition-all ${
                      answers[currentQuestionIdx] === idx 
                        ? 'border-primary-400 bg-primary-400/10 text-foreground' 
                        : 'border-[#3d3b38] bg-[#2D2C2A]/50 text-foreground-muted hover:border-primary-400/50 hover:bg-[#2D2C2A]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${answers[currentQuestionIdx] === idx ? 'border-primary-400' : 'border-[#4a4845]'}`}>
                        {answers[currentQuestionIdx] === idx && <div className="w-2.5 h-2.5 rounded-full bg-primary-400"></div>}
                      </div>
                      <span className="font-medium">{opt}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <button 
                onClick={nextQuestion}
                disabled={answers[currentQuestionIdx] === undefined}
                className="bg-primary-400 hover:bg-primary-500 disabled:bg-[#3d3b38] disabled:text-[#888] text-[#1c1b1a] px-8 py-3 rounded-xl font-medium transition-all"
              >
                {currentQuestionIdx === questions.length - 1 ? "Finish Test" : "Next Question"}
              </button>
            </div>
          </div>
        )}

        {testState === "results" && (
          <div className="luxury-card p-8 flex flex-col items-center justify-center text-center py-16 animate-fade-in">
            <div className="w-24 h-24 bg-primary-400/20 rounded-full flex items-center justify-center mb-6 border-4 border-primary-400/30">
              <span className="text-3xl font-bold text-primary-400">{calculateScore()}/{questions.length}</span>
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-3">Test Completed!</h3>
            <p className="text-foreground-muted mb-8 max-w-md">Great job practicing. We've updated your progress tracker with a new completed test.</p>
            <div className="flex gap-4">
              <button 
                onClick={() => setTestState("start")}
                className="bg-[#3d3b38] hover:bg-[#4a4845] text-foreground px-6 py-3 rounded-xl font-medium transition-colors"
              >
                Take Another
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
