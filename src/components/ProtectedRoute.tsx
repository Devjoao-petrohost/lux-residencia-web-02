
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast'; // Certifique-se que este é o toast correto (shadcn/ui)

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles: string[];
  redirectTo?: string; // Fallback geral de login, ex: /login
}

export function ProtectedRoute({ 
  children, 
  requiredRoles, 
  redirectTo = '/admin' // Um fallback genérico, pode ser ajustado
}: ProtectedRouteProps) {
  const { user, profile, loading, authError, signOut } = useAuth(); // Adicionado signOut
  const navigate = useNavigate();

  const defaultLoginPaths: { [key: string]: string } = {
    'admin_hotel': '/admin/hotel/login',
    'admin_total': '/admin/total/login',
    // Adicione outros mapeamentos de role para página de login se necessário
  };

  // Determina para qual página de login redirecionar com base na primeira role requerida
  // ou usa o redirectTo genérico.
  const loginRedirectPath = requiredRoles.length > 0 && defaultLoginPaths[requiredRoles[0]] 
                            ? defaultLoginPaths[requiredRoles[0]] 
                            : redirectTo;

  useEffect(() => {
    // Se o estado de autenticação ainda está carregando, não faz nada.
    // O componente renderizará o spinner/tela de loading abaixo.
    if (loading) {
      console.log('🛡️ ProtectedRoute (useEffect): Auth state ainda carregando...');
      return;
    }

    console.log('🛡️ ProtectedRoute (useEffect): Auth state carregado. Verificando acesso:', {
      user: !!user,
      profileRole: profile?.role,
      requiredRoles,
      authError
    });

    // Cenário 1: Erro de autenticação vindo do useAuth (ex: falha ao buscar perfil)
    if (authError && !profile) { // Um erro de autenticação E não há perfil
      console.error('❌ ProtectedRoute: Erro de autenticação/perfil detectado:', authError);
      toast({
        title: "Erro de Autenticação",
        description: authError,
        variant: "destructive"
      });
      // Se houve erro ao buscar perfil, é melhor deslogar para forçar um novo login limpo.
      signOut().finally(() => navigate(loginRedirectPath));
      return;
    }

    // Cenário 2: Usuário não autenticado
    if (!user) {
      console.log('🚫 ProtectedRoute: Usuário não logado. Redirecionando para:', loginRedirectPath);
      toast({
        title: "Acesso Necessário",
        description: "Você precisa fazer login para acessar esta área.",
        variant: "destructive"
      });
      navigate(loginRedirectPath);
      return;
    }

    // Cenário 3: Usuário autenticado, mas sem perfil (e sem erro explícito sobre isso em authError)
    // Isso pode indicar um problema de criação de perfil no backend ou RLS.
    if (user && !profile) {
      console.error('❌ ProtectedRoute: Perfil não encontrado para usuário logado ID:', user.id);
      toast({
        title: "Erro de Perfil",
        description: "Seu perfil não foi encontrado. Tente fazer login novamente ou contate o suporte.",
        variant: "destructive"
      });
      signOut().finally(() => navigate(loginRedirectPath)); // Deslogar para evitar estado quebrado
      return;
    }
    
    // Cenário 4: Usuário e perfil existem, mas a role não é suficiente
    if (profile && !requiredRoles.includes(profile.role)) {
      console.warn('🔒 ProtectedRoute: Role insuficiente.', { userRole: profile.role, requiredRoles });
      toast({
        title: "Acesso Negado",
        description: `Você não tem permissão (${profile.role}) para acessar esta área.`,
        variant: "destructive"
      });
      // Redireciona para uma página apropriada à role atual ou um fallback
      if (profile.role === 'admin_hotel') navigate('/admin/hotel');
      else if (profile.role === 'admin_total') navigate('/admin/total');
      else navigate(redirectTo); // Ou uma página de "acesso negado"
      return;
    }

    // Cenário 5: Todas as verificações passaram, acesso permitido.
    // Não é preciso fazer nada aqui, o conteúdo será renderizado.
    console.log('✅ ProtectedRoute: Acesso autorizado!');

  }, [user, profile, loading, authError, navigate, requiredRoles, loginRedirectPath, redirectTo, signOut]);

  // Enquanto o estado de autenticação está sendo resolvido, mostra uma tela de loading.
  if (loading) {
    console.log('⏳ ProtectedRoute (render): Exibindo tela de loading...');
    return (
      <div className="min-h-screen flex items-center justify-center bg-off-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-charcoal mx-auto"></div>
          <p className="mt-4 font-sora text-stone-grey">Verificando acesso...</p>
        </div>
      </div>
    );
  }

  // Após o loading, se todas as condições para acesso são satisfeitas (e o useEffect não redirecionou),
  // renderiza o conteúdo protegido.
  if (!loading && user && profile && requiredRoles.includes(profile.role)) {
    console.log('🎉 ProtectedRoute (render): Renderizando conteúdo protegido.');
    return <>{children}</>;
  }

  // Se chegou aqui, significa que o loading terminou, mas o usuário não tem acesso
  // (e o useEffect já deve ter iniciado um redirecionamento).
  // Retornar null evita renderizar conteúdo indevido enquanto o redirecionamento ocorre.
  console.log('🤔 ProtectedRoute (render): Aguardando redirecionamento do useEffect ou estado final.');
  return null;
}
