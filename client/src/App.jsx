import AppRoutes from "./routes/AppRoutes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { checkAuthStatus } from "./redux/slices/userSlice";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuthStatus());
  }, [dispatch]);

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <AppRoutes />
    </>
  );
};

export default App;
