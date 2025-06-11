import { Navigate } from "react-router-dom";

/**
 * Composant de protection de route
 * @param {boolean} adminOnly - Si true, seul un admin peut accéder
 * @param {ReactNode} children - Contenu de la route protégée
 */
const ProtectedRoute = ({ adminOnly = false, children }) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("userRole");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && userRole !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
