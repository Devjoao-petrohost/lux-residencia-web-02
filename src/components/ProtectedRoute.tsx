
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles: string[];
  redirectTo?: string;
}

export function ProtectedRoute({ 
  children, 
  requiredRoles, 
  redirectTo = '/admin' 
}: ProtectedRouteProps) {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate('/admin');
        return;
      }

      if (!profile || !requiredRoles.includes(profile.role)) {
        navigate(redirectTo);
        return;
      }
    }
  }, [user, profile, loading, navigate, requiredRoles, redirectTo]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-charcoal mx-auto"></div>
          <p className="mt-4 font-sora text-stone-grey">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user || !profile || !requiredRoles.includes(profile.role)) {
    return null;
  }

  return <>{children}</>;
}
