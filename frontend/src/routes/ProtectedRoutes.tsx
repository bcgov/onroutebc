import { useAuth } from "react-oidc-context";
import { useLocation, Navigate, Outlet } from "react-router-dom";
import { UNAUTHORIZED } from "./constants";

export const ProtectedRoutes = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to={`/${UNAUTHORIZED}`} state={{ from: location }} replace />
  );
};
