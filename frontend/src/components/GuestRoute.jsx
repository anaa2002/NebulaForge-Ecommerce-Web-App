import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

function GuestRoute({ children }) {
  const { user, isCheckingAuth } = useAuth();

  if (isCheckingAuth)
    return <p className="loading-text">Checking the auth...</p>;

  if (user) return <Navigate to="/" replace />;

  return children;
}

export default GuestRoute;
