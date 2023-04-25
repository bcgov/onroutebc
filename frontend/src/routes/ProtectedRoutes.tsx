import { useAuth } from "react-oidc-context";
import { useLocation, Navigate, Outlet } from "react-router-dom";
import { HOME } from "./constants";
import { Loading } from "../common/pages/Loading";

export const ProtectedRoutes = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <Loading />;
  }

  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to={HOME} state={{ from: location }} replace />
  );
};
