import { Navigate } from "react-router-dom";
import { useEffect } from "react";

import { ERROR_ROUTES } from "../../routes/constants";

/**
 * React-Error-Boundary fallback component.
 * Renders when there is a React error
 * Used code from: https://github.com/bvaughn/react-error-boundary
 */
export const ErrorFallback = ({ error }: any) => {
  useEffect(() => {
    // Call resetErrorBoundary() to reset the error boundary and retry the render.
    console.error("ErrorFallback: ", error.message || error);
  }, []);

  return <Navigate to={ERROR_ROUTES.UNEXPECTED} />;
};
