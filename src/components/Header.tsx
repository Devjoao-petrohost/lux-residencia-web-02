import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="cabecalho-principal bg-pure-white shadow-lg z-[100] fixed top-0 left-0 right-0 border-b border-stone-grey">
      <div className="container py-4 lg:py-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col items-start leading-tight ml-[-8px] lg:ml-[-16px]">
            <Link to="/" className="logo-principal flex items-center gap-2">
              <img src="/logo1.png" alt="Logo Maspe Residencial" className="h-12 w-auto lg:h-16 border-2 border-stone-grey rounded-md bg-white" />
            </Link>
          </div>
          
          <nav className="navegacao-principal hidden lg:flex items-center space-x-8">
            <Link to="/" className="link-navegacao text-charcoal hover:text-yellow-500 transition-all duration-300 font-sora font-medium relative">
              Início
            </Link>
            <Link to="/sobre" className="link-navegacao text-charcoal hover:text-yellow-500 transition-all duration-300 font-sora font-medium relative">
              Sobre
            </Link>
            <Link to="/acomodacoes" className="link-navegacao text-charcoal hover:text-yellow-500 transition-all duration-300 font-sora font-medium relative">
              Acomodações
            </Link>
            <Link to="/servicos" className="link-navegacao text-charcoal hover:text-yellow-500 transition-all duration-300 font-sora font-medium relative">
              Serviços
            </Link>
            <Link to="/contato" className="link-navegacao text-charcoal hover:text-yellow-500 transition-all duration-300 font-sora font-medium relative">
              Contato
            </Link>
          </nav>

          {/* Botão do Menu Mobile */}
          <button className="menu-mobile lg:hidden flex flex-col space-y-1 transition-all duration-300 hover:opacity-75 focus:outline-none focus:ring-2 focus:ring-yellow-500">
            <span className="w-6 h-0.5 bg-charcoal transition-all duration-300"></span>
            <span className="w-6 h-0.5 bg-charcoal transition-all duration-300"></span>
            <span className="w-6 h-0.5 bg-charcoal transition-all duration-300"></span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
