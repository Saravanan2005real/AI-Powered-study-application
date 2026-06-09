import React from "react";
import Link from "next/link";

interface SidebarProps {
  onPracticeTest?: () => void;
}

export default function Sidebar({ onPracticeTest }: SidebarProps) {
  return (
    <div className="w-64 h-full bg-[#1c1b1a] border-r border-[#3d3b38] flex flex-col shadow-sm">
      {/* Logo Area */}
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-primary-400 flex items-center justify-center text-[#1c1b1a] font-bold text-xl shadow-lg shadow-primary-400/20">
          E
        </div>
        <h1 className="text-xl font-bold gold-gradient-text tracking-tight">EduGenie AI</h1>
      </div>

      {/* New Chat Button */}
      <div className="px-4 mb-6">
        <button className="w-full bg-[#2D2C2A] hover:bg-[#3d3b38] border border-[#3d3b38] text-primary-400 font-medium py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          New Chat
        </button>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-4 space-y-1">
        <NavItem href="/" icon="chat" label="Chats" active />
        <NavItem href="/" icon="target" label="Study Goals" />
        <NavItem href="/developer-1" icon="user" label="Developer 1" />
        <NavItem href="/developer-2" icon="user" label="Developer 2" />
        <NavItem href="/" icon="settings" label="Settings" />
      </div>

      {/* Bottom Section */}
      <div className="p-4 border-t border-[#3d3b38]">
        {/* Practice Test Button (Replaced Tip of the Day) */}
        <div className="mb-4">
          <button 
            onClick={onPracticeTest}
            className="w-full bg-primary-400 hover:bg-primary-500 text-[#1c1b1a] font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] shadow-lg shadow-primary-400/20"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Practice Test
          </button>
          <p className="text-xs text-center text-foreground-muted mt-2">Test your knowledge</p>
        </div>
      </div>
    </div>
  );
}

function NavItem({ icon, label, active = false, href = "/" }: { icon: string; label: string; active?: boolean, href?: string }) {
  const getIcon = () => {
    switch (icon) {
      case 'chat': return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />;
      case 'target': return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />; 
      case 'user': return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />;
      case 'settings': return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />;
      default: return null;
    }
  };

  return (
    <Link
      href={href}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
        active 
          ? "bg-primary-400/10 text-primary-400 font-medium border border-primary-400/20" 
          : "text-foreground-muted hover:bg-[#3d3b38] hover:text-foreground"
      }`}
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        {getIcon()}
      </svg>
      {active && icon === 'settings' && (
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth={2} />
      )}
      {label}
    </Link>
  );
}
