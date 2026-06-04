import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/auth-store';

export default function PrivateRoute({ children }: { children: any }) {
  const location = useLocation();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/login" replace state={{ from: location }} />;
}
