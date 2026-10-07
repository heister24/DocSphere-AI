import { useState, useEffect } from "react";
import { X, Activity, Cpu, Zap, Database, Settings } from "lucide-react";
import api from "../services/api";

const SettingsModal = ({ isOpen, onClose }) => {
  const [usage, setUsage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      api
        .get("/document/ai-usage")
        .then((res) => {
          if (res.data?.success) {
            setUsage(res.data.usage);
          }
        })
        .catch((err) => console.error(err))
        .finally(() => setIsLoading(false));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-all duration-300">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl transform transition-all scale-100 opacity-100">
        <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-linear-to-r from-indigo-50 to-white">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Settings size={24} className="text-indigo-600" />
            Settings & Usage
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <h3 className="text-sm font-semibold text-slate-500 mb-4 uppercase tracking-wider">
            AI Resource Usage
          </h3>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-indigo-50/50 border border-indigo-100 p-4 rounded-xl flex flex-col items-center justify-center text-center group hover:bg-indigo-50 transition-colors">
                <Activity
                  size={24}
                  className="text-indigo-500 mb-2 group-hover:scale-110 transition-transform"
                />
                <div className="text-2xl font-bold text-slate-800">
                  {usage?.totalRequests || 0}
                </div>
                <div className="text-xs text-slate-500 font-medium mt-1">
                  Total Requests
                </div>
              </div>

              <div className="bg-emerald-50/50 border border-emerald-100 p-4 rounded-xl flex flex-col items-center justify-center text-center group hover:bg-emerald-50 transition-colors">
                <Database
                  size={24}
                  className="text-emerald-500 mb-2 group-hover:scale-110 transition-transform"
                />
                <div className="text-2xl font-bold text-slate-800">
                  {usage?.totalTokens?.toLocaleString() || 0}
                </div>
                <div className="text-xs text-slate-500 font-medium mt-1">
                  Total Tokens
                </div>
              </div>

              <div className="bg-amber-50/50 border border-amber-100 p-4 rounded-xl flex flex-col items-center justify-center text-center group hover:bg-amber-50 transition-colors">
                <Zap
                  size={24}
                  className="text-amber-500 mb-2 group-hover:scale-110 transition-transform"
                />
                <div className="text-xl font-bold text-slate-800">
                  {usage?.inputTokens?.toLocaleString() || 0}
                </div>
                <div className="text-xs text-slate-500 font-medium mt-1">
                  Input Tokens
                </div>
              </div>

              <div className="bg-purple-50/50 border border-purple-100 p-4 rounded-xl flex flex-col items-center justify-center text-center group hover:bg-purple-50 transition-colors">
                <Cpu
                  size={24}
                  className="text-purple-500 mb-2 group-hover:scale-110 transition-transform"
                />
                <div className="text-xl font-bold text-slate-800">
                  {usage?.outputTokens?.toLocaleString() || 0}
                </div>
                <div className="text-xs text-slate-500 font-medium mt-1">
                  Output Tokens
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 bg-slate-50 p-4 rounded-lg border border-slate-100">
            <p className="text-xs text-slate-500 text-center leading-relaxed">
              Tokens are the basic units of data processed by the AI. Input
              tokens represent your questions and document context, while output
              tokens represent the AI's generated answers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
