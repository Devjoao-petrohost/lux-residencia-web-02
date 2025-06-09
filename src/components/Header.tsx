
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
    <header className="bg-off-white shadow-lg z-[100] fixed top-0 left-0 right-0">
      <div className="container py-4 lg:py-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="font-sora text-2xl lg:text-3xl font-bold text-charcoal">
            Maspe Residencial
          </Link>
          
          <nav className="hidden lg:flex items-center space-x-8">
            <Link to="/" className="text-charcoal hover:text-stone-grey transition-colors duration-300 font-sora font-medium">
              Início
            </Link>
            <Link to="/sobre" className="text-charcoal hover:text-stone-grey transition-colors duration-300 font-sora font-medium">
              Sobre
            </Link>
            <Link to="/acomodacoes" className="text-charcoal hover:text-stone-grey transition-colors duration-300 font-sora font-medium">
              Acomodações
            </Link>
            <Link to="/servicos" className="text-charcoal hover:text-stone-grey transition-colors duration-300 font-sora font-medium">
              Serviços
            </Link>
            <Link to="/contato" className="text-charcoal hover:text-stone-grey transition-colors duration-300 font-sora font-medium">
              Contato
            </Link>
            <Link 
              to="/admin" 
              className="bg-charcoal text-pure-white px-4 py-2 font-sora font-medium hover:bg-opacity-90 transition-colors duration-300"
            >
              Login Admin
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button className="lg:hidden flex flex-col space-y-1">
            <span className="w-6 h-0.5 bg-charcoal"></span>
            <span className="w-6 h-0.5 bg-charcoal"></span>
            <span className="w-6 h-0.5 bg-charcoal"></span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
