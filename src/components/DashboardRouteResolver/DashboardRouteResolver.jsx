import { Navigate } from "react-router-dom";
import { getSavedDashboardPath } from "../../utils/adminSession";

export default function DashboardRouteResolver() {
  return <Navigate to={getSavedDashboardPath()} replace />;
}
