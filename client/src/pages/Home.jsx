import { useState } from "react";
import Sidebar from "../layout/Sidebar";
import { Menu } from "lucide-react";
import ChatInput from "../components/ChatInput";

const Home = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900">
      {/* Sidebar Component */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Chat Area */}
      <div className="flex flex-1 flex-col h-full relative">
        
        {/* Mobile Header (Shows only on small screens when sidebar is hidden) */}
        <header className="flex h-14 items-center bg-white border-b border-slate-200 px-4 md:hidden">
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
            {/* Future chat messages will be mapped here */}
          </div>
        </main>
        
        {/* Chat Input Area */}
        <div className="p-4 md:p-6 bg-gradient-to-t from-slate-50 to-transparent relative z-10">
           <ChatInput 
             onSendMessage={(msg, file) => {
               console.log("Sending message:", msg, "File:", file?.name);
               // Future: Add action to dispatch message or upload logic
             }} 
           />
           <div className="text-xs text-center text-slate-400 mt-3">
             DocSphere AI can make mistakes. Consider verifying important information.
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
