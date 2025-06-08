
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="hero-section min-h-screen flex items-center justify-center bg-off-white pt-24">
      <div className="container">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Left Column - Text Content */}
          <div className="text-content space-y-8">
            <h1 className="font-playfair text-5xl md:text-7xl font-bold text-charcoal leading-tight">
              Sofisticação que Acolhe
            </h1>
            <p className="font-sora text-xl md:text-2xl text-stone-grey font-light leading-relaxed">
              Descubra um refúgio de excelência e discrição no coração da cidade.
            </p>
            <Link 
              to="/acomodacoes"
              className="btn-primary transform hover:scale-105"
            >
              Ver Acomodações
            </Link>
          </div>
          
          {/* Right Column - Image */}
          <div className="image-container">
            <img 
              src="https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
              alt="Suite luxuosa do Maspe Residencial"
              className="w-full h-96 md:h-[600px] object-cover"
            />
            <div className="image-overlay"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
