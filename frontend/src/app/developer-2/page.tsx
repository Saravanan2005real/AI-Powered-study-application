import React from "react";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";

export default function Developer2() {
  return (
    <div className="flex h-screen bg-background overflow-hidden selection:bg-primary-400/30 selection:text-primary-400">
      {/* Sidebar - Hidden on mobile, block on md+ */}
      <div className="hidden md:block w-64 flex-shrink-0 border-r border-[#3d3b38]">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full relative overflow-hidden bg-background">
        <header className="flex-shrink-0 border-b border-[#3d3b38] bg-[#2D2C2A]/80 backdrop-blur-md px-6 py-4 sticky top-0 z-10 shadow-sm">
          <div className="flex items-center justify-between mx-auto">
            <h2 className="text-xl font-bold text-foreground tracking-tight">Developer 2 Profile</h2>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 flex items-center justify-center animate-fade-in">
          <div className="luxury-card p-10 max-w-lg w-full text-center">
            <div className="w-24 h-24 bg-[#3d3b38] rounded-full mx-auto mb-6 flex items-center justify-center border-2 border-primary-400/50 shadow-lg">
              <svg className="w-12 h-12 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Developer 2</h1>
            <p className="text-primary-400 font-medium mb-6">Frontend Architecture Lead</p>
            <p className="text-foreground-muted mb-8 leading-relaxed">
              Crafting premium, modern interfaces with React and Tailwind CSS. Obsessed with micro-interactions, dark mode aesthetics, and performance.
            </p>
            <Link href="/" className="inline-block bg-[#3d3b38] text-foreground border border-[#4a4845] px-6 py-3 rounded-xl font-bold hover:bg-[#4a4845] transition-colors shadow-lg">
              Return to App
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
