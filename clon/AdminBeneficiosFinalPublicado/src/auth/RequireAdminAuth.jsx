import { Navigate } from "react-router-dom";
import { isAuthenticated } from "./auth";

export default function RequireAdminAuth({ children }) {
  if (!isAuthenticated()) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
