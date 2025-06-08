
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
    ? `fixed top-0 left-0 right-0 header-fixed transition-all duration-300 ${
        isScrolled 
          ? 'bg-off-white shadow-lg' 
          : 'bg-transparent'
      }`
    : 'bg-off-white shadow-lg';

  return (
    <header className={headerClass}>
      <div className="container py-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="font-playfair text-3xl font-bold text-charcoal">
            Maspe Residencial
          </Link>
          
          <nav className="header-nav">
            <Link to="/">
              Início
            </Link>
            <a href="#sobre">
              Sobre
            </a>
            <Link to="/acomodacoes">
              Acomodações
            </Link>
            <a href="#servicos">
              Serviços
            </a>
            <a href="#contato">
              Contato
            </a>
            <Link 
              to="/admin" 
              className="bg-charcoal text-pure-white px-4 py-2 font-sora font-medium hover:bg-opacity-90 transition-colors duration-300"
            >
              Login Admin
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
