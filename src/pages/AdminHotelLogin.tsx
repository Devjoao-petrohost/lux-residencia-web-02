import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth'; // Import useAuth
import { toast } from '@/hooks/use-toast';
import { Hotel, Mail, Lock, ArrowLeft, Loader } from 'lucide-react';

const AdminHotelLogin = () => {
  const navigate = useNavigate();
  const { user, profile, loading: authLoading, authError, signIn } = useAuth(); // Destructure from useAuth

  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false); // Local loading state for the form button

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
    
    // Use signIn from useAuth
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
      setIsLoading(false); // Stop loading if signIn itself fails
    }
    // If signIn call was successful (no direct error),
    // isLoading remains true. useEffect will handle navigation/further errors
    // based on useAuth state (authLoading, user, profile, authError).
  };

  useEffect(() => {
    // This effect reacts to changes from useAuth state
    if (authLoading) {
      // If useAuth is busy, keep local loading true (if it was set by handleSubmit)
      // or set it to true if not already.
      if (!isLoading) setIsLoading(true);
      return; // Wait for authLoading to be false
    }

    // At this point, authLoading is false.
    // Reset local loading state if we haven't navigated.
    
    if (user && profile) {
      if (['admin_hotel', 'admin_total'].includes(profile.role)) {
        console.log('🎉 AdminHotelLogin: Login e perfil OK (via useAuth). Redirecionando para /admin/hotel...');
        toast({
          title: "Login realizado com sucesso!",
          description: `Bem-vindo${profile.nome ? `, ${profile.nome}` : ''}!`,
        });
        navigate('/admin/hotel');
        // setIsLoading(false) // Not strictly needed as component unmounts
      } else {
        console.error('❌ AdminHotelLogin: Role inválida (via useAuth):', profile.role, 'Requerido: admin_hotel ou admin_total');
        toast({
          title: "Acesso negado",
          description: "Você não tem permissão para acessar este painel com esta conta.",
          variant: "destructive"
        });
        setIsLoading(false); // Stop local loading, did not navigate
        // Optionally, sign out the user if their role is definitively wrong for any admin access
        // signOut(); 
      }
    } else if (user && !profile && authError) {
      // Successfully authenticated by Supabase Auth, but profile fetch failed in useAuth
      console.error('❌ AdminHotelLogin: Erro ao carregar perfil (via useAuth):', authError);
      toast({
        title: "Erro de Perfil",
        description: `Não foi possível carregar os dados do seu perfil: ${authError}. Tente novamente ou contate o suporte.`,
        variant: "destructive"
      });
      setIsLoading(false); // Stop local loading
    } else if (!user && authError) {
      // This means an auth error occurred that resulted in no user,
      // possibly already handled by handleSubmit's direct error check.
      // Or, if useAuth encountered an error post-signIn call that cleared the user.
      console.warn('ℹ️ AdminHotelLogin: useEffect detectou authError sem usuário (pode ser redundante se handleSubmit já tratou):', authError);
      // Avoid double-toasting if signInError already handled it.
      // toast({
      //   title: "Erro de Autenticação",
      //   description: authError,
      //   variant: "destructive",
      // });
      setIsLoading(false); // Stop local loading
    } else {
      // Default case: not loading, no user, no error (e.g., initial page load before login attempt, or after logout)
      // Or conditions not met for navigation/specific error. Ensure isLoading is false.
      setIsLoading(false);
    }
  }, [user, profile, authLoading, authError, navigate, isLoading]); // Added isLoading to deps

  return (
    <div className="min-h-screen bg-gradient-to-br from-off-white to-stone-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
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

        {/* Form */}
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
                  disabled={isLoading}
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
                  disabled={isLoading}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
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

          {/* Debug Info em desenvolvimento */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-xs text-yellow-800 font-mono">
                Debug: Verifique o console do navegador para logs detalhados de useAuth e AdminHotelLogin.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
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
