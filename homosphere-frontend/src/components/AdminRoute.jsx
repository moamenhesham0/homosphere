import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { getAuthToken, isAdmin } from '../services';
import { ROUTES } from '../constants/routes';

const AdminRoute = () => {
  const token = getAuthToken();
  const isUserAdmin = isAdmin();
  const location = useLocation();
  const pathname = location.pathname;
  const isAdminPath = pathname.startsWith('/admin');
  const isViewProfilePath = /^\/admin\/user-management\/[^/]+\/profile$/.test(pathname);
  const isPropertyDetailsPath = /^\/property-details(\/[^/]+)?$/.test(pathname);
  const isAllowedAdminPage = pathname === ROUTES.ADMIN_USER_MANAGEMENT
    || pathname === ROUTES.ADMIN_PROPERTY_APPROVALS
    || isViewProfilePath
    || isPropertyDetailsPath;

  if (isAdminPath && !token) {
    return <Navigate to={ROUTES.SIGNIN} state={{ from: pathname }} replace />;
  }

  if (isAdminPath && !isUserAdmin) {
    console.warn('Access denied: User is not an admin');
    return <Navigate to={ROUTES.HOME} replace />;
  }

  if (token && isUserAdmin && !isAllowedAdminPage) {
    return <Navigate to={ROUTES.ADMIN_USER_MANAGEMENT} replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
