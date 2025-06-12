
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
import { Hotel, Mail, Lock, ArrowLeft, Loader } from 'lucide-react';

const AdminHotelLogin = () => {
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
      // Autenticação com email e senha
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

      // Verificar o perfil após login
      if (authData.user) {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('role, nome')
          .eq('id', authData.user.id)
          .single();

        if (profileError || !profileData || !['admin_hotel', 'admin_total'].includes(profileData.role)) {
          await supabase.auth.signOut();
          toast({
            title: "Acesso negado",
            description: "Você não tem permissão para acessar este painel.",
            variant: "destructive"
          });
          return;
        }

        // Login e verificação OK
        toast({
          title: "Login realizado com sucesso!",
          description: `Bem-vindo${profileData.nome ? `, ${profileData.nome}` : ''}!`,
        });
        navigate('/admin/hotel');
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
