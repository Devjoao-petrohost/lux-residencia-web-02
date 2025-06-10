
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';

const AdminTotalLogin = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Buscar o email associado ao username
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', credentials.username)
        .eq('role', 'admin_total')
        .single();

      if (profileError || !profile) {
        toast({
          title: "Erro de autenticação",
          description: "Nome de usuário ou senha incorretos.",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }

      // Buscar o email do usuário na tabela auth.users
      const { data: user, error: userError } = await supabase
        .from('auth.users')
        .select('email')
        .eq('id', profile.id)
        .single();

      if (userError || !user) {
        toast({
          title: "Erro de autenticação",
          description: "Erro interno. Contacte o administrador.",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }

      // Fazer login com o email encontrado
      const { error } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: credentials.password,
      });
      
      if (error) {
        toast({
          title: "Erro de autenticação",
          description: "Nome de usuário ou senha incorretos.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Login realizado com sucesso!",
          description: "Redirecionando para o painel...",
        });
        navigate('/admin/total');
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro inesperado.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-off-white flex items-center justify-center">
      <div className="container max-w-md mx-auto">
        <div className="bg-pure-white p-12 shadow-lg">
          <div className="text-center mb-12">
            <h1 className="font-sora text-3xl font-bold text-charcoal mb-4">
              Acesso ao Painel de Controlo Total
            </h1>
            <p className="font-sora text-stone-grey">
              Área restrita para administração executiva
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="floating-label">
              <input
                type="text"
                id="username"
                name="username"
                value={credentials.username}
                onChange={handleInputChange}
                placeholder=" "
                required
              />
              <label htmlFor="username">Nome de Usuário *</label>
            </div>

            <div className="floating-label">
              <input
                type="password"
                id="password"
                name="password"
                value={credentials.password}
                onChange={handleInputChange}
                placeholder=" "
                required
              />
              <label htmlFor="password">Senha *</label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full py-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Verificando...' : 'Entrar'}
            </button>
          </form>

          <div className="mt-8 p-4 bg-off-white">
            <p className="font-sora text-sm text-stone-grey text-center">
              <strong>Acesso Executivo:</strong><br />
              Dashboard Completo Hotel + Restaurante
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminTotalLogin;
