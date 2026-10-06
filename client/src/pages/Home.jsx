import { useState } from "react";
import Sidebar from "../layout/Sidebar";
import { Menu } from "lucide-react";

const Home = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex h-screen bg-white font-sans text-slate-900">
      {/* Sidebar Component */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Chat Area */}
      <div className="flex flex-1 flex-col h-full relative">
        
        {/* Mobile Header (Shows only on small screens when sidebar is hidden) */}
        <header className="flex h-14 items-center border-b border-slate-200 px-4 md:hidden">
          <button
            onClick={toggleSidebar}
            className="rounded-md p-2 hover:bg-slate-100"
          >
            <Menu size={24} />
          </button>
          <span className="ml-3 font-semibold text-slate-700">DocSphere AI</span>
        </header>

        {/* Content Area (Where the chat messages will go) */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="mx-auto max-w-3xl h-full flex flex-col justify-center items-center text-center">
            <h1 className="text-4xl font-bold text-slate-300 mb-8">
              How can I help you today?
            </h1>
            {/* We will build the chat messages and input here next! */}
          </div>
        </main>
        
        {/* Chat Input Placeholder */}
        <div className="p-4 md:p-6 border-t border-slate-100 md:border-transparent">
           <div className="mx-auto max-w-3xl border border-slate-300 rounded-xl p-4 shadow-sm text-slate-400 bg-white">
              Message DocSphere AI...
           </div>
        </div>

      </div>

      {/* Overlay for mobile when sidebar is open */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/50 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </div>
  );
};

export default Home;
