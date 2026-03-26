import { Navigate } from "react-router-dom";

function RouteGuard({ allow, redirectTo, children }) {
  if (allow === null) {
    return null;
  }

  if (!allow) {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
}

export default RouteGuard;
