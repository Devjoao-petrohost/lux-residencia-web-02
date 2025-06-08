
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const headerClass = isHomePage 
    ? `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-off-white shadow-sm' 
          : 'bg-transparent'
      }`
    : 'bg-off-white shadow-sm';

  return (
    <header className={headerClass}>
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="font-playfair text-2xl font-bold text-charcoal">
            Maspe Residencial
          </Link>
          
          <nav className="hidden md:flex space-x-8">
            <Link 
              to="/" 
              className="text-charcoal hover:text-stone-grey transition-colors duration-300 font-inter font-medium"
            >
              Início
            </Link>
            <a 
              href="#sobre" 
              className="text-charcoal hover:text-stone-grey transition-colors duration-300 font-inter font-medium"
            >
              Sobre
            </a>
            <Link 
              to="/acomodacoes" 
              className="text-charcoal hover:text-stone-grey transition-colors duration-300 font-inter font-medium"
            >
              Acomodações
            </Link>
            <a 
              href="#servicos" 
              className="text-charcoal hover:text-stone-grey transition-colors duration-300 font-inter font-medium"
            >
              Serviços
            </a>
            <a 
              href="#contato" 
              className="text-charcoal hover:text-stone-grey transition-colors duration-300 font-inter font-medium"
            >
              Contato
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
