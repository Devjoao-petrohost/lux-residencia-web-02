import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useState, useEffect } from 'react';

// This will be replaced by dynamic data from admin
const getAccommodations = () => {
  const saved = localStorage.getItem('maspe_rooms');
  if (saved) {
    return JSON.parse(saved);
  }
  
  // Default rooms if none exist
  return [
    {
      id: 1,
      name: 'Suíte Simples',
      image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80',
      description: 'Nossa suíte oferece conforto, elegância e uma experiência completa com café da manhã incluso, Wi-Fi gratuito, serviço de quarto, salão de eventos, cafetaria, restaurante, discoteca, geladaria, bar e serviços de encomenda.',
      capacity: 4,
      features: ['Café da manhã incluso', 'Wi-Fi gratuito', 'Serviço de quarto', 'Bar'],
      price: 79000,
      services: ['Café da manhã incluso', 'Wi-Fi gratuito', 'Serviço de quarto', 'Salão de eventos', 'Cafetaria', 'Restaurante', 'Discoteca', 'Geladaria', 'Bar', 'Serviços de encomenda']
    },
    {
      id: 2,
      name: 'Suíte Standard',
      image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80',
      description: 'Nossa suíte oferece conforto, elegância e uma experiência completa com café da manhã incluso, Wi-Fi gratuito, serviço de quarto, salão de eventos, cafetaria, restaurante, discoteca, geladaria, bar e serviços de encomenda.',
      capacity: 4,
      features: ['Café da manhã incluso', 'Wi-Fi gratuito', 'Serviço de quarto', 'Bar'],
      price: 89000,
      services: ['Café da manhã incluso', 'Wi-Fi gratuito', 'Serviço de quarto', 'Salão de eventos', 'Cafetaria', 'Restaurante', 'Discoteca', 'Geladaria', 'Bar', 'Serviços de encomenda']
    },
    {
      id: 3,
      name: 'Suíte Conforto',
      image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?ixlib=rb-4.0.3&ixid=M3wxMJA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80',
      description: 'Nossa suíte oferece conforto, elegância e uma experiência completa com café da manhã incluso, Wi-Fi gratuito, serviço de quarto, salão de eventos, cafetaria, restaurante, discoteca, geladaria, bar e serviços de encomenda.',
      capacity: 4,
      features: ['Café da manhã incluso', 'Wi-Fi gratuito', 'Serviço de quarto', 'Bar'],
      price: 99000,
      services: ['Café da manhã incluso', 'Wi-Fi gratuito', 'Serviço de quarto', 'Salão de eventos', 'Cafetaria', 'Restaurante', 'Discoteca', 'Geladaria', 'Bar', 'Serviços de encomenda']
    },
    {
      id: 4,
      name: 'Suíte Luxo',
      image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80',
      description: 'Nossa suíte oferece conforto, elegância e uma experiência completa com café da manhã incluso, Wi-Fi gratuito, serviço de quarto, salão de eventos, cafetaria, restaurante, discoteca, geladaria, bar e serviços de encomenda.',
      capacity: 4,
      features: ['Café da manhã incluso', 'Wi-Fi gratuito', 'Serviço de quarto', 'Bar'],
      price: 129000,
      services: ['Café da manhã incluso', 'Wi-Fi gratuito', 'Serviço de quarto', 'Salão de eventos', 'Cafetaria', 'Restaurante', 'Discoteca', 'Geladaria', 'Bar', 'Serviços de encomenda']
    },
    {
      id: 5,
      name: 'Suíte Premium',
      image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80',
      description: 'Nossa suíte oferece conforto, elegância e uma experiência completa com café da manhã incluso, Wi-Fi gratuito, serviço de quarto, salão de eventos, cafetaria, restaurante, discoteca, geladaria, bar e serviços de encomenda.',
      capacity: 4,
      features: ['Café da manhã incluso', 'Wi-Fi gratuito', 'Serviço de quarto', 'Bar'],
      price: 149000,
      services: ['Café da manhã incluso', 'Wi-Fi gratuito', 'Serviço de quarto', 'Salão de eventos', 'Cafetaria', 'Restaurante', 'Discoteca', 'Geladaria', 'Bar', 'Serviços de encomenda']
    },
    {
      id: 6,
      name: 'Suíte Master',
      image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80',
      description: 'Nossa suíte oferece conforto, elegância e uma experiência completa com café da manhã incluso, Wi-Fi gratuito, serviço de quarto, salão de eventos, cafetaria, restaurante, discoteca, geladaria, bar e serviços de encomenda.',
      capacity: 4,
      features: ['Café da manhã incluso', 'Wi-Fi gratuito', 'Serviço de quarto', 'Bar'],
      price: 179000,
      services: ['Café da manhã incluso', 'Wi-Fi gratuito', 'Serviço de quarto', 'Salão de eventos', 'Cafetaria', 'Restaurante', 'Discoteca', 'Geladaria', 'Bar', 'Serviços de encomenda']
    },
    {
      id: 7,
      name: 'Suíte Familiar',
      image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80',
      description: 'Nossa suíte oferece conforto, elegância e uma experiência completa com café da manhã incluso, Wi-Fi gratuito, serviço de quarto, salão de eventos, cafetaria, restaurante, discoteca, geladaria, bar e serviços de encomenda.',
      capacity: 4,
      features: ['Café da manhã incluso', 'Wi-Fi gratuito', 'Serviço de quarto', 'Bar'],
      price: 199000,
      services: ['Café da manhã incluso', 'Wi-Fi gratuito', 'Serviço de quarto', 'Salão de eventos', 'Cafetaria', 'Restaurante', 'Discoteca', 'Geladaria', 'Bar', 'Serviços de encomenda']
    },
    {
      id: 8,
      name: 'Suíte Executiva',
      image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80',
      description: 'Nossa suíte oferece conforto, elegância e uma experiência completa com café da manhã incluso, Wi-Fi gratuito, serviço de quarto, salão de eventos, cafetaria, restaurante, discoteca, geladaria, bar e serviços de encomenda.',
      capacity: 4,
      features: ['Café da manhã incluso', 'Wi-Fi gratuito', 'Serviço de quarto', 'Bar'],
      price: 189000,
      services: ['Café da manhã incluso', 'Wi-Fi gratuito', 'Serviço de quarto', 'Salão de eventos', 'Cafetaria', 'Restaurante', 'Discoteca', 'Geladaria', 'Bar', 'Serviços de encomenda']
    },
    {
      id: 9,
      name: 'Suíte Romântica',
      image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80',
      description: 'Nossa suíte oferece conforto, elegância e uma experiência completa com café da manhã incluso, Wi-Fi gratuito, serviço de quarto, salão de eventos, cafetaria, restaurante, discoteca, geladaria, bar e serviços de encomenda.',
      capacity: 4,
      features: ['Café da manhã incluso', 'Wi-Fi gratuito', 'Serviço de quarto', 'Bar'],
      price: 159000,
      services: ['Café da manhã incluso', 'Wi-Fi gratuito', 'Serviço de quarto', 'Salão de eventos', 'Cafetaria', 'Restaurante', 'Discoteca', 'Geladaria', 'Bar', 'Serviços de encomenda']
    },
    {
      id: 10,
      name: 'Suíte Terraço',
      image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80',
      description: 'Nossa suíte oferece conforto, elegância e uma experiência completa com café da manhã incluso, Wi-Fi gratuito, serviço de quarto, salão de eventos, cafetaria, restaurante, discoteca, geladaria, bar e serviços de encomenda.',
      capacity: 4,
      features: ['Café da manhã incluso', 'Wi-Fi gratuito', 'Serviço de quarto', 'Bar'],
      price: 174000,
      services: ['Café da manhã incluso', 'Wi-Fi gratuito', 'Serviço de quarto', 'Salão de eventos', 'Cafetaria', 'Restaurante', 'Discoteca', 'Geladaria', 'Bar', 'Serviços de encomenda']
    },
    {
      id: 11,
      name: 'Suíte Spa',
      image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80',
      description: 'Nossa suíte oferece conforto, elegância e uma experiência completa com café da manhã incluso, Wi-Fi gratuito, serviço de quarto, salão de eventos, cafetaria, restaurante, discoteca, geladaria, bar e serviços de encomenda.',
      capacity: 4,
      features: ['Café da manhã incluso', 'Wi-Fi gratuito', 'Serviço de quarto', 'Bar'],
      price: 209000,
      services: ['Café da manhã incluso', 'Wi-Fi gratuito', 'Serviço de quarto', 'Salão de eventos', 'Cafetaria', 'Restaurante', 'Discoteca', 'Geladaria', 'Bar', 'Serviços de encomenda']
    },
    {
      id: 12,
      name: 'Suíte Cultural',
      image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80',
      description: 'Nossa suíte oferece conforto, elegância e uma experiência completa com café da manhã incluso, Wi-Fi gratuito, serviço de quarto, salão de eventos, cafetaria, restaurante, discoteca, geladaria, bar e serviços de encomenda.',
      capacity: 4,
      features: ['Café da manhã incluso', 'Wi-Fi gratuito', 'Serviço de quarto', 'Bar'],
      price: 169000,
      services: ['Café da manhã incluso', 'Wi-Fi gratuito', 'Serviço de quarto', 'Salão de eventos', 'Cafetaria', 'Restaurante', 'Discoteca', 'Geladaria', 'Bar', 'Serviços de encomenda']
    },
    {
      id: 13,
      name: 'Suíte Moderna',
      image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80',
      description: 'Nossa suíte oferece conforto, elegância e uma experiência completa com café da manhã incluso, Wi-Fi gratuito, serviço de quarto, salão de eventos, cafetaria, restaurante, discoteca, geladaria, bar e serviços de encomenda.',
      capacity: 4,
      features: ['Café da manhã incluso', 'Wi-Fi gratuito', 'Serviço de quarto', 'Bar'],
      price: 179000,
      services: ['Café da manhã incluso', 'Wi-Fi gratuito', 'Serviço de quarto', 'Salão de eventos', 'Cafetaria', 'Restaurante', 'Discoteca', 'Geladaria', 'Bar', 'Serviços de encomenda']
    },
    {
      id: 14,
      name: 'Suíte Artística',
      image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80',
      description: 'Nossa suíte oferece conforto, elegância e uma experiência completa com café da manhã incluso, Wi-Fi gratuito, serviço de quarto, salão de eventos, cafetaria, restaurante, discoteca, geladaria, bar e serviços de encomenda.',
      capacity: 4,
      features: ['Café da manhã incluso', 'Wi-Fi gratuito', 'Serviço de quarto', 'Bar'],
      price: 199000,
      services: ['Café da manhã incluso', 'Wi-Fi gratuito', 'Serviço de quarto', 'Salão de eventos', 'Cafetaria', 'Restaurante', 'Discoteca', 'Geladaria', 'Bar', 'Serviços de encomenda']
    },
    {
      id: 15,
      name: 'Suíte Cobertura',
      image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80',
      description: 'Nossa suíte oferece conforto, elegância e uma experiência completa com café da manhã incluso, Wi-Fi gratuito, serviço de quarto, salão de eventos, cafetaria, restaurante, discoteca, geladaria, bar e serviços de encomenda.',
      capacity: 4,
      features: ['Café da manhã incluso', 'Wi-Fi gratuito', 'Serviço de quarto', 'Bar'],
      price: 269000,
      services: ['Café da manhã incluso', 'Wi-Fi gratuito', 'Serviço de quarto', 'Salão de eventos', 'Cafetaria', 'Restaurante', 'Discoteca', 'Geladaria', 'Bar', 'Serviços de encomenda']
    },
    {
      id: 16,
      name: 'Suíte Platina',
      image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80',
      description: 'Nossa suíte oferece conforto, elegância e uma experiência completa com café da manhã incluso, Wi-Fi gratuito, serviço de quarto, salão de eventos, cafetaria, restaurante, discoteca, geladaria, bar e serviços de encomenda.',
      capacity: 4,
      features: ['Café da manhã incluso', 'Wi-Fi gratuito', 'Serviço de quarto', 'Bar'],
      price: 249000,
      services: ['Café da manhã incluso', 'Wi-Fi gratuito', 'Serviço de quarto', 'Salão de eventos', 'Cafetaria', 'Restaurante', 'Discoteca', 'Geladaria', 'Bar', 'Serviços de encomenda']
    }
  ];
};

