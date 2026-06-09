import React from "react";

type ChatMessageProps = {
  role: "user" | "ai";
  content: string;
};

export default function ChatMessage({ role, content }: ChatMessageProps) {
  const isAI = role === "ai";

  return (
    <div className={`flex w-full ${isAI ? "justify-start" : "justify-end"} mb-6 animate-fade-in`}>
      <div className={`flex gap-4 max-w-[85%] md:max-w-[75%] ${isAI ? "flex-row" : "flex-row-reverse"}`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-sm ${isAI ? "bg-primary-400/20 text-primary-400 border border-primary-400/30" : "bg-[#3d3b38] text-foreground-muted border border-[#4a4845]"}`}>
          {isAI ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          )}
        </div>
        
        {/* Bubble */}
        <div className={`px-5 py-3.5 rounded-2xl shadow-sm ${
          isAI 
            ? "bg-[#2D2C2A] border border-[#3d3b38] text-foreground rounded-tl-sm shadow-md" 
            : "bg-primary-500 text-[#1c1b1a] rounded-tr-sm font-medium shadow-md shadow-primary-500/20"
        }`}>
          <p className="leading-relaxed">{content}</p>
        </div>
      </div>
    </div>
  );
}
