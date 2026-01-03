import { Navigate, Outlet, useLocation } from "react-router-dom";
import { isLoggedIn } from "../utils/adminAuth";

export default function RequireAdminAuth({ children }) {
  const location = useLocation();
  const logged = isLoggedIn();

  if (!logged) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  return children || <Outlet />;
}
