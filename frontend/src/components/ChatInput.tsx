"use client";

import React, { useState } from "react";
import { useAppContext } from "@/context/AppContext";
import { AIService } from "@/services/ai.service";

export default function ChatInput() {
  const [answerType, setAnswerType] = useState<"text" | "audio">("text");
  const [input, setInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = React.useRef<any>(null);
  const { addMessage, studentData, activeChatId } = useAppContext();

  const speak = (text: string) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      window.speechSynthesis.speak(utterance);
    }
  };

  const startRecording = () => {
    if (isRecording || isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsRecording(false);
      setIsListening(false);
      return;
    }

    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        alert("Speech Recognition API is not supported in this browser. Please use Chrome, Edge, or Brave.");
        return;
      }
      
      try {
        const recognition = new SpeechRecognition();
        recognitionRef.current = recognition;
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
          setIsRecording(true);
          setIsListening(true);
        };
        
        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInput(prev => prev ? `${prev} ${transcript}` : transcript);
          setIsListening(false);
        };

        recognition.onerror = (event: any) => {
          if (event.error !== 'aborted' && event.error !== 'no-speech') {
            console.error("Speech recognition error:", event.error);
          }
          setIsRecording(false);
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsRecording(false);
          setIsListening(false);
        };

        recognition.start();
      } catch (error) {
        console.error("Failed to start speech recognition:", error);
        setIsRecording(false);
        setIsListening(false);
      }
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isGenerating) return;
    
    const userText = input.trim();
    addMessage(userText, "user");
    setInput("");
    setIsGenerating(true);

    try {
      // Pass the user context inside the message string
      const contextPrefix = studentData?.name ? `I am ${studentData.name}. ` : "";
      const goalPrefix = studentData?.goal ? `My study goal is ${studentData.goal}. ` : "";
      const fullMessage = `${contextPrefix}${goalPrefix}${userText}`;
      
      const aiResponse = await AIService.sendMessage(fullMessage, activeChatId);
      if (aiResponse) {
        addMessage(aiResponse, "ai");
        if (answerType === "audio") {
          speak(aiResponse);
        }
      }
    } catch (error: any) {
      console.error("Chat Error:", error);
      addMessage(`Error: ${error.message || "Failed to generate AI response. Please try again."}`, "ai");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="bg-[#2D2C2A] border-t border-[#3d3b38] p-4 w-full relative z-10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col gap-3 mb-3 px-2">
          {/* Mic Button added above Text Answer */}
          <button 
            onClick={startRecording}
            className={`flex items-center gap-2 text-sm transition-colors w-fit group ${isRecording ? 'text-red-500 hover:text-red-400' : 'text-primary-400 hover:text-primary-300'}`}
          >
            <div className={`p-2 rounded-full transition-colors ${isRecording ? 'bg-red-500/20 border border-red-500/30 animate-pulse' : 'bg-primary-400/10 group-hover:bg-primary-400/20 border border-primary-400/20'}`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </div>
            <span className="font-medium tracking-wide">
              {isListening ? "Listening..." : isRecording ? "Processing..." : "Record Voice Note"}
            </span>
          </button>
          
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 text-sm text-foreground-muted cursor-pointer group">
              <div className="relative flex items-center justify-center">
                <input 
                  type="radio" 
                  name="answerType" 
                  className="peer appearance-none w-4 h-4 border border-[#3d3b38] rounded-full checked:border-primary-400 transition-colors bg-[#1c1b1a]" 
                  checked={answerType === "text"}
                  onChange={() => setAnswerType("text")}
                />
                <div className="absolute w-2 h-2 rounded-full bg-primary-400 opacity-0 peer-checked:opacity-100 transition-opacity"></div>
              </div>
              <span className="group-hover:text-foreground transition-colors">Text Answer</span>
            </label>
            <label className="flex items-center gap-2 text-sm text-foreground-muted cursor-pointer group">
              <div className="relative flex items-center justify-center">
                <input 
                  type="radio" 
                  name="answerType" 
                  className="peer appearance-none w-4 h-4 border border-[#3d3b38] rounded-full checked:border-primary-400 transition-colors bg-[#1c1b1a]"
                  checked={answerType === "audio"}
                  onChange={() => setAnswerType("audio")}
                />
                <div className="absolute w-2 h-2 rounded-full bg-primary-400 opacity-0 peer-checked:opacity-100 transition-opacity"></div>
              </div>
              <span className="group-hover:text-foreground transition-colors">Audio Answer</span>
            </label>
          </div>
        </div>

        <div className={`relative flex items-end gap-2 bg-[#1c1b1a] border border-[#3d3b38] rounded-2xl p-2 transition-all shadow-sm ${isGenerating ? 'opacity-70' : 'focus-within:border-primary-400 focus-within:ring-1 focus-within:ring-primary-400'}`}>
          <textarea
            className="w-full max-h-32 min-h-[44px] bg-transparent resize-none outline-none text-foreground placeholder-foreground-muted py-2.5 px-3"
            placeholder={isGenerating ? "EduGenie is typing..." : "Ask a question, generate a quiz, or request a study plan..."}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isGenerating}
          />
          <button 
            onClick={handleSend} 
            disabled={isGenerating || !input.trim()}
            className="flex-shrink-0 w-11 h-11 bg-primary-400 hover:bg-primary-500 disabled:bg-[#3d3b38] disabled:text-[#888] text-[#1c1b1a] rounded-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95 mb-0.5 shadow-sm"
          >
            {isGenerating ? (
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg className="w-5 h-5 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
