
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { toast } from '@/hooks/use-toast';

const Admin = () => {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulação de autenticação
    setTimeout(() => {
      console.log('Login attempt:', credentials);
      
      // Simple authentication - in real app, this would be against a real backend
      if (credentials.username === 'admin' && credentials.password === 'maspe2024') {
        toast({
          title: "Login realizado com sucesso!",
          description: "Bem-vindo ao painel administrativo.",
        });
        navigate('/admin/dashboard');
      } else {
        toast({
          title: "Credenciais inválidas",
          description: "Nome de usuário ou senha incorretos.",
          variant: "destructive"
        });
      }
      
      setIsLoading(false);
    }, 1000);
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
                  Acesso restrito a administradores
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
                <p className="font-sora text-sm text-stone-grey text-center mb-2">
                  <strong>Credenciais de teste:</strong>
                </p>
                <p className="font-sora text-xs text-charcoal text-center">
                  Usuário: <strong>admin</strong><br />
                  Senha: <strong>maspe2024</strong>
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
