import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { Hotel, Mail, Lock, ArrowLeft, Loader } from 'lucide-react';

const AdminHotelLogin = () => {
  const navigate = useNavigate();
  const { 
    user, 
    profile, 
    loading: authLoading, // Renomeado para clareza (loading do AuthContext)
    authError, 
    signIn, 
    signOut 
  } = useAuth();

  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false); // Estado local para o processo de submissão do formulário

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

    setIsSubmitting(true); // Inicia o processo de submissão
    
    // A função signIn do useAuth agora gerencia seu próprio loading e erros.
    // O resultado final (user, profile, authError) será refletido no AuthContext.
    const { error: signInError } = await signIn(credentials.email.trim(), credentials.password);
    
    // Se signIn retorna um erro direto (ex: falha na chamada da API, não erro de credenciais),
    // o authError no context pode não ter sido setado ainda ou pode ser diferente.
    // O useAuth já lida com setar authError para erros de credenciais.
    // Aqui, só precisamos garantir que setIsSubmitting seja resetado se signInError ocorrer
    // e não houver transição para authLoading.
    if (signInError && !authLoading) {
        // Erro de login (ex: credenciais inválidas) já foi tratado pelo toast no useAuth (ou será pelo useEffect)
        // Aqui só precisamos garantir que isSubmitting seja parado.
        // Se o erro não foi de credenciais mas sim um erro de rede/API no signIn,
        // o authError pode não estar atualizado ainda. O useEffect abaixo cuidará disso.
        console.error('❌ AdminHotelLogin: Erro no handleSubmit direto do signIn:', signInError.message);
        // Não é mais necessário um toast aqui, pois o useEffect vai lidar com authError.
    }
    // Se signIn não teve erro direto, o fluxo continua e o useEffect abaixo
    // irá reagir às mudanças em user, profile, authLoading, authError.
    // setIsSubmitting será resetado pelo useEffect quando authLoading for false.
  };

  useEffect(() => {
    // Este useEffect lida com o resultado de uma tentativa de login OU
    // com o estado inicial (se o usuário já estiver logado).

    // Se o AuthContext ainda está carregando (ex: verificando sessão inicial ou processando signIn),
    // e o formulário FOI submetido, mantemos isSubmitting true.
    if (authLoading && isSubmitting) {
      console.log('⏳ AdminHotelLogin (useEffect): Aguardando AuthContext processar o login...');
      return; // Mantém isSubmitting, o botão mostrará "Verificando..."
    }

    // Se o formulário estava em submissão e o AuthContext parou de carregar,
    // resetamos isSubmitting. O resultado do login será tratado abaixo.
    if (isSubmitting && !authLoading) {
      setIsSubmitting(false);
    }

    // Após o carregamento do AuthContext (authLoading === false):
    if (!authLoading) {
      if (user && profile) { // Usuário logado E perfil carregado
        if (['admin_hotel', 'admin_total'].includes(profile.role)) {
          console.log('🎉 AdminHotelLogin (useEffect): Login bem-sucedido e perfil válido. Redirecionando...');
          toast({
            title: "Login realizado com sucesso!",
            description: `Bem-vindo${profile.nome ? `, ${profile.nome}` : ''}!`,
          });
          navigate('/admin/hotel');
        } else {
          // Usuário logado, perfil carregado, MAS role errada para este painel.
          console.warn('🚫 AdminHotelLogin (useEffect): Usuário logado com role inadequada:', profile.role);
          toast({
            title: "Acesso Negado",
            description: "Sua conta não tem permissão para acessar este painel. Você será desconectado.",
            variant: "destructive"
          });
          signOut(); // Desloga o usuário. O onAuthStateChange limpará o estado.
        }
      } else if (authError && !user) { 
        // Se houve um authError e NÃO HÁ usuário (ex: credenciais inválidas, erro ao buscar perfil que levou a signOut)
        // Esta condição é importante para mostrar erros de login que o useAuth capturou.
        console.error('❌ AdminHotelLogin (useEffect): Erro de autenticação/perfil:', authError);
        // O toast sobre authError já é dado pelo useAuth/ProtectedRoute, mas podemos reforçar se necessário.
        // No entanto, para evitar toasts duplicados, podemos confiar que useAuth/ProtectedRoute já informou.
        // Se o erro foi `Perfil de usuário não encontrado...`, já terá sido mostrado.
        // Se foi de credenciais, useAuth já setou.
        // Apenas nos certificamos que o estado de submissão está falso.
      }
      // Se !user && !authError: usuário simplesmente não está logado (estado normal da página de login).
      // Se user && !profile && authError: ProtectedRoute ou useAuth já deve ter lidado (toast + signOut).
    }
  }, [user, profile, authLoading, authError, navigate, signOut, isSubmitting]);

  const disableInputs = isSubmitting || authLoading; // Desabilitar inputs durante submissão ou carregamento global de auth
  const buttonText = isSubmitting ? "Verificando..." : "Entrar no Painel";

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
                  disabled={disableInputs}
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
                  disabled={disableInputs}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={disableInputs}
              className="w-full bg-charcoal text-pure-white py-3 rounded-lg font-sora font-semibold hover:bg-stone-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
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
              <p className="text-xs text-yellow-800 font-mono break-all">
                Debug Info: isSubmitting: {isSubmitting.toString()}, authLoading (hook): {authLoading.toString()}, User: {user ? user.id : 'null'}, Profile: {profile ? profile.role : 'null'}, AuthError: {authError || 'null'}
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
