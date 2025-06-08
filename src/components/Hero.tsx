
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(43, 43, 43, 0.3), rgba(43, 43, 43, 0.3)), url('https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`
        }}
      />
      
      <div className="relative z-10 text-center text-pure-white px-6 animate-fade-in">
        <h1 className="font-playfair text-5xl md:text-7xl font-bold mb-6 leading-tight">
          Sofisticação que Acolhe
        </h1>
        <p className="font-inter text-xl md:text-2xl mb-8 max-w-2xl mx-auto font-light">
          Descubra um refúgio de excelência e discrição no coração da cidade.
        </p>
        <Link 
          to="/acomodacoes"
          className="inline-block bg-charcoal text-pure-white px-8 py-4 font-inter font-semibold tracking-wide hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105"
        >
          Ver Acomodações
        </Link>
      </div>
    </section>
  );
};

export default Hero;
