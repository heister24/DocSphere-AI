import {
  MessageSquare,
  Plus,
  Settings,
  LogOut,
  PanelLeftClose,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../redux/slices/userSlice";
import api from "../services/api";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout"); // Ensure this endpoint exists in your backend
      dispatch(logoutUser());
    } catch (error) {
      console.error("Logout failed:", error);
      // Even if API fails, clear frontend state so user isn't stuck
      dispatch(logoutUser());
    }
  };

  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-slate-950 text-slate-300 transition-transform duration-300 ease-in-out md:static ${
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      }`}
    >
      {/* Top section: New Chat Button & Close Icon (Mobile) */}
      <div className="flex items-center justify-between p-3">
        <button className="flex flex-1 items-center gap-3 rounded-md border border-slate-700 p-3 hover:bg-slate-800 transition-colors">
          <Plus size={18} />
          <span className="text-sm font-medium">New chat</span>
        </button>
        {/* Mobile close button */}
        <button
          onClick={toggleSidebar}
          className="ml-2 p-3 hover:bg-slate-800 rounded-md md:hidden"
        >
          <PanelLeftClose size={18} />
        </button>
      </div>

      {/* Middle section: Chat History (Mocked for now) */}
      <div className="flex-1 overflow-y-auto p-3">
        <div className="text-xs font-semibold text-slate-500 mb-3 px-2">
          Recent
        </div>
        <button className="flex w-full items-center gap-3 rounded-md p-3 hover:bg-slate-800 transition-colors truncate">
          <MessageSquare size={18} className="shrink-0" />
          <span className="text-sm truncate">How to build a Navbar</span>
        </button>
        <button className="flex w-full items-center gap-3 rounded-md p-3 hover:bg-slate-800 transition-colors truncate">
          <MessageSquare size={18} className="shrink-0" />
          <span className="text-sm truncate">React Router tutorial</span>
        </button>
      </div>

      {/* Bottom section: User Profile & Settings */}
      <div className="border-t border-slate-800 p-3 flex flex-col gap-1">
        <button className="flex w-full items-center gap-3 rounded-md p-3 hover:bg-slate-800 transition-colors">
          <Settings size={18} />
          <span className="text-sm">Settings</span>
        </button>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-md p-3 hover:bg-slate-800 transition-colors text-red-400 hover:text-red-300"
        >
          <LogOut size={18} />
          <span className="text-sm">Log out</span>
        </button>

        <div className="mt-2 flex items-center gap-3 p-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-700 text-white font-bold uppercase shrink-0">
            {userData?.name?.charAt(0) || "U"}
          </div>
          <span className="text-sm font-medium text-white truncate">
            {userData?.name || "User"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
