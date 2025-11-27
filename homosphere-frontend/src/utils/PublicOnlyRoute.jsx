import { useAuth } from '../contexts/AuthContext.jsx';
import { Navigate, Outlet } from 'react-router-dom';

// Only allow access if user is NOT authenticated
const PublicOnlyRoute = () => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return !user ? <Outlet /> : <Navigate to="/" replace />;
};

export default PublicOnlyRoute;
