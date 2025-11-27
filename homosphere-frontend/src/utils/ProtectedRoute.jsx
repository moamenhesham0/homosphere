import { useAuth } from '../contexts/AuthContext.jsx';
import { Navigate, Outlet } from 'react-router-dom';

// Only allow access if user is authenticated
const ProtectedRoute = () => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user  ? <Outlet /> : <Navigate to="/signin" replace />;
};

export default ProtectedRoute;
