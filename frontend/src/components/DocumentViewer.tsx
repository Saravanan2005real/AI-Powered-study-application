"use client";

import React, { useRef, useState } from "react";
import { useAppContext } from "@/context/AppContext";
import GlobalLoader from "./GlobalLoader";
import axios from "axios";

export default function DocumentViewer() {
  const { isUploaded, setIsUploaded, uploadFiles, uploadedFiles, activeChatId } = useAppContext();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

  const handleFileUpload = async (files: FileList | File[]) => {
    if (!activeChatId) {
      alert("Please start a chat session first.");
      return;
    }
    
    setUploadStatus("Uploading file...");
    const fileArray = Array.from(files);
    
    // Simulate complex progress steps to keep the user informed
    const typeTimer = setTimeout(() => setUploadStatus("Detecting file type..."), 1000);
    const extractTimer = setTimeout(() => setUploadStatus("Extracting text..."), 2500);
    const ocrTimer = setTimeout(() => setUploadStatus("Running OCR..."), 4500);
    const analyzeTimer = setTimeout(() => setUploadStatus("Analyzing with AI..."), 7000);
    
    try {
      const successfulUploads: any[] = [];
      
      for (const file of fileArray) {
        const singleFormData = new FormData();
        singleFormData.append("file", file);
        singleFormData.append("chatId", activeChatId);
        
        try {
          const response = await axios.post(`${API_URL}/api/materials`, singleFormData, {
            headers: { "Content-Type": "multipart/form-data" }
          });
          
          if (response.data) {
            successfulUploads.push({
              name: response.data.fileName || file.name,
              type: response.data.mimeType || file.type,
              size: response.data.size || file.size,
              extractedTextLength: response.data.extractedTextLength || 0,
              extractionStatus: response.data.extractionStatus || "SUCCESS"
            });
          }
        } catch (fileErr: any) {
          console.error("Failed to upload single file:", file.name, fileErr);
          successfulUploads.push({
            name: file.name,
            type: file.type,
            size: file.size,
            error: fileErr.response?.data?.error || "Upload failed"
          });
        }
      }

      setUploadStatus("Analysis complete.");
      setTimeout(() => {
        setUploadStatus(null);
        if (successfulUploads.length > 0) {
          // This expects the context to accept these new fields or just generic any.
          uploadFiles(successfulUploads as any);
        }
      }, 1000);
      
    } catch (error) {
      console.error("Upload failed", error);
      alert("Failed to upload files. Please check the backend connection.");
      setUploadStatus(null);
    } finally {
      clearTimeout(typeTimer);
      clearTimeout(extractTimer);
      clearTimeout(ocrTimer);
      clearTimeout(analyzeTimer);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileUpload(e.target.files);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  return (
    <>
    <GlobalLoader isVisible={uploadStatus !== null} text={uploadStatus || "Parsing and Analyzing Documents..."} />
    <div className="flex-1 h-full bg-[#1c1b1a] border-l border-[#3d3b38] flex flex-col animate-fade-in relative overflow-hidden">
      {/* Viewer Header */}
      <div className="flex-shrink-0 px-6 py-4 border-b border-[#3d3b38] bg-[#2D2C2A]/80 backdrop-blur-md flex items-center justify-between z-10">
        <h3 className="text-lg font-semibold text-foreground tracking-tight flex items-center gap-2">
          <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Study Material
        </h3>
        <button 
          onClick={() => setIsUploaded(false)}
          className="text-xs font-medium text-primary-400 hover:text-primary-300 transition-colors bg-primary-400/10 px-3 py-1.5 rounded-full border border-primary-400/20"
        >
          {isUploaded ? "Clear Files" : "Upload New"}
        </button>
      </div>

      {/* Hidden File Input */}
      <input 
        type="file" 
        multiple 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
        accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
      />

      {/* Viewer Body */}
      <div className="flex-1 overflow-y-auto p-6 relative">
        {!isUploaded ? (
          <div 
            className="h-full flex flex-col items-center justify-center border-2 border-dashed border-[#3d3b38] rounded-2xl hover:border-primary-400/50 transition-colors cursor-pointer group bg-[#2D2C2A]/30"
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
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
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
            >
              Select Files
            </button>
          </div>
        ) : (
          <div className="w-full min-h-[800px] luxury-card p-8 flex flex-col animate-fade-in relative">
            <div className="absolute top-4 right-4 flex gap-2">
              <span className="animate-pulse-soft bg-primary-400/20 text-primary-400 text-xs px-2 py-1 rounded-md border border-primary-400/30 font-medium">Active Context</span>
            </div>
            
            {/* Real File Names Overlaid */}
            <div className="mb-8">
              <h4 className="text-foreground font-bold mb-3 border-b border-[#3d3b38] pb-2">Uploaded Materials</h4>
              {uploadedFiles.map((f: any, i: number) => (
                <div key={i} className="flex flex-col gap-1 py-3 text-primary-400 border-b border-[#3d3b38]/50">
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                    <span className="truncate font-medium">{f.name}</span>
                    <span className="text-xs text-foreground-muted ml-auto bg-[#3d3b38] px-2 py-1 rounded-md">{(f.size / 1024).toFixed(1)} KB</span>
                  </div>
                  
                  <div className="pl-8 flex flex-wrap gap-2 text-xs text-foreground-muted mt-1">
                    <span className="bg-[#2D2C2A] px-2 py-1 rounded">Type: {f.type}</span>
                    {f.extractedTextLength !== undefined && (
                      <span className="bg-[#2D2C2A] px-2 py-1 rounded">Text Length: {f.extractedTextLength} chars</span>
                    )}
                    {f.extractionStatus && (
                      <span className={`px-2 py-1 rounded ${f.extractionStatus === 'SUCCESS' ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
                        Status: {f.extractionStatus}
                      </span>
                    )}
                    {f.error && (
                      <span className="bg-red-900/30 text-red-400 px-2 py-1 rounded">Error: {f.error}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Simulated Document Content Background */}
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
            <div className="w-full h-2 bg-[#3d3b38]/40 rounded-md mb-2 w-5/6"></div>
            <div className="w-full h-2 bg-[#3d3b38]/40 rounded-md mb-2 w-4/6"></div>
          </div>
        )}
      </div>
    </div>
    </>
  );
}
