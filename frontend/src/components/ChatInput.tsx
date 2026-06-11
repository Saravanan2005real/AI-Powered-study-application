"use client";

import React, { useState } from "react";

export default function ChatInput() {
  const [answerType, setAnswerType] = useState<"text" | "audio">("text");

  return (
    <div className="bg-[#2D2C2A] border-t border-[#3d3b38] p-4 w-full relative z-10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col gap-3 mb-3 px-2">
          {/* Mic Button added above Text Answer */}
          <button className="flex items-center gap-2 text-sm text-primary-400 hover:text-primary-300 transition-colors w-fit group">
            <div className="p-2 rounded-full bg-primary-400/10 group-hover:bg-primary-400/20 border border-primary-400/20 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </div>
            <span className="font-medium tracking-wide">Record Voice Note</span>
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

        <div className="relative flex items-end gap-2 bg-[#1c1b1a] border border-[#3d3b38] rounded-2xl p-2 focus-within:border-primary-400 focus-within:ring-1 focus-within:ring-primary-400 transition-all shadow-sm">
          <textarea
            className="w-full max-h-32 min-h-[44px] bg-transparent resize-none outline-none text-foreground placeholder-foreground-muted py-2.5 px-3"
            placeholder="Ask a question, generate a quiz, or request a study plan..."
            rows={1}
          />
          <button className="flex-shrink-0 w-11 h-11 bg-primary-400 hover:bg-primary-500 text-[#1c1b1a] rounded-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95 mb-0.5 shadow-sm">
            <svg className="w-5 h-5 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
