import { useState, useRef } from "react";
import { Send, Paperclip, X } from "lucide-react";

const ChatInput = ({ onSendMessage, onFileUpload }) => {
  const [message, setMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleSend = () => {
    if (message.trim() || selectedFile) {
      onSendMessage(message, selectedFile);
      setMessage("");
      setSelectedFile(null);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      if (onFileUpload) {
        onFileUpload(file);
      }
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="mx-auto max-w-3xl flex flex-col border border-slate-300 rounded-xl bg-white shadow-sm focus-within:border-slate-400 focus-within:ring-1 focus-within:ring-slate-400 transition-all">
      
      {/* Attached File Preview */}
      {selectedFile && (
        <div className="px-4 pt-3 flex flex-wrap gap-2">
          <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-100 text-indigo-700 px-3 py-1.5 rounded-lg text-sm">
            <Paperclip size={14} />
            <span className="max-w-[200px] truncate">{selectedFile.name}</span>
            <button
              onClick={removeFile}
              className="ml-1 hover:bg-indigo-200 p-0.5 rounded-full transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="flex items-end p-2 pb-2">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors mb-1"
          title="Attach Document"
        >
          <Paperclip size={20} />
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept=".pdf,.doc,.docx,.txt"
          />
        </button>

        <textarea
          className="flex-1 max-h-48 min-h-[44px] resize-none bg-transparent p-3 text-slate-700 placeholder-slate-400 focus:outline-none"
          placeholder="Message DocSphere AI..."
          rows={1}
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            e.target.style.height = 'auto';
            e.target.style.height = `${e.target.scrollHeight}px`;
          }}
          onKeyDown={handleKeyDown}
        />

        <button
          onClick={handleSend}
          disabled={!message.trim() && !selectedFile}
          className="p-2 mb-1 mr-1 text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:text-slate-500 rounded-lg transition-colors"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
