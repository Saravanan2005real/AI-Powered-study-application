import React from "react";

export default function QuickActions() {
  const actions = [
    { title: "Generate Study Plan", desc: "Create a timeline for exams", icon: "calendar" },
    { title: "Recommended Resources", desc: "Find articles and videos", icon: "book" },
    { title: "Create Quiz", desc: "Test your knowledge", icon: "check" },
    { title: "Explain a Topic", desc: "Simplify complex concepts", icon: "lightbulb" },
  ];

  const getIcon = (name: string) => {
    switch (name) {
      case "calendar": return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />;
      case "book": return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />;
      case "check": return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />;
      case "lightbulb": return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />;
      default: return null;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 w-full max-w-3xl">
      {actions.map((action, idx) => (
        <button 
          key={idx}
          className="flex flex-col text-left p-4 bg-[#2D2C2A] border border-[#3d3b38] rounded-xl shadow-sm hover:shadow-lg hover:border-primary-400/50 transition-all group"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-[#3d3b38] text-primary-400 flex items-center justify-center group-hover:bg-primary-400/20 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {getIcon(action.icon)}
              </svg>
            </div>
            <h3 className="font-semibold text-foreground">{action.title}</h3>
          </div>
          <p className="text-sm text-foreground-muted">{action.desc}</p>
        </button>
      ))}
    </div>
  );
}