const Accommodations = () => {
  const [accommodations, setAccommodations] = useState(getAccommodations());

  useEffect(() => {
    // Listen for changes in localStorage to update rooms dynamically
    const handleStorageChange = () => {
      setAccommodations(getAccommodations());
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-24">
        <section className="py-8 lg:py-16 bg-off-white">
          <div className="container mx-auto px-4 lg:px-6">
            <div className="text-center mb-8 lg:mb-12">
              <h1 className="font-sora text-3xl md:text-4xl lg:text-6xl font-bold text-charcoal mb-4">
                Nossas Acomodações
              </h1>
              <p className="font-sora text-base lg:text-xl text-stone-grey max-w-3xl mx-auto">
                Cada suíte do Maspe Residencial foi meticulosamente projetada para oferecer uma experiência única de conforto, elegância e funcionalidade.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {accommodations.map((room) => (
                <div key={room.id} className="bg-pure-white overflow-hidden group hover:shadow-lg transition-shadow duration-300">
                  <div className="relative overflow-hidden">
                    <img 
                      src={room.image}
                      alt={room.name}
                      className="w-full h-48 lg:h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  
                  <div className="p-4 lg:p-6">
                    <h3 className="font-sora text-lg lg:text-2xl font-bold text-charcoal mb-2 lg:mb-3">
                      {room.name}
                    </h3>
                    
                    <div className="mb-3">
                      <span className="text-sm font-sora font-semibold text-charcoal bg-off-white px-2 py-1">
                        Capacidade: {room.capacity} pessoa{room.capacity > 1 ? 's' : ''}
                      </span>
                    </div>
                    
                    <p className="font-sora text-sm lg:text-base text-stone-grey mb-4 leading-relaxed">
                      {room.description}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      {room.features.slice(0, 4).map((feature, index) => (
                        <span 
                          key={index}
                          className="text-xs font-sora text-charcoal bg-off-white px-2 py-1"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                    
                    <div className="mb-4 lg:mb-6">
                      <span className="font-sora text-lg lg:text-xl font-semibold text-charcoal">
                        {room.price.toLocaleString('pt-AO')} Kz/noite
                      </span>
                    </div>
                    
                    <Link 
                      to={`/checkout?suite=${encodeURIComponent(room.name)}&id=${room.id}`}
                      className="block w-full bg-charcoal text-pure-white text-center py-2 lg:py-3 font-sora font-semibold hover:bg-opacity-90 transition-colors duration-300 text-sm lg:text-base"
                    >
                      Reservar Agora
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Accommodations;
