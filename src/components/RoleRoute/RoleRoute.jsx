import { Navigate } from "react-router";
import Loading from "../Loading/Loading";
import useUser from "../../hooks/useUser";

const RoleRoute = ({ children, roles }) => {
  const { dbUser, isLoading } = useUser();

  if (isLoading) return <Loading />;

  if (!dbUser || !roles.includes(dbUser.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default RoleRoute;