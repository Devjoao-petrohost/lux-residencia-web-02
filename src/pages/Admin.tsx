
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

const Admin = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
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
      const { error } = await signIn(credentials.email, credentials.password);
      
      if (error) {
        toast({
          title: "Erro de autenticação",
          description: "Email ou senha incorretos.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Login realizado com sucesso!",
          description: "Redirecionando...",
        });
        // O redirecionamento será baseado no role do usuário
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
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-32">
        <section className="py-16 bg-off-white min-h-screen flex items-center">
          <div className="container max-w-md mx-auto">
            <div className="bg-pure-white p-12 shadow-lg">
              <div className="text-center mb-12">
                <h1 className="font-sora text-3xl font-bold text-charcoal mb-4">
                  Área Administrativa
                </h1>
                <p className="font-sora text-stone-grey">
                  Acesso ao sistema integrado Hotel + Restaurante
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
                <p className="font-sora text-sm text-stone-grey text-center mb-2">
                  <strong>Sistema Integrado:</strong>
                </p>
                <p className="font-sora text-xs text-charcoal text-center">
                  Hotel + Restaurante<br />
                  Conectado ao Supabase
                </p>
              </div>

              <div className="text-center mt-8">
                <Link 
                  to="/" 
                  className="text-stone-grey hover:text-charcoal font-sora text-sm"
                >
                  ← Voltar ao site principal
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Admin;
