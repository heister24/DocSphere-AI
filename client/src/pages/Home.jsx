import { useState, useRef, useEffect } from "react";
import Sidebar from "../layout/Sidebar";
import { Menu, Loader2 } from "lucide-react";
import ChatInput from "../components/ChatInput";
import ChatMessage from "../components/ChatMessage";
import api from "../services/api";
import { toast } from "react-toastify";

const Home = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [currentDocumentId, setCurrentDocumentId] = useState(null);
  const [currentConversationId, setCurrentConversationId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [conversations, setConversations] = useState([]);
  const messagesEndRef = useRef(null);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchConversations = async () => {
    try {
      const res = await api.get("/document/conversations");
      if (res.data?.success) {
        setConversations(res.data.conversations);
      }
    } catch (error) {
      console.error("Failed to fetch conversations:", error);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleNewChat = () => {
    setCurrentConversationId(null);
    setCurrentDocumentId(null);
    setMessages([]);
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  const handleLoadConversation = async (conversationId) => {
    try {
      setIsLoading(true);
      const res = await api.get(`/document/conversations/${conversationId}`);
      if (res.data?.success) {
        const conv = res.data.conversation;
        setCurrentConversationId(conv._id);
        setCurrentDocumentId(conv.documentId);
        
        // Map messages to match the UI format
        const formattedMessages = conv.messages.map(msg => ({
          id: msg._id || Date.now().toString() + Math.random(),
          role: msg.role === "assistant" ? "ai" : "user",
          content: msg.content
        }));
        setMessages(formattedMessages);
        
        if (window.innerWidth < 768) {
          setIsSidebarOpen(false);
        }
      }
    } catch (error) {
      console.error("Failed to load conversation:", error);
      toast.error("Failed to load conversation");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (msg, file) => {
    if (!msg.trim() && !file) return;

    // Add user message
    const newUserMessage = {
      id: Date.now().toString(),
      role: "user",
      content: msg,
      file: file ? file.name : null,
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setIsLoading(true);

    try {
      let docId = currentDocumentId;

      // 1. Upload document if a new file is provided
      if (file) {
        const formData = new FormData();
        formData.append("document", file);

        const uploadRes = await api.post("/document/upload-pdf", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (uploadRes.data?.success) {
          docId = uploadRes.data.document.id;
          setCurrentDocumentId(docId);
          // Reset conversation for new document
          setCurrentConversationId(null);
        } else {
          throw new Error("Failed to upload document");
        }
      }

      if (!docId) {
        toast.error("Please upload a document first!");
        setIsLoading(false);
        return;
      }

      // 2. Send chat message
      const chatRes = await api.post("/document/chat", {
        query: msg || "Please explain this document", // Ensure query is not empty if just a file is uploaded
        documentId: docId,
        conversationId: currentConversationId,
      });

      if (chatRes.data?.success) {
        if (!currentConversationId) {
          setCurrentConversationId(chatRes.data.data.conversationId);
          fetchConversations(); // refresh sidebar
        }

        const aiResponse = {
          id: Date.now().toString(),
          role: "ai",
          content: chatRes.data.data.answer,
          sources: chatRes.data.data.sources,
        };
        setMessages((prev) => [...prev, aiResponse]);
      } else {
        throw new Error("Failed to get response");
      }
    } catch (error) {
      console.error("Chat error:", error);
      toast.error(error.response?.data?.message || "Something went wrong.");

      const errorMsg = {
        id: Date.now().toString(),
        role: "ai",
        content: "Sorry, I encountered an error processing your request.",
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900">
      {/* Sidebar Component */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        toggleSidebar={toggleSidebar} 
        conversations={conversations}
        currentConversationId={currentConversationId}
        onNewChat={handleNewChat}
        onLoadConversation={handleLoadConversation}
      />

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
              {isLoading && (
                <div className="flex w-full py-6 bg-slate-50 border-y border-slate-100">
                  <div className="mx-auto flex w-full max-w-3xl gap-4 px-4 md:px-0">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-emerald-500 text-white">
                      <Loader2 size={20} className="animate-spin" />
                    </div>
                    <div className="flex-1 space-y-2 text-slate-800">
                      <div className="font-semibold text-sm">DocSphere AI</div>
                      <div className="text-sm md:text-base animate-pulse">
                        Thinking...
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </main>

        {/* Chat Input Area */}
        <div className="p-4 md:p-6 bg-linear-to-t from-slate-50 to-transparent relative z-10 shrink-0">
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
