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
  const [isLoading, setIsLoading] = useState(false); // Local loading state for the submit button
  const [isAttemptingLogin, setIsAttemptingLogin] = useState(false); // True when user submits the form

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
    setIsAttemptingLogin(true); // Signal that a login attempt has started
    
    const { error: signInError } = await signIn(credentials.email.trim(), credentials.password);
    
    if (signInError) {
      console.error('❌ AdminHotelLogin: Erro direto do signIn no handleSubmit:', signInError);
      
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
      setIsAttemptingLogin(false); // Reset state because the attempt failed directly
      return; // Stop further processing by useEffect for this specific error
    }
    // If signIn itself doesn't error, useAuth will update its state (user, profile, authError for profile fetch)
    // and the useEffect below will handle the outcome.
  };

  useEffect(() => {
    // This effect handles:
    // 1. Initial redirect if user is ALREADY logged in with a valid role (and NOT attempting a new login).
    // 2. The outcome of a user-initiated login attempt (when isAttemptingLogin is true).

    if (!isAttemptingLogin) {
      // Scenario 1: Page loaded, no login attempt initiated by the user YET.
      // Check if user is already authenticated from a previous session via useAuth.
      if (!authLoading && user && profile) { // User is authenticated and profile is loaded
        if (['admin_hotel', 'admin_total'].includes(profile.role)) {
          console.log('🎉 AdminHotelLogin: Usuário já logado e com perfil válido na CHEGADA. Redirecionando...');
          navigate('/admin/hotel');
        }
        // If user is logged in but with wrong role, or no profile found for some reason,
        // do nothing here. The form remains available for a new login attempt.
        // The login form should still be usable.
      }
      // If authLoading is true, or no user/profile, just wait. Form inputs might be disabled.
      // Ensure local isLoading is false if authLoading finishes and no attempt is active.
      if (!authLoading && isLoading) {
        setIsLoading(false);
      }
      return; // IMPORTANT: Exit early if not actively attempting login.
    }

    // Scenario 2: A login attempt IS active (isAttemptingLogin is true).
    // Now, we process the results from useAuth based on the attempt.

    if (authLoading) {
      // Still waiting for useAuth to process the signIn and/or profile fetch.
      // The button's isLoading state (local) is already true from handleSubmit.
      return;
    }

    // authLoading is false, and a login attempt was made. Evaluate the result:
    if (user && profile) { // Attempt successful, user and profile are available
      if (['admin_hotel', 'admin_total'].includes(profile.role)) {
        console.log('🎉 AdminHotelLogin: Login e perfil OK (APÓS TENTATIVA). Redirecionando...');
        toast({
          title: "Login realizado com sucesso!",
          description: `Bem-vindo${profile.nome ? `, ${profile.nome}` : ''}!`,
        });
        navigate('/admin/hotel');
        // Component will unmount, no need to explicitly reset isLoading/isAttemptingLogin here.
      } else {
        // User authenticated, profile loaded, but role is invalid for this panel
        console.error('❌ AdminHotelLogin: Role inválida (APÓS TENTATIVA):', profile.role, 'Requerido: admin_hotel ou admin_total');
        toast({
          title: "Acesso negado",
          description: "Você não tem permissão para acessar este painel com esta conta.",
          variant: "destructive"
        });
        signOut(); // Sign out the user with the wrong role. This will trigger onAuthStateChange.
        setIsLoading(false);
        setIsAttemptingLogin(false);
      }
    } else if (authError) { // An error occurred during auth process (e.g., profile fetch error after signIn was ok)
      console.error('❌ AdminHotelLogin: Erro de autenticação/perfil (APÓS TENTATIVA, via useAuth context):', authError);
      toast({
        title: "Erro de autenticação",
        // authError from useAuth context is string | null, it IS the message.
        description: authError || "Ocorreu um erro desconhecido durante o processo de autenticação.",
        variant: "destructive"
      });
      setIsLoading(false);
      setIsAttemptingLogin(false);
    } else if (!user && !authError) {
      // This case: signIn call might have returned no error from Supabase, but no user object.
      // Or, profile fetch was silently unsuccessful without setting authError from useAuth.
      // This implies credentials might be wrong but didn't cause an immediate Supabase client error.
      console.log('🚫 AdminHotelLogin: Tentativa de login finalizada sem usuário e sem erro explícito (APÓS TENTATIVA).');
      toast({
        title: "Falha no Login",
        description: "Verifique suas credenciais ou tente novamente. Se o problema persistir, contate o suporte.",
        variant: "destructive"
      });
      setIsLoading(false);
      setIsAttemptingLogin(false);
    } else {
      // Fallback for any other unexpected state after a login attempt.
      console.warn('ℹ️ AdminHotelLogin: useEffect (APÓS TENTATIVA) chegou a um estado inesperado.');
      setIsLoading(false);
      setIsAttemptingLogin(false);
    }
  }, [user, profile, authLoading, authError, navigate, isAttemptingLogin, signOut, isLoading]);

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
              {isLoading || (authLoading && isAttemptingLogin) ? ( // Show loader if local isLoading OR (authLoading AND an attempt is active)
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
                Debug: isAttemptingLogin: {isAttemptingLogin.toString()}, authLoading (hook): {authLoading.toString()}, isLoading (button): {isLoading.toString()}, User: {user ? user.id : 'null'}, Profile: {profile ? profile.role : 'null'}, AuthError: {authError || 'null'}
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
