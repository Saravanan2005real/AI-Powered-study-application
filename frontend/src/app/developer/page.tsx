import React from "react";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";

export default function DeveloperPage() {
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
            <h2 className="text-xl font-bold text-foreground tracking-tight">Developers</h2>
            <Link href="/" className="px-4 py-2 bg-[#2D2C2A] hover:bg-[#3d3b38] rounded-xl text-primary-400 font-medium transition-colors">
              Back to App
            </Link>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 animate-fade-in flex items-center justify-center">
          <div className="flex flex-col md:flex-row gap-8 max-w-4xl w-full">
            
            {/* Developer 1 Card */}
            <div className="luxury-card p-10 flex-1 text-center">
              <div className="w-24 h-24 bg-[#3d3b38] rounded-full mx-auto mb-6 flex items-center justify-center border-2 border-primary-400/50 shadow-lg">
                <svg className="w-12 h-12 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-2">Pritika</h1>
              <p className="text-primary-400 font-medium mb-6 text-sm leading-relaxed">
                Transforming ideas into interactive web experiences through clean code and creative problem-solving. Focused on AI-driven innovation, responsive design, and continuous growth as a developer.
              </p>
              <a 
                href="https://www.linkedin.com/in/pritika-v-9336a0364/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block bg-primary-400 text-[#1c1b1a] px-6 py-2 rounded-xl font-bold hover:bg-primary-500 transition-colors shadow-lg shadow-primary-400/20"
              >
                LinkedIn Profile
              </a>
            </div>

            {/* Developer 2 Card */}
            <div className="luxury-card p-10 flex-1 text-center">
              <div className="w-24 h-24 bg-[#3d3b38] rounded-full mx-auto mb-6 flex items-center justify-center border-2 border-primary-400/50 shadow-lg">
                <svg className="w-12 h-12 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-2">Dhanusha</h1>
              <p className="text-primary-400 font-medium mb-6 text-sm leading-relaxed">
                Skilled in Python, Data Analysis, Machine Learning, and Frontend Development. Focused on creating user-friendly applications and solving real-world problems through technology.
              </p>
              <a 
                href="https://www.linkedin.com/in/dhanusha-m-24a482383/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block bg-primary-400 text-[#1c1b1a] px-6 py-2 rounded-xl font-bold hover:bg-primary-500 transition-colors shadow-lg shadow-primary-400/20"
              >
                LinkedIn Profile
              </a>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
