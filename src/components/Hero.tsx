
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const heroImages = [
  {
    url: "/hero1.png",
    alt: "Maspe Residencial"
  },
  {
    url: "/hero2.png",
    alt: "Maspe Residencial Recepção"
  },
  {
    url: "/hero3.png",
    alt: "Maspe Residencial Acomodações"
  }
];

const Hero = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="hero-section h-screen relative overflow-hidden mt-20">
      {/* Background Slider */}
      <div className="absolute inset-0 z-0">
        {heroImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentImageIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img 
              src={image.url}
              alt={image.alt}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          </div>
        ))}
      </div>

      {/* Bottom Overlay Content */}
      <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/80 to-transparent">
        <div className="container py-8 lg:py-16">
          <div className="max-w-lg">
            <h1 className="font-sora text-3xl md:text-4xl lg:text-6xl font-bold text-pure-white leading-tight mb-4 lg:mb-6">
              Sofisticação que Acolhe
            </h1>
            <p className="font-sora text-base md:text-lg lg:text-xl text-pure-white/90 font-light leading-relaxed mb-6 lg:mb-8">
              Descubra um refúgio de excelência e discrição no coração da cidade.
            </p>
            <Link 
              to="/acomodacoes"
              className="bg-pure-white text-charcoal px-6 lg:px-8 py-3 lg:py-4 font-sora font-semibold transition-all duration-300 hover:bg-opacity-90 inline-block text-center text-sm lg:text-base"
            >
              Ver Acomodações
            </Link>
          </div>
        </div>
      </div>

      {/* Slider Indicators */}
      <div className="absolute bottom-4 lg:bottom-8 right-4 lg:right-8 z-30 flex space-x-2">
        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={`w-2 h-2 lg:w-3 lg:h-3 rounded-full transition-all duration-300 ${
              index === currentImageIndex 
                ? 'bg-pure-white' 
                : 'bg-pure-white/50 hover:bg-pure-white/75'
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default Hero;
