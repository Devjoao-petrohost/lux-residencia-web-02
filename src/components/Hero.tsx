
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-off-white">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <div className="space-y-8">
            <h1 className="font-playfair text-5xl md:text-7xl font-bold text-charcoal leading-tight">
              Sofisticação que Acolhe
            </h1>
            <p className="font-inter text-xl md:text-2xl text-stone-grey font-light leading-relaxed">
              Descubra um refúgio de excelência e discrição no coração da cidade.
            </p>
            <Link 
              to="/acomodacoes"
              className="inline-block bg-charcoal text-pure-white px-8 py-4 font-inter font-semibold tracking-wide hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105"
            >
              Ver Acomodações
            </Link>
          </div>
          
          {/* Right Column - Image */}
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
              alt="Suite luxuosa do Maspe Residencial"
              className="w-full h-96 md:h-[500px] object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
