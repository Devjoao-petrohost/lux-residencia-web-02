import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth'; // Alterado para usar o hook centralizado
import { toast } from '@/hooks/use-toast';
import { Shield, Mail, Lock, ArrowLeft, Loader } from 'lucide-react';

const AdminTotalLogin = () => {
  const navigate = useNavigate();
  const { 
    user, 
    profile, 
    loading: authLoading, 
    authError, 
    signIn, 
    signOut 
  } = useAuth();

  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    setIsSubmitting(true);
    // A função signIn do useAuth tratará o loading e os erros.
    await signIn(credentials.email.trim(), credentials.password);
    // O useEffect abaixo cuidará do resultado.
  };

  useEffect(() => {
    if (authLoading && isSubmitting) {
      console.log('⏳ AdminTotalLogin (useEffect): Aguardando AuthContext processar o login...');
      return;
    }

    if (isSubmitting && !authLoading) {
      setIsSubmitting(false);
    }

    if (!authLoading) {
      if (user && profile) {
        if (profile.role === 'admin_total') { // Apenas admin_total para este painel
          console.log('🎉 AdminTotalLogin (useEffect): Login bem-sucedido e perfil válido. Redirecionando...');
          toast({
            title: "Login executivo realizado!",
            description: `Bem-vindo ao painel executivo${profile.nome ? `, ${profile.nome}` : ''}!`,
          });
          navigate('/admin/total');
        } else {
          console.warn('🚫 AdminTotalLogin (useEffect): Usuário logado com role inadequada:', profile.role);
          toast({
            title: "Acesso Negado",
            description: "Sua conta não tem permissão para acessar o painel executivo. Você será desconectado.",
            variant: "destructive"
          });
          signOut();
        }
      } else if (authError && !user) {
         console.error('❌ AdminTotalLogin (useEffect): Erro de autenticação/perfil:', authError);
         // Erros de login já são cobertos pelo useAuth.
      }
    }
  }, [user, profile, authLoading, authError, navigate, signOut, isSubmitting]);
  
  const disableInputs = isSubmitting || authLoading;
  const buttonText = isSubmitting ? "Autenticando..." : "Acessar Painel Executivo";

  return (
    <div className="min-h-screen bg-gradient-to-br from-charcoal via-stone-800 to-stone-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="bg-pure-white p-4 rounded-full shadow-xl">
              <Shield className="w-12 h-12 text-charcoal" />
            </div>
          </div>
          <h1 className="font-sora text-3xl font-bold text-pure-white mb-2">
            Painel Executivo
          </h1>
          <p className="font-sora text-stone-grey">
            Acesso restrito para administração total
          </p>
        </div>

        {/* Form */}
        <div className="bg-pure-white rounded-xl shadow-2xl border border-stone-300 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block font-sora text-sm font-medium text-charcoal mb-2">
                Email Executivo
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-grey w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  value={credentials.email}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-3 border border-stone-grey rounded-lg font-sora focus:outline-none focus:ring-2 focus:ring-charcoal focus:border-transparent"
                  placeholder="admin@masperesidencial.ao"
                  required
                  disabled={disableInputs}
                />
              </div>
            </div>

            <div>
              <label className="block font-sora text-sm font-medium text-charcoal mb-2">
                Senha Executiva
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-grey w-5 h-5" />
                <input
                  type="password"
                  name="password"
                  value={credentials.password}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-3 border border-stone-grey rounded-lg font-sora focus:outline-none focus:ring-2 focus:ring-charcoal focus:border-transparent"
                  placeholder="••••••••••"
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
                  <span>Autenticando...</span>
                </>
              ) : (
                <span>{buttonText}</span>
              )}
            </button>
          </form>

          <div className="mt-6 p-4 bg-charcoal text-pure-white rounded-lg">
            <h3 className="font-sora text-sm font-semibold mb-2">
              Painel de Controle Total
            </h3>
            <ul className="font-sora text-xs text-stone-300 space-y-1">
              <li>• Dashboard executivo completo</li>
              <li>• Gestão de hotel e restaurante</li>
              <li>• Relatórios financeiros avançados</li>
              <li>• Controle total do sistema</li>
            </ul>
          </div>

          {/* Debug Info em desenvolvimento */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-xs text-yellow-800 font-mono break-all">
                 Debug Info: isSubmitting: {isSubmitting.toString()}, authLoading (hook): {authLoading.toString()}, User: {user ? user.id : 'null'}, Profile: {profile ? profile.role : 'null'}, AuthError: {authError || 'null'}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <Link 
            to="/" 
            className="inline-flex items-center space-x-2 font-sora text-sm text-stone-400 hover:text-pure-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar ao site principal</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminTotalLogin;
