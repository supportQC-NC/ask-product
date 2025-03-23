import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoutes = () => {
  const { userInfo } = useSelector((state) => state.auth);

  if (!userInfo) {
    return <Navigate to="/connexion" replace />;
  }

  return userInfo.role === "private" ? (
    <Outlet />
  ) : (
    <Navigate to="/connexion" replace />
  );
};

export default PrivateRoutes;
