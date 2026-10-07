import { User, Bot } from "lucide-react";

const ChatMessage = ({ message }) => {
  const isUser = message.role === "user";

  return (
    <div className={`flex w-full py-6 ${isUser ? "bg-white" : "bg-slate-50 border-y border-slate-100"}`}>
      <div className="mx-auto flex w-full max-w-3xl gap-4 px-4 md:px-0">
        
        {/* Avatar */}
        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-sm ${isUser ? "bg-indigo-600 text-white" : "bg-emerald-500 text-white"}`}>
          {isUser ? <User size={20} /> : <Bot size={20} />}
        </div>
        
        {/* Message Content */}
        <div className="flex-1 space-y-2 text-slate-800">
          <div className="font-semibold text-sm">
            {isUser ? "You" : "DocSphere AI"}
          </div>
          <div className="prose prose-slate max-w-none text-sm md:text-base leading-relaxed">
            {message.content}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ChatMessage;
