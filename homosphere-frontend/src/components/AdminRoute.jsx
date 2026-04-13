import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { getAuthToken, isAdmin } from '../services';

/**
 * A route guard component that only allows users with the ADMIN role.
 * If not logged in, redirects to /signin.
 * If logged in but not an admin, redirects to /.
 */
const AdminRoute = () => {
  const token = getAuthToken();
  const isUserAdmin = isAdmin();
  const location = useLocation();

  if (!token) {
    return <Navigate to="/signin" state={{ from: location.pathname }} replace />;
  }

  if (!isUserAdmin) {
    console.warn('Access denied: User is not an admin');
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
