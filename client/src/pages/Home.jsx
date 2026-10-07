import { useState, useRef, useEffect } from "react";
import Sidebar from "../layout/Sidebar";
import { Menu } from "lucide-react";
import ChatInput from "../components/ChatInput";
import ChatMessage from "../components/ChatMessage";

const Home = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (msg, file) => {
    if (!msg.trim() && !file) return;

    // Add user message
    const newUserMessage = {
      id: Date.now().toString(),
      role: "user",
      content: msg,
      file: file ? file.name : null,
    };

    setMessages((prev) => [...prev, newUserMessage]);

    // Simulate AI response for now
    setTimeout(() => {
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content:
          "I am a simulated AI response. The backend is not yet connected.",
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 1000);
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900">
      {/* Sidebar Component */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Chat Area */}
      <div className="flex flex-1 flex-col h-full relative">
        {/* Mobile Header (Shows only on small screens when sidebar is hidden) */}
        <header className="flex h-14 items-center bg-white border-b border-slate-200 px-4 md:hidden shrink-0">
          <button
            onClick={toggleSidebar}
            className="rounded-md p-2 hover:bg-slate-100"
          >
            <Menu size={24} />
          </button>
          <span className="ml-3 font-semibold text-slate-700">
            DocSphere AI
          </span>
        </header>

        {/* Content Area (Where the chat messages will go) */}
        <main className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col justify-center items-center text-center p-4 md:p-8">
              <h1 className="text-4xl font-bold text-slate-300 mb-8">
                How can I help you today?
              </h1>
            </div>
          ) : (
            <div className="pb-4">
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </main>

        {/* Chat Input Area */}
        <div className="p-4 md:p-6 bg-gradient-to-t from-slate-50 to-transparent relative z-10 shrink-0">
          <ChatInput onSendMessage={handleSendMessage} />
          <div className="text-xs text-center text-slate-400 mt-3">
            DocSphere AI can make mistakes. Consider verifying important
            information.
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
