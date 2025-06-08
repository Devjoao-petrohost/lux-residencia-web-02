
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Admin = () => {
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
      setIsLoading(false);
      // Aqui seria implementada a lógica real de autenticação
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
                <h1 className="font-playfair text-3xl font-bold text-charcoal mb-4">
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
