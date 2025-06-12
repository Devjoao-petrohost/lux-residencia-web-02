
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles: string[];
  redirectTo?: string;
}

export function ProtectedRoute({ 
  children, 
  requiredRoles, 
  redirectTo 
}: ProtectedRouteProps) {
  const { user, profile, loading, authError } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('🛡️ ProtectedRoute: Estado atual:', {
      loading,
      hasUser: !!user,
      hasProfile: !!profile,
      profileRole: profile?.role,
      requiredRoles,
      authError
    });

    // Se ainda está carregando, não fazer nada
    if (loading) {
      console.log('⏳ ProtectedRoute: Ainda carregando...');
      return;
    }

    // Se houve erro de autenticação
    if (authError) {
      console.error('❌ ProtectedRoute: Erro de autenticação:', authError);
      toast({
        title: "Erro de Autenticação",
        description: authError,
        variant: "destructive"
      });
      
      // Redirecionar para login específico baseado no role
      if (requiredRoles.includes('admin_hotel')) {
        navigate('/admin/hotel/login');
      } else if (requiredRoles.includes('admin_total')) {
        navigate('/admin/total/login');
      } else {
        navigate(redirectTo || '/admin');
      }
      return;
    }

    // Se não tem usuário logado
    if (!user) {
      console.log('🚫 ProtectedRoute: Usuário não logado, redirecionando...');
      toast({
        title: "Acesso Negado",
        description: "Você precisa fazer login para acessar esta área.",
        variant: "destructive"
      });
      
      if (requiredRoles.includes('admin_hotel')) {
        navigate('/admin/hotel/login');
      } else if (requiredRoles.includes('admin_total')) {
        navigate('/admin/total/login');
      } else {
        navigate(redirectTo || '/admin');
      }
      return;
    }

    // Se não tem perfil
    if (!profile) {
      console.error('❌ ProtectedRoute: Perfil não encontrado para usuário logado');
      toast({
        title: "Erro de Perfil",
        description: "Perfil de usuário não encontrado. Faça login novamente.",
        variant: "destructive"
      });
      
      if (requiredRoles.includes('admin_hotel')) {
        navigate('/admin/hotel/login');
      } else if (requiredRoles.includes('admin_total')) {
        navigate('/admin/total/login');
      } else {
        navigate(redirectTo || '/admin');
      }
      return;
    }

    // Se não tem a role necessária
    if (!requiredRoles.includes(profile.role)) {
      console.error('🔒 ProtectedRoute: Role insuficiente:', {
        userRole: profile.role,
        requiredRoles
      });
      toast({
        title: "Acesso Negado",
        description: `Você não tem permissão para acessar esta área. Role necessária: ${requiredRoles.join(' ou ')}, sua role: ${profile.role}`,
        variant: "destructive"
      });
      
      // Redirecionar baseado na role do usuário
      if (profile.role === 'admin_hotel') {
        navigate('/admin/hotel');
      } else if (profile.role === 'admin_total') {
        navigate('/admin/total');
      } else {
        navigate('/admin');
      }
      return;
    }

    console.log('✅ ProtectedRoute: Acesso autorizado!');
  }, [user, profile, loading, authError, navigate, requiredRoles, redirectTo]);

  // Tela de loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-off-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-charcoal mx-auto"></div>
          <p className="mt-4 font-sora text-stone-grey">Verificando acesso...</p>
          <p className="mt-2 font-sora text-sm text-stone-grey">
            Se esta tela não sair, verifique o console para debug
          </p>
        </div>
      </div>
    );
  }

  // Se chegou aqui, todos os checks passaram
  if (user && profile && requiredRoles.includes(profile.role)) {
    console.log('🎉 ProtectedRoute: Renderizando conteúdo protegido');
    return <>{children}</>;
  }

  // Fallback final - não deveria chegar aqui, mas previne tela branca
  console.error('🚨 ProtectedRoute: Estado inesperado, redirecionando por segurança');
  return (
    <div className="min-h-screen flex items-center justify-center bg-off-white">
      <div className="text-center">
        <p className="font-sora text-charcoal">Redirecionando...</p>
      </div>
    </div>
  );
}
