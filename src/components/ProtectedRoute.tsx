import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
  const { user } = useAuth();

  console.log('ProtectedRoute: requireAdmin =', requireAdmin);
  console.log('ProtectedRoute: user =', user);
  console.log('ProtectedRoute: user?.email =', user?.email);

  if (!user) {
    console.log('ProtectedRoute: No user, redirecting to /login');
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && !user?.email) {
    console.log('ProtectedRoute: Admin required but no user email, redirecting to /');
    return <Navigate to="/" replace />;
  }

  console.log('ProtectedRoute: Access granted');
  return <>{children}</>;
};

export default ProtectedRoute;
