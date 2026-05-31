import { Navigate } from "react-router";
import useUser from "../../hooks/useUser";
import Loading from "../../components/Loading/Loading";

// Renders at /dashboard — redirects to the right sub-page based on role
const DashboardIndex = () => {
  const { dbUser, isLoading } = useUser();

  if (isLoading) return <Loading />;

  if (dbUser?.role === "admin") return <Navigate to="/dashboard/admin" replace />;
  if (dbUser?.role === "staff") return <Navigate to="/dashboard/staff" replace />;
  return <Navigate to="/dashboard/citizen" replace />;
};

export default DashboardIndex;