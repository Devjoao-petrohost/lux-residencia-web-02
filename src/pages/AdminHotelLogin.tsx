import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';

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
        setIsLoading(false);
        return;
      }

      // Verificar o perfil após login
      if (authData.user) {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', authData.user.id)
          .single();

        if (profileError || !profileData || profileData.role !== 'admin_hotel') {
          await supabase.auth.signOut();
          toast({
            title: "Erro de autenticação",
            description: "Acesso não autorizado para este painel.",
            variant: "destructive"
          });
          setIsLoading(false);
          return;
        }

        // Login e verificação OK
        toast({
          title: "Login realizado com sucesso!",
          description: "Redirecionando para o painel...",
        });
        navigate('/admin/hotel');
      }
    } catch (error) {
      console.error('Erro inesperado:', error);
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
              Painel de Gestão do Hotel
            </h1>
            <p className="font-sora text-stone-grey">
              Área restrita para gestores do hotel
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="floating-label">
              <input
                type="email"
                id="email"
                name="email"
                value={credentials.email}
                onChange={handleInputChange}
                placeholder=" "
                required
              />
              <label htmlFor="email">Email *</label>
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
              <strong>Acesso Restrito:</strong><br />
              Gestão de Quartos e Reservas
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHotelLogin;
