import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PublicRoute = ({ children }) => {
  const { isAuthenticated, isCheckingAuth } = useSelector((state) => state.user);

  if (isCheckingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-900 border-t-transparent"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PublicRoute;
