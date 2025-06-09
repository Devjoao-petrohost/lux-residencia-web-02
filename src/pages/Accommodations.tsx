
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
      name: 'Suíte Presidencial Deluxe',
      image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      description: 'Nossa suíte mais luxuosa com vista panorâmica da cidade e serviço de mordomo 24h. Inclui café da manhã, Wi-Fi gratuito, serviço de quarto, acesso ao restaurante e bar.',
      status: 'Disponível',
      capacity: 4,
      features: ['Vista panorâmica', 'Banheira de hidromassagem', 'Serviço de mordomo', 'Bar privado'],
      price: 299000,
      services: ['Café da manhã incluso', 'Wi-Fi gratuito', 'Serviço de quarto', 'Restaurante', 'Bar']
    },
    {
      id: 2,
      name: 'Suíte Executive Master',
      image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80',
      description: 'Ideal para executivos, com escritório integrado e alta velocidade de internet. Inclui café da manhã, Wi-Fi premium, serviço de quarto e acesso ao salão de eventos.',
      status: 'Ocupado',
      capacity: 2,
      features: ['Escritório integrado', 'Wi-Fi premium', 'Business center', 'Impressora'],
      price: 199000,
      services: ['Café da manhã incluso', 'Wi-Fi gratuito', 'Serviço de quarto', 'Salão de eventos']
    },
    {
      id: 3,
      name: 'Suíte Premium Ocean',
      image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=M3wxMJA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2126&q=80',
      description: 'Combinação perfeita de conforto e elegância, com varanda privativa. Inclui café da manhã, Wi-Fi gratuito, serviço de quarto e acesso à cafetaria.',
      status: 'Disponível',
      capacity: 3,
      features: ['Varanda privativa', 'Amenidades premium', 'Room service 24h', 'Vista oceânica'],
      price: 149000,
      services: ['Café da manhã incluso', 'Wi-Fi gratuito', 'Serviço de quarto', 'Cafetaria']
    },
    {
      id: 4,
      name: 'Suíte Classic Comfort',
      image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      description: 'Nosso quarto mais aconchegante, perfeito para estadias de lazer. Inclui café da manhã, Wi-Fi gratuito, serviço de quarto e acesso ao bar.',
      status: 'Disponível',
      capacity: 2,
      features: ['Design aconchegante', 'Minibar premium', 'Concierge personalizado', 'Sala de estar'],
      price: 99000,
      services: ['Café da manhã incluso', 'Wi-Fi gratuito', 'Serviço de quarto', 'Bar']
    },
    {
      id: 5,
      name: 'Suíte Garden Paradise',
      image: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      description: 'Suíte única com acesso direto ao jardim privativo, perfeita para relaxamento. Inclui café da manhã, Wi-Fi gratuito, serviço de quarto e acesso à geladaria.',
      status: 'Disponível',
      capacity: 2,
      features: ['Jardim privativo', 'Terraço', 'Banheira externa', 'Spa privado'],
      price: 174000,
      services: ['Café da manhã incluso', 'Wi-Fi gratuito', 'Serviço de quarto', 'Geladaria']
    },
    {
      id: 6,
      name: 'Suíte Family Supreme',
      image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      description: 'Ampla suíte familiar com dois quartos conectados, ideal para famílias. Inclui café da manhã, Wi-Fi gratuito, serviço de quarto e acesso à discoteca.',
      status: 'Ocupado',
      capacity: 6,
      features: ['Dois quartos', 'Sala de estar', 'Cozinha compacta', 'Área de jogos'],
      price: 224000,
      services: ['Café da manhã incluso', 'Wi-Fi gratuito', 'Serviço de quarto', 'Discoteca']
    },
    {
      id: 7,
      name: 'Suíte Business Elite',
      image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      description: 'Projetada para o viajante de negócios moderno, com todas as facilidades necessárias. Inclui café da manhã, Wi-Fi premium, serviço de quarto e salão de eventos.',
      status: 'Disponível',
      capacity: 2,
      features: ['Mesa executiva', 'Internet dedicada', 'Impressora', 'Sala de reuniões'],
      price: 189000,
      services: ['Café da manhã incluso', 'Wi-Fi gratuito', 'Serviço de quarto', 'Salão de eventos']
    },
    {
      id: 8,
      name: 'Suíte Romantic Sunset',
      image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=M3wxMJA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2126&q=80',
      description: 'Ambiente perfeito para casais, com decoração romântica e vista privilegiada. Inclui café da manhã, Wi-Fi gratuito, serviço de quarto e acesso ao restaurante.',
      status: 'Disponível',
      capacity: 2,
      features: ['Vista oeste', 'Decoração romântica', 'Banheira dupla', 'Terraço privado'],
      price: 159000,
      services: ['Café da manhã incluso', 'Wi-Fi gratuito', 'Serviço de quarto', 'Restaurante']
    },
    {
      id: 9,
      name: 'Suíte Urban Style',
      image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80',
      description: 'Design moderno e urbano, ideal para hóspedes que apreciam estilo contemporâneo. Inclui café da manhã, Wi-Fi gratuito, serviço de quarto e cafetaria.',
      status: 'Disponível',
      capacity: 3,
      features: ['Design contemporâneo', 'Smart TV', 'Sistema de som', 'Iluminação inteligente'],
      price: 129000,
      services: ['Café da manhã incluso', 'Wi-Fi gratuito', 'Serviço de quarto', 'Cafetaria']
    },
    {
      id: 10,
      name: 'Suíte Comfort Plus',
      image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      description: 'Conforto elevado com todas as comodidades essenciais para uma estadia perfeita. Inclui café da manhã, Wi-Fi gratuito, serviço de quarto e bar.',
      status: 'Ocupado',
      capacity: 2,
      features: ['Cama king size', 'Frigobar', 'Cofre digital', 'Varanda pequena'],
      price: 109000,
      services: ['Café da manhã incluso', 'Wi-Fi gratuito', 'Serviço de quarto', 'Bar']
    },
    {
      id: 11,
      name: 'Suíte Wellness Spa',
      image: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      description: 'Focada no bem-estar, com spa privado e amenidades de relaxamento. Inclui café da manhã, Wi-Fi gratuito, serviço de quarto e serviços de encomenda.',
      status: 'Disponível',
      capacity: 2,
      features: ['Spa privado', 'Sauna', 'Produtos orgânicos', 'Área de meditação'],
      price: 209000,
      services: ['Café da manhã incluso', 'Wi-Fi gratuito', 'Serviço de quarto', 'Serviços de encomenda']
    },
    {
      id: 12,
      name: 'Suíte Cultural Heritage',
      image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      description: 'Decoração inspirada na cultura angolana, celebrando a rica herança local. Inclui café da manhã, Wi-Fi gratuito, serviço de quarto e restaurante.',
      status: 'Disponível',
      capacity: 3,
      features: ['Arte local', 'Mobiliário artesanal', 'Biblioteca', 'Galeria privada'],
      price: 169000,
      services: ['Café da manhã incluso', 'Wi-Fi gratuito', 'Serviço de quarto', 'Restaurante']
    },
    {
      id: 13,
      name: 'Suíte Technology Hub',
      image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      description: 'Equipada com a mais moderna tecnologia para o hóspede conectado. Inclui café da manhã, Wi-Fi premium, serviço de quarto e serviços de encomenda.',
      status: 'Disponível',
      capacity: 2,
      features: ['Casa inteligente', 'Múltiplas telas', 'Carregamento wireless', 'Gaming setup'],
      price: 179000,
      services: ['Café da manhã incluso', 'Wi-Fi gratuito', 'Serviço de quarto', 'Serviços de encomenda']
    },
    {
      id: 14,
      name: 'Suíte Artistic Loft',
      image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=M3wxMJA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2126&q=80',
      description: 'Ambiente criativo com pé-direito alto e decoração artística única. Inclui café da manhã, Wi-Fi gratuito, serviço de quarto e cafetaria.',
      status: 'Disponível',
      capacity: 4,
      features: ['Pé-direito alto', 'Obras de arte', 'Espaço criativo', 'Atelier'],
      price: 199000,
      services: ['Café da manhã incluso', 'Wi-Fi gratuito', 'Serviço de quarto', 'Cafetaria']
    },
    {
      id: 15,
      name: 'Suíte Penthouse Vista',
      image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80',
      description: 'Localizada no último andar, oferece vista 360° da cidade de Luanda. Inclui café da manhã, Wi-Fi premium, serviço de quarto e acesso completo ao bar.',
      status: 'Disponível',
      capacity: 6,
      features: ['Vista 360°', 'Terraço privativo', 'Bar privado', 'Jacuzzi exterior'],
      price: 269000,
      services: ['Café da manhã incluso', 'Wi-Fi gratuito', 'Serviço de quarto', 'Bar']
    },
    {
      id: 16,
      name: 'Suíte Executive Platinum',
      image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      description: 'O máximo em luxo executivo, com serviços premium e acabamentos de primeira classe. Inclui café da manhã, Wi-Fi premium, serviço de quarto e salão de eventos.',
      status: 'Disponível',
      capacity: 4,
      features: ['Acabamento premium', 'Mordomo pessoal', 'Lounge exclusivo', 'Sala de reuniões'],
      price: 249000,
      services: ['Café da manhã incluso', 'Wi-Fi gratuito', 'Serviço de quarto', 'Salão de eventos']
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
                    <div className="absolute top-4 right-4">
                      <span 
                        className={`px-3 py-1 text-xs font-sora font-semibold ${
                          room.status === 'Disponível' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {room.status}
                      </span>
                    </div>
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
