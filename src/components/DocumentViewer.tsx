"use client";

import React, { useState } from "react";

export default function DocumentViewer() {
  const [isUploaded, setIsUploaded] = useState(false);

  return (
    <div className="flex-1 h-full bg-[#1c1b1a] border-l border-[#3d3b38] flex flex-col animate-fade-in relative overflow-hidden">
      {/* Viewer Header */}
      <div className="flex-shrink-0 px-6 py-4 border-b border-[#3d3b38] bg-[#2D2C2A]/80 backdrop-blur-md flex items-center justify-between z-10">
        <h3 className="text-lg font-semibold text-foreground tracking-tight flex items-center gap-2">
          <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Study Material
        </h3>
        <button className="text-xs font-medium text-primary-400 hover:text-primary-300 transition-colors bg-primary-400/10 px-3 py-1.5 rounded-full border border-primary-400/20">
          Upload New
        </button>
      </div>

      {/* Viewer Body */}
      <div className="flex-1 overflow-y-auto p-6 relative">
        {!isUploaded ? (
          <div className="h-full flex flex-col items-center justify-center border-2 border-dashed border-[#3d3b38] rounded-2xl hover:border-primary-400/50 transition-colors cursor-pointer group bg-[#2D2C2A]/30">
            <div className="w-16 h-16 bg-[#2D2C2A] rounded-2xl flex items-center justify-center mb-4 text-primary-400 group-hover:scale-110 transition-transform shadow-md border border-[#3d3b38]">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            </div>
            <p className="text-foreground font-medium text-lg mb-1 group-hover:text-primary-400 transition-colors">Drag & drop your file here</p>
            <p className="text-foreground-muted text-sm text-center px-4 max-w-xs">
              Upload PDFs, documents, or images to analyze alongside your chat.
            </p>
            <button 
              className="mt-6 bg-[#3d3b38] hover:bg-[#4a4845] text-foreground px-6 py-2.5 rounded-xl font-medium transition-colors border border-[#4a4845]"
              onClick={() => setIsUploaded(true)}
            >
              Simulate Upload
            </button>
          </div>
        ) : (
          <div className="w-full min-h-[800px] luxury-card p-8 flex flex-col animate-fade-in relative">
            <div className="absolute top-4 right-4 flex gap-2">
              <span className="animate-pulse-soft bg-primary-400/20 text-primary-400 text-xs px-2 py-1 rounded-md border border-primary-400/30 font-medium">Processing Context...</span>
            </div>
            <div className="w-full h-8 bg-[#3d3b38] rounded-md mb-6 w-3/4"></div>
            <div className="w-full h-4 bg-[#3d3b38]/60 rounded-md mb-3 w-full"></div>
            <div className="w-full h-4 bg-[#3d3b38]/60 rounded-md mb-3 w-5/6"></div>
            <div className="w-full h-4 bg-[#3d3b38]/60 rounded-md mb-3 w-full"></div>
            <div className="w-full h-4 bg-[#3d3b38]/60 rounded-md mb-8 w-4/5"></div>
            
            <div className="w-full h-64 bg-[#3d3b38]/40 rounded-xl mb-8 flex items-center justify-center border border-[#3d3b38]">
              <svg className="w-12 h-12 text-[#4a4845]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            
            <div className="w-full h-4 bg-[#3d3b38]/60 rounded-md mb-3 w-full"></div>
            <div className="w-full h-4 bg-[#3d3b38]/60 rounded-md mb-3 w-full"></div>
            <div className="w-full h-4 bg-[#3d3b38]/60 rounded-md mb-3 w-3/4"></div>
          </div>
        )}
      </div>
    </div>
  );
}
