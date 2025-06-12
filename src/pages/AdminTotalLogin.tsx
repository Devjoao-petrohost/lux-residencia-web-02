
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
import { Shield, Mail, Lock, ArrowLeft, Loader } from 'lucide-react';

const AdminTotalLogin = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);

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
    
    try {
      // Fazer o login direto com o EMAIL fornecido
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });
      
      if (authError) {
        console.error('Erro de login:', authError);
        toast({
          title: "Erro de autenticação",
          description: "Email ou senha incorretos.",
          variant: "destructive"
        });
        return;
      }

      // Verificar o perfil após login bem-sucedido
      if (authData.user) {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('role, nome')
          .eq('id', authData.user.id)
          .eq('role', 'admin_total')
          .single();

        if (profileError || !profileData) {
          await supabase.auth.signOut();
          toast({
            title: "Acesso negado",
            description: "Você não tem permissão para acessar o painel executivo.",
            variant: "destructive"
          });
          return;
        }

        // Sucesso total
        toast({
          title: "Login executivo realizado!",
          description: `Bem-vindo ao painel executivo${profileData.nome ? `, ${profileData.nome}` : ''}!`,
        });
        navigate('/admin/total');
      }
    } catch (error) {
      console.error('Erro inesperado:', error);
      toast({
        title: "Erro do sistema",
        description: "Ocorreu um erro inesperado. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

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
                  disabled={isLoading}
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
                  <span>Autenticando...</span>
                </>
              ) : (
                <span>Acessar Painel Executivo</span>
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
