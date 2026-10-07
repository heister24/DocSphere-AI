import { useState, useEffect } from "react";
import { X, FileText, Trash2, HardDrive, Calendar } from "lucide-react";
import api from "../services/api";
import { toast } from "react-toastify";

const DocumentLibraryModal = ({ isOpen, onClose, onSelectDocument }) => {
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchDocuments();
    }
  }, [isOpen]);

  const fetchDocuments = async () => {
    setIsLoading(true);
    try {
      const res = await api.get("/document/getAllDocuments");
      if (res.data?.success) {
        setDocuments(res.data.documents);
      }
    } catch (error) {
      console.error("Failed to fetch documents:", error);
      toast.error("Failed to load documents");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation(); // prevent selecting the document
    if (!window.confirm("Are you sure you want to delete this document? This will also remove it from the AI's knowledge base.")) return;
    
    setIsDeleting(id);
    try {
      const res = await api.delete(`/document/deleteDocument/${id}`);
      if (res.data?.success) {
        toast.success("Document deleted");
        setDocuments(documents.filter(doc => doc._id !== id));
      }
    } catch (error) {
      console.error("Failed to delete document:", error);
      toast.error("Failed to delete document");
    } finally {
      setIsDeleting(null);
    }
  };

  const formatBytes = (bytes) => {
    if (!bytes) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-all duration-300">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden shadow-2xl transform transition-all">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-linear-to-r from-blue-50 to-white shrink-0">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <HardDrive size={24} className="text-blue-600" />
            Document Library
          </h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            </div>
          ) : documents.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <FileText size={48} className="mx-auto text-slate-300 mb-4" />
              <p>You haven't uploaded any documents yet.</p>
            </div>
          ) : (
            <div className="grid gap-3">
              {documents.map(doc => (
                <div 
                  key={doc._id} 
                  onClick={() => {
                    if(onSelectDocument) onSelectDocument(doc._id);
                    onClose();
                  }}
                  className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="h-10 w-10 shrink-0 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                      <FileText size={20} />
                    </div>
                    <div className="min-w-0 flex flex-col">
                      <h4 className="text-sm font-semibold text-slate-800 truncate">{doc.originalName}</h4>
                      <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                        <span className="flex items-center gap-1"><HardDrive size={12}/> {formatBytes(doc.fileSize)}</span>
                        <span className="flex items-center gap-1"><FileText size={12}/> {doc.totalPages} pages</span>
                        <span className="flex items-center gap-1"><Calendar size={12}/> {new Date(doc.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <button 
                    onClick={(e) => handleDelete(e, doc._id)}
                    disabled={isDeleting === doc._id}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                    title="Delete Document"
                  >
                    {isDeleting === doc._id ? (
                      <div className="animate-spin h-5 w-5 border-b-2 border-red-500 rounded-full"></div>
                    ) : (
                      <Trash2 size={18} />
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentLibraryModal;
