
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { Hotel, Mail, Lock, ArrowLeft, Loader } from 'lucide-react';

const AdminHotelLogin = () => {
  const navigate = useNavigate();
  const { user, profile, loading: authLoading, authError, signIn, signOut } = useAuth();

  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isAttemptingLogin, setIsAttemptingLogin] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!credentials.email || !credentials.password) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha email e senha.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    setIsAttemptingLogin(true);
    
    const { error: signInError } = await signIn(credentials.email.trim(), credentials.password);
    
    if (signInError) {
      console.error('❌ AdminHotelLogin: Erro direto do signIn (useAuth):', signInError);
      
      let errorMessage = "Email ou senha incorretos.";
      if (signInError.message?.includes('Invalid login credentials')) {
        errorMessage = "Credenciais inválidas. Verifique seu email e senha.";
      } else if (signInError.message?.includes('Email not confirmed')) {
        errorMessage = "Email não confirmado. Verifique sua caixa de entrada.";
      } else if (signInError.message?.includes('Too many requests')) {
        errorMessage = "Muitas tentativas. Aguarde alguns minutos e tente novamente.";
      } else {
        errorMessage = signInError.message || "Ocorreu um erro durante o login.";
      }
      
      toast({
        title: "Erro de autenticação",
        description: errorMessage,
        variant: "destructive"
      });
      setIsLoading(false);
      setIsAttemptingLogin(false);
    }
  };

  useEffect(() => {
    if (!authLoading && user && profile && !isAttemptingLogin) {
      if (['admin_hotel', 'admin_total'].includes(profile.role)) {
        console.log('🎉 AdminHotelLogin: Usuário já logado e com perfil válido. Redirecionando...');
        navigate('/admin/hotel');
        return;
      }
    }

    if (!isAttemptingLogin) {
      if (!authLoading && isLoading) {
        setIsLoading(false);
      }
      return;
    }

    if (authLoading) {
      return;
    }

    if (user && profile) {
      if (['admin_hotel', 'admin_total'].includes(profile.role)) {
        console.log('🎉 AdminHotelLogin: Login e perfil OK (via useAuth). Redirecionando para /admin/hotel...');
        toast({
          title: "Login realizado com sucesso!",
          description: `Bem-vindo${profile.nome ? `, ${profile.nome}` : ''}!`,
        });
        navigate('/admin/hotel');
        // No need to set isLoading or isAttemptingLogin to false here, as navigation will unmount.
        // If navigation fails or component doesn't unmount, these might need to be reset.
      } else {
        console.error('❌ AdminHotelLogin: Role inválida (via useAuth):', profile.role, 'Requerido: admin_hotel ou admin_total');
        toast({
          title: "Acesso negado",
          description: "Você não tem permissão para acessar este painel com esta conta.",
          variant: "destructive"
        });
        signOut(); // This will trigger auth state changes, leading to potential re-evaluation or new authError.
        setIsLoading(false);
        setIsAttemptingLogin(false);
      }
    } else if (user && !profile && authError) {
      console.error('❌ AdminHotelLogin: Erro ao carregar perfil (via useAuth):', authError);
      toast({
        title: "Erro de Perfil",
        description: `Não foi possível carregar os dados do seu perfil: ${authError}. Tente novamente ou contate o suporte.`,
        variant: "destructive"
      });
      setIsLoading(false);
      setIsAttemptingLogin(false);
    } else if (!user && authError) {
      console.warn('ℹ️ AdminHotelLogin: useEffect detectou authError sem usuário (pode ser redundante se handleSubmit já tratou):', authError);
      // Removed problematic toast.isActive check
      toast({
        title: "Falha na Autenticação",
        description: authError.message || "Ocorreu um erro desconhecido.", // Ensure authError always provides a message
        variant: "destructive"
      });
      setIsLoading(false);
      setIsAttemptingLogin(false);
    } else if (!user && !authError) {
      // This case might be hit if signIn completes without error but doesn't yield a user (e.g. incorrect credentials but not an API error)
      // Or if auth flow concludes without user and without explicit useAuth error
      console.log('🚫 AdminHotelLogin: Tentativa de login finalizada sem usuário e sem erro explícito do useAuth.');
      // Removed problematic toast.isActive check
      toast({
        title: "Falha no Login",
        description: "Verifique suas credenciais ou tente novamente.",
        variant: "destructive"
      });
      setIsLoading(false);
      setIsAttemptingLogin(false);
    } else {
      // Fallback to ensure loading states are reset if no other condition matched
      // but an attempt was made.
      setIsLoading(false);
      setIsAttemptingLogin(false);
    }

    // Redundant if already set in specific branches, but acts as a safety net.
    // Consider if this should be here or if all branches handle it correctly.
    // For now, to ensure states are reset if a login attempt was made and didn't navigate.
    if (isAttemptingLogin && !user) {
        setIsLoading(false);
        setIsAttemptingLogin(false);
    }

  }, [user, profile, authLoading, authError, navigate, isAttemptingLogin, signOut, isLoading]); // Removed credentials.email as it's not directly used for conditions here

  return (
    <div className="min-h-screen bg-gradient-to-br from-off-white to-stone-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="bg-pure-white p-4 rounded-full shadow-lg border border-stone-grey">
              <Hotel className="w-12 h-12 text-charcoal" />
            </div>
          </div>
          <h1 className="font-sora text-3xl font-bold text-charcoal mb-2">
            Gestão do Hotel
          </h1>
          <p className="font-sora text-stone-grey">
            Acesse o painel administrativo do hotel
          </p>
        </div>

        <div className="bg-pure-white rounded-xl shadow-xl border border-stone-grey p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block font-sora text-sm font-medium text-charcoal mb-2">
                Email de Acesso
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-grey w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  value={credentials.email}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-3 border border-stone-grey rounded-lg font-sora focus:outline-none focus:ring-2 focus:ring-charcoal focus:border-transparent"
                  placeholder="seu.email@masperesidencial.ao"
                  required
                  disabled={isLoading || (authLoading && !isAttemptingLogin)}
                />
              </div>
            </div>

            <div>
              <label className="block font-sora text-sm font-medium text-charcoal mb-2">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-grey w-5 h-5" />
                <input
                  type="password"
                  name="password"
                  value={credentials.password}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-3 border border-stone-grey rounded-lg font-sora focus:outline-none focus:ring-2 focus:ring-charcoal focus:border-transparent"
                  placeholder="••••••••"
                  required
                  disabled={isLoading || (authLoading && !isAttemptingLogin)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || (authLoading && !isAttemptingLogin)}
              className="w-full bg-charcoal text-pure-white py-3 rounded-lg font-sora font-semibold hover:bg-stone-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  <span>Verificando...</span>
                </>
              ) : (
                <span>Entrar no Painel</span>
              )}
            </button>
          </form>

          <div className="mt-6 p-4 bg-off-white rounded-lg">
            <h3 className="font-sora text-sm font-semibold text-charcoal mb-2">
              Acesso para Gestão do Hotel
            </h3>
            <ul className="font-sora text-xs text-stone-grey space-y-1">
              <li>• Gestão de quartos e disponibilidade</li>
              <li>• Controle de reservas e check-ins</li>
              <li>• Relatórios de ocupação</li>
              <li>• Atendimento presencial</li>
            </ul>
          </div>

          {process.env.NODE_ENV === 'development' && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-xs text-yellow-800 font-mono">
                Debug: Verifique o console para logs. isAttemptingLogin: {isAttemptingLogin.toString()}, authLoading: {authLoading.toString()}, isLoading (button): {isLoading.toString()}
              </p>
            </div>
          )}
        </div>

        <div className="text-center mt-8">
          <Link 
            to="/" 
            className="inline-flex items-center space-x-2 font-sora text-sm text-stone-grey hover:text-charcoal transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar ao site principal</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminHotelLogin;

