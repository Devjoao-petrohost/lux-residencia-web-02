
import { useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom'; // Adicionado Navigate
import { useAuth } from '@/hooks/useAuth'; // Corrigido caminho
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

  // Tela de loading enquanto verifica autenticação e perfil
  if (loading) {
    console.log('⏳ ProtectedRoute: Ainda carregando (loading global)...');
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

  // Após o loading, verificações de autenticação e perfil
  useEffect(() => {
    // Não faz nada se estiver carregando (já tratado acima)
    if (loading) return;

    console.log('🛡️ ProtectedRoute: Estado atual (após loading):', {
      hasUser: !!user,
      hasProfile: !!profile,
      profileRole: profile?.role,
      requiredRoles,
      authError
    });

    // Se houve erro de autenticação vindo do useAuth (ex: falha ao buscar perfil)
    if (authError && !profile) { // Considera authError apenas se não houver perfil
      console.error('❌ ProtectedRoute: Erro de autenticação/perfil do useAuth:', authError);
      toast({
        title: "Erro de Autenticação",
        description: authError,
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

    // Se tem usuário, mas não tem perfil (ex: RLS impedindo acesso ou perfil ainda não criado)
    if (!profile) {
      console.error('❌ ProtectedRoute: Perfil não encontrado para usuário logado.');
      toast({
        title: "Erro de Perfil",
        description: "Perfil de usuário não encontrado. Verifique suas permissões ou tente fazer login novamente.",
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

    // Se tem usuário e perfil, mas não tem a role necessária
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
      
      // Redirecionar baseado na role ATUAL do usuário, se ele tiver alguma
      if (profile.role === 'admin_hotel') {
        navigate('/admin/hotel');
      } else if (profile.role === 'admin_total') {
        navigate('/admin/total');
      } else {
        // Se a role não for nenhuma das esperadas, envia para uma página genérica de admin
        // ou para a página de login padrão como fallback se redirectTo não estiver definido.
        navigate(redirectTo || '/admin'); 
      }
      return;
    }

    console.log('✅ ProtectedRoute: Acesso autorizado!');
  }, [user, profile, loading, authError, navigate, requiredRoles, redirectTo]);

  // Se passou por loading e o useEffect ainda não redirecionou,
  // e temos usuário, perfil e role correta, renderiza children.
  if (user && profile && requiredRoles.includes(profile.role)) {
    console.log('🎉 ProtectedRoute: Renderizando conteúdo protegido (após checks no effect e condição final)');
    return <>{children}</>;
  }
  
  // Se chegou aqui e não renderizou children, é um estado inesperado ou
  // o useEffect está prestes a redirecionar.
  // Evita renderizar children prematuramente ou uma tela branca.
  // O loading já foi tratado. Se não tem user/profile/role correta,
  // o useEffect deve ter redirecionado ou irá redirecionar.
  // Este return é um fallback para o caso de o effect não ter disparado imediatamente
  // ou se os checks condicionais não capturarem todos os cenários de redirecionamento.
  // A tela de loading já foi exibida.
  console.log('⏳ ProtectedRoute: Aguardando redirecionamento do useEffect ou estado final para renderizar.');
  return null; // Ou um spinner/mensagem mais leve, já que o loading principal passou.
  // Retornar null é seguro se o useEffect for redirecionar.
}
