
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const heroImages = [
  {
    url: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    alt: "Suite luxuosa do Maspe Residencial"
  },
  {
    url: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    alt: "Restaurante elegante"
  },
  {
    url: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2126&q=80",
    alt: "Bar e lounge"
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
    <section className="hero-section min-h-screen relative overflow-hidden">
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
        <div className="container py-16">
          <div className="max-w-lg">
            <h1 className="font-sora text-4xl md:text-6xl font-bold text-pure-white leading-tight mb-6">
              Sofisticação que Acolhe
            </h1>
            <p className="font-sora text-lg md:text-xl text-pure-white/90 font-light leading-relaxed mb-8">
              Descubra um refúgio de excelência e discrição no coração da cidade.
            </p>
            <Link 
              to="/acomodacoes"
              className="bg-pure-white text-charcoal px-8 py-4 font-sora font-semibold transition-all duration-300 hover:bg-opacity-90 inline-block text-center"
            >
              Ver Acomodações
            </Link>
          </div>
        </div>
      </div>

      {/* Slider Indicators */}
      <div className="absolute bottom-8 right-8 z-30 flex space-x-2">
        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
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
