import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
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
        <div className={`px-5 py-3.5 rounded-2xl shadow-sm overflow-hidden ${
          isAI 
            ? "bg-[#2D2C2A] border border-[#3d3b38] text-foreground rounded-tl-sm shadow-md" 
            : "bg-primary-500 text-[#1c1b1a] rounded-tr-sm font-medium shadow-md shadow-primary-500/20"
        }`}>
          {isAI ? (
            <div className="leading-relaxed space-y-4 markdown-content text-sm md:text-base break-words">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                  h1: ({node, ...props}) => <h1 className="text-xl font-bold mt-4 mb-2 text-primary-300" {...props} />,
                  h2: ({node, ...props}) => <h2 className="text-lg font-bold mt-4 mb-2 text-primary-300" {...props} />,
                  h3: ({node, ...props}) => <h3 className="text-md font-bold mt-3 mb-2 text-primary-300" {...props} />,
                  ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-3 space-y-1 marker:text-primary-400" {...props} />,
                  ol: ({node, ...props}) => <ol className="list-decimal pl-5 mb-3 space-y-1 marker:text-primary-400" {...props} />,
                  li: ({node, ...props}) => <li className="mb-1" {...props} />,
                  strong: ({node, ...props}) => <strong className="font-semibold text-primary-200" {...props} />,
                  a: ({node, ...props}) => <a className="text-primary-400 hover:underline" {...props} />,
                  table: ({node, ...props}) => <div className="overflow-x-auto mb-4"><table className="min-w-full text-sm border-collapse border border-[#4a4845]" {...props} /></div>,
                  thead: ({node, ...props}) => <thead className="bg-[#1c1b1a]" {...props} />,
                  th: ({node, ...props}) => <th className="border border-[#4a4845] px-3 py-2 font-semibold text-left" {...props} />,
                  td: ({node, ...props}) => <td className="border border-[#4a4845] px-3 py-2" {...props} />,
                  code: ({node, inline, ...props}: any) => 
                    inline 
                      ? <code className="bg-[#1c1b1a] text-primary-300 px-1.5 py-0.5 rounded text-sm" {...props} />
                      : <pre className="bg-[#1c1b1a] p-3 rounded-md overflow-x-auto text-sm mb-3 border border-[#4a4845]"><code {...props} /></pre>
                }}
              >
                {content}
              </ReactMarkdown>
            </div>
          ) : (
            <p className="leading-relaxed whitespace-pre-wrap break-words">{content}</p>
          )}
        </div>
      </div>
    </div>
  );
}
