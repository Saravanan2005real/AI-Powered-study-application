"use client";

import React, { useState, useEffect } from "react";
import { useAppContext } from "@/context/AppContext";
import { AIService } from "@/services/ai.service";
import axios from "axios";

type Question = {
  type: "mcq" | "true_false" | "fill_blank" | "short_answer";
  question: string;
  options?: string[];
  correctAnswer?: number;
  correctText?: string;
  explanation: string;
  topicName: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export default function PracticeTest() {
  const { studentData, addCompletedTest, setIsMobileMenuOpen, chats, activeChatId, goals, toggleGoal, uploadedFiles } = useAppContext();
  const [testState, setTestState] = useState<"start" | "loading" | "in_progress" | "results" | "error">("start");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState<any[]>([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [testId, setTestId] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<number>(0);
  const [detailedResults, setDetailedResults] = useState<any[]>([]);

  const startTest = async () => {
    setTestState("loading");
    try {
      const subject = studentData?.subject || "General Knowledge";
      const goal = studentData?.goal || "Learn something new";
      
      const activeChat = chats.find(c => c.id === activeChatId);
      const messages = activeChat?.messages.slice(-10) || [];
      const materials = uploadedFiles || [];
      
      const context = {
        subject,
        goal,
        goals: goals.filter(g => !g.completed).slice(0, 5),
        messages,
        materials
      };
      
      const response = await AIService.generatePracticeTest(context);
      
      if (!response || !response.questions || response.questions.length === 0) {
        throw new Error("Invalid format received from AI.");
      }

      setQuestions(response.questions);
      setTestId(response.testId);
      setTestState("in_progress");
      setCurrentQuestionIdx(0);
      setAnswers(new Array(response.questions.length).fill(null));
      setStartTime(Date.now());
    } catch (error: any) {
      setErrorMsg(error.message || "Failed to generate test.");
      setTestState("error");
    }
  };

  const handleAnswer = (answer: string | number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIdx] = answer;
    setAnswers(newAnswers);
  };

  const evaluateAnswer = (question: Question, answer: any) => {
    if (question.type === "mcq" || question.type === "true_false") {
      return answer === question.correctAnswer;
    } else {
      if (!answer) return false;
      const normalize = (str: string) => str.toLowerCase().replace(/[^a-z0-9]/g, '');
      return normalize(answer as string) === normalize(question.correctText || "");
    }
  };

  const nextQuestion = async () => {
    if (currentQuestionIdx < questions.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
    } else {
      // Finish Test
      const duration = Math.floor((Date.now() - startTime) / 1000);
      let correctAnswersCount = 0;
      
      const results = questions.map((q, idx) => {
        const isCorrect = evaluateAnswer(q, answers[idx]);
        if (isCorrect) correctAnswersCount++;
        return {
          question: q.question,
          topicName: q.topicName,
          isCorrect,
          userAnswer: answers[idx],
          explanation: q.explanation
        };
      });

      const finalScore = (correctAnswersCount / questions.length) * 100;
      setDetailedResults(results);

      // Automatically mark related goals as achieved if score is high
      if (finalScore >= 80) {
        const testSubject = studentData?.subject?.toLowerCase() || "";
        const masteredTopics = results.filter(r => r.isCorrect).map(r => r.topicName.toLowerCase());
        
        goals.forEach(g => {
          if (!g.completed) {
            const goalTitle = g.title.toLowerCase();
            const matchesSubject = testSubject && goalTitle.includes(testSubject);
            const matchesTopic = masteredTopics.some(topic => goalTitle.includes(topic) || topic.includes(goalTitle));
            
            if (matchesSubject || matchesTopic) {
              toggleGoal(g.id);
            }
          }
        });
      }

      try {
        if (testId) {
          const evalRes = await axios.post(`${API_URL}/api/tests/${testId}/evaluate`, {
            correctAnswers: correctAnswersCount,
            wrongAnswers: questions.length - correctAnswersCount,
            finalScore,
            duration,
            detailedResults: results
          });
          
          // Force UI to sync if needed. But for now local storage needs to track tests at least
          addCompletedTest();
          // Assuming `setStudyHours` updates UI. In `AppContext`, `setStudyHours` needs (prev => prev + time)
          // We can't call setStudyHours here if it's not exported properly, but we have `addStudyHour` 
          // Wait, addStudyHour just adds 1. We will update the progress tracker to fetch from API next.
        }
      } catch (err) {
        console.error("Failed to save test results", err);
      }

      setTestState("results");
    }
  };

  const renderQuestionInput = () => {
    const q = questions[currentQuestionIdx];
    const currentAnswer = answers[currentQuestionIdx];

    if (q.type === "mcq" || q.type === "true_false") {
      return (
        <div className="flex flex-col gap-3">
          {q.options?.map((opt, idx) => (
            <button 
              key={idx}
              onClick={() => handleAnswer(idx)}
              className={`w-full text-left p-4 rounded-xl border transition-all ${
                currentAnswer === idx 
                  ? 'border-primary-400 bg-primary-400/10 text-foreground' 
                  : 'border-[#3d3b38] bg-[#2D2C2A]/50 text-foreground-muted hover:border-primary-400/50 hover:bg-[#2D2C2A]'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${currentAnswer === idx ? 'border-primary-400' : 'border-[#4a4845]'}`}>
                  {currentAnswer === idx && <div className="w-2.5 h-2.5 rounded-full bg-primary-400"></div>}
                </div>
                <span className="font-medium">{opt}</span>
              </div>
            </button>
          ))}
        </div>
      );
    } else {
      return (
        <div className="flex flex-col gap-3">
          <input 
            type="text" 
            value={(currentAnswer as string) || ""}
            onChange={(e) => handleAnswer(e.target.value)}
            placeholder="Type your answer here..."
            className="w-full bg-[#1c1b1a] border border-[#3d3b38] rounded-xl p-4 text-foreground focus:outline-none focus:border-primary-400"
          />
        </div>
      );
    }
  };

  const calculateScore = () => {
    return detailedResults.filter(r => r.isCorrect).length;
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
            <p className="text-foreground-muted mb-8 max-w-md">We will generate a personalized quiz based on your chats, goals, and uploaded materials.</p>
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
            <p className="text-foreground-muted">Crafting personalized questions based on your study materials and chat history.</p>
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
              <span className="inline-block px-3 py-1 bg-primary-400/10 text-primary-400 text-xs font-bold uppercase tracking-wider rounded-full mb-4">
                {questions[currentQuestionIdx].topicName}
              </span>
              <h3 className="text-xl font-medium text-foreground mb-6 leading-relaxed">
                {questions[currentQuestionIdx].question}
              </h3>

              {renderQuestionInput()}
            </div>

            <div className="flex justify-end">
              <button 
                onClick={nextQuestion}
                disabled={answers[currentQuestionIdx] === null || answers[currentQuestionIdx] === ''}
                className="bg-primary-400 hover:bg-primary-500 disabled:bg-[#3d3b38] disabled:text-[#888] text-[#1c1b1a] px-8 py-3 rounded-xl font-medium transition-all"
              >
                {currentQuestionIdx === questions.length - 1 ? "Submit Test" : "Next Question"}
              </button>
            </div>
          </div>
        )}

        {testState === "results" && (
          <div className="animate-fade-in pb-12">
            <div className="luxury-card p-8 flex flex-col items-center justify-center text-center py-12 mb-8">
              <div className="w-24 h-24 bg-primary-400/20 rounded-full flex items-center justify-center mb-6 border-4 border-primary-400/30">
                <span className="text-3xl font-bold text-primary-400">{calculateScore()}/{questions.length}</span>
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">Test Completed!</h3>
              <p className="text-foreground-muted mb-8 max-w-md">Your progress and analytics have been updated automatically.</p>
              <button 
                onClick={() => setTestState("start")}
                className="bg-[#3d3b38] hover:bg-[#4a4845] text-foreground px-6 py-3 rounded-xl font-medium transition-colors"
              >
                Take Another Test
              </button>
            </div>

            <h3 className="text-xl font-bold text-foreground mb-6">Detailed Results</h3>
            <div className="space-y-6">
              {detailedResults.map((res, idx) => (
                <div key={idx} className={`luxury-card p-6 border-l-4 ${res.isCorrect ? 'border-green-500' : 'border-red-500'}`}>
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="text-lg font-medium text-foreground">{res.question}</h4>
                    <span className={`px-2 py-1 text-xs font-bold rounded ${res.isCorrect ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                      {res.isCorrect ? 'CORRECT' : 'INCORRECT'}
                    </span>
                  </div>
                  <div className="mb-4">
                    <span className="text-sm font-medium text-foreground-muted block mb-1">Topic: {res.topicName}</span>
                    <span className="text-sm text-foreground-muted block">
                      Your Answer: <strong className="text-foreground">{
                        questions[idx].type === "mcq" || questions[idx].type === "true_false" 
                          ? questions[idx].options?.[res.userAnswer as number]
                          : res.userAnswer
                      }</strong>
                    </span>
                  </div>
                  <div className="bg-[#2D2C2A]/50 p-4 rounded-xl border border-[#3d3b38]">
                    <h5 className="text-sm font-bold text-foreground mb-1">Explanation:</h5>
                    <p className="text-sm text-foreground-muted">{res.explanation}</p>
                    {!res.isCorrect && (
                      <p className="text-sm font-medium text-primary-400 mt-2">
                        Correct Answer: {
                          questions[idx].type === "mcq" || questions[idx].type === "true_false"
                            ? questions[idx].options?.[questions[idx].correctAnswer!]
                            : questions[idx].correctText
                        }
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
