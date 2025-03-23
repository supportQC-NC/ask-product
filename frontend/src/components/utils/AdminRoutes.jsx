import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const AdminRoutes = () => {
  const { userInfo } = useSelector((state) => state.auth);

  // Vérification que userInfo existe avant de vérifier la propriété role
  if (!userInfo) {
    return <Navigate to="/" replace />;
  }

  return userInfo.role === "admin" ? <Outlet /> : <Navigate to="/" replace />;
};

export default AdminRoutes;
