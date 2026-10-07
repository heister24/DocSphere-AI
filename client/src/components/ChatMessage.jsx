import { User, Bot, FileText } from "lucide-react";
import ReactMarkdown from "react-markdown";

const ChatMessage = ({ message }) => {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex w-full py-6 ${isUser ? "bg-white" : "bg-slate-50 border-y border-slate-100"}`}
    >
      <div className="mx-auto flex w-full max-w-3xl gap-4 px-4 md:px-0">
        {/* Avatar */}
        <div
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-sm ${isUser ? "bg-indigo-600 text-white" : "bg-emerald-500 text-white"}`}
        >
          {isUser ? <User size={20} /> : <Bot size={20} />}
        </div>

        {/* Message Content */}
        <div className="flex-1 space-y-4 text-slate-800">
          <div className="font-semibold text-sm">
            {isUser ? "You" : "DocSphere AI"}
          </div>
          <div className="prose prose-slate max-w-none text-sm md:text-base leading-relaxed">
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>

          {/* Sources */}
          {!isUser && message.sources && message.sources.length > 0 && (
            <div className="mt-4 pt-4 border-t border-slate-200">
              <div className="text-xs font-semibold text-slate-500 mb-2 flex items-center gap-1">
                <FileText size={14} />
                Sources
              </div>
              <div className="flex flex-wrap gap-2">
                {message.sources.map((source, idx) => (
                  <div
                    key={idx}
                    className="text-xs bg-slate-200 text-slate-700 px-2 py-1 rounded-md max-w-50 truncate"
                    title={source.text}
                  >
                    Reference {idx + 1}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
