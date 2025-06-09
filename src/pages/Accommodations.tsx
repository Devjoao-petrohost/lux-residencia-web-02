
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
      description: 'Nossa suíte mais luxuosa com vista panorâmica da cidade, sala de estar separada, banheiro com banheira de hidromassagem e serviço de mordomo 24h.',
      status: 'Disponível',
      features: ['120m²', 'Vista panorâmica', 'Banheira de hidromassagem', 'Serviço de mordomo'],
      price: 299000
    },
    {
      id: 2,
      name: 'Suíte Executive Master',
      image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80',
      description: 'Ideal para executivos, com escritório integrado, alta velocidade de internet e acesso ao business center.',
      status: 'Ocupado',
      features: ['80m²', 'Escritório integrado', 'Wi-Fi premium', 'Business center'],
      price: 199000
    },
    {
      id: 3,
      name: 'Suíte Premium Ocean',
      image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=M3wxMJA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2126&q=80',
      description: 'Combinação perfeita de conforto e elegância, com varanda privativa e amenidades de luxo.',
      status: 'Disponível',
      features: ['65m²', 'Varanda privativa', 'Amenidades premium', 'Room service 24h'],
      price: 149000
    },
    {
      id: 4,
      name: 'Suíte Classic Comfort',
      image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      description: 'Nosso quarto mais aconchegante, perfeito para estadias de lazer com todo o conforto necessário.',
      status: 'Disponível',
      features: ['45m²', 'Design aconchegante', 'Minibar premium', 'Concierge personalizado'],
      price: 99000
    },
    {
      id: 5,
      name: 'Suíte Garden Paradise',
      image: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      description: 'Suíte única com acesso direto ao jardim privativo, perfeita para quem busca tranquilidade.',
      status: 'Disponível',
      features: ['70m²', 'Jardim privativo', 'Terraço', 'Banheira externa'],
      price: 174000
    },
    {
      id: 6,
      name: 'Suíte Family Supreme',
      image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      description: 'Ampla suíte familiar com dois quartos conectados, ideal para famílias que valorizam privacidade e conforto.',
      status: 'Ocupado',
      features: ['95m²', 'Dois quartos', 'Sala de estar', 'Cozinha compacta'],
      price: 224000
    },
    {
      id: 7,
      name: 'Suíte Business Elite',
      image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      description: 'Projetada para o viajante de negócios moderno, com todas as facilidades necessárias para produtividade.',
      status: 'Disponível',
      features: ['75m²', 'Mesa executiva', 'Internet dedicada', 'Impressora'],
      price: 189000
    },
    {
      id: 8,
      name: 'Suíte Romantic Sunset',
      image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=M3wxMJA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2126&q=80',
      description: 'Ambiente perfeito para casais, com decoração romântica e vista privilegiada do pôr do sol.',
      status: 'Disponível',
      features: ['60m²', 'Vista oeste', 'Decoração romântica', 'Banheira dupla'],
      price: 159000
    },
    {
      id: 9,
      name: 'Suíte Urban Style',
      image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80',
      description: 'Design moderno e urbano, ideal para hóspedes que apreciam estilo contemporâneo.',
      status: 'Disponível',
      features: ['55m²', 'Design contemporâneo', 'Smart TV', 'Sistema de som'],
      price: 129000
    },
    {
      id: 10,
      name: 'Suíte Comfort Plus',
      image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      description: 'Conforto elevado com todas as comodidades essenciais para uma estadia perfeita.',
      status: 'Ocupado',
      features: ['50m²', 'Cama king size', 'Frigobar', 'Cofre digital'],
      price: 109000
    },
    {
      id: 11,
      name: 'Suíte Wellness Spa',
      image: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      description: 'Focada no bem-estar, com spa privado e amenidades de relaxamento.',
      status: 'Disponível',
      features: ['85m²', 'Spa privado', 'Sauna', 'Produtos orgânicos'],
      price: 209000
    },
    {
      id: 12,
      name: 'Suíte Cultural Heritage',
      image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      description: 'Decoração inspirada na cultura angolana, celebrando a rica herança local.',
      status: 'Disponível',
      features: ['70m²', 'Arte local', 'Mobiliário artesanal', 'Biblioteca'],
      price: 169000
    },
    {
      id: 13,
      name: 'Suíte Technology Hub',
      image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      description: 'Equipada com a mais moderna tecnologia para o hóspede conectado.',
      status: 'Disponível',
      features: ['65m²', 'Casa inteligente', 'Múltiplas telas', 'Carregamento wireless'],
      price: 179000
    },
    {
      id: 14,
      name: 'Suíte Artistic Loft',
      image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=M3wxMJA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2126&q=80',
      description: 'Ambiente criativo com pé-direito alto e decoração artística única.',
      status: 'Disponível',
      features: ['90m²', 'Pé-direito alto', 'Obras de arte', 'Espaço criativo'],
      price: 199000
    },
    {
      id: 15,
      name: 'Suíte Penthouse Vista',
      image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80',
      description: 'Localizada no último andar, oferece vista 360° da cidade de Luanda.',
      status: 'Disponível',
      features: ['110m²', 'Vista 360°', 'Terraço privativo', 'Bar privado'],
      price: 269000
    },
    {
      id: 16,
      name: 'Suíte Executive Platinum',
      image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      description: 'O máximo em luxo executivo, com serviços premium e acabamentos de primeira classe.',
      status: 'Disponível',
      features: ['100m²', 'Acabamento premium', 'Mordomo pessoal', 'Lounge exclusivo'],
      price: 249000
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
      
      <main className="pt-20">
        <section className="py-16 bg-off-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h1 className="font-sora text-5xl md:text-6xl font-bold text-charcoal mb-4">
                Nossas Acomodações
              </h1>
              <p className="font-sora text-xl text-stone-grey max-w-3xl mx-auto">
                Cada suíte do Maspe Residencial foi meticulosamente projetada para oferecer uma experiência única de conforto, elegância e funcionalidade.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {accommodations.map((room) => (
                <div key={room.id} className="bg-pure-white overflow-hidden group hover:shadow-lg transition-shadow duration-300">
                  <div className="relative overflow-hidden">
                    <img 
                      src={room.image}
                      alt={room.name}
                      className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
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
                  
                  <div className="p-6">
                    <h3 className="font-sora text-2xl font-bold text-charcoal mb-3">
                      {room.name}
                    </h3>
                    
                    <p className="font-sora text-stone-grey mb-4 leading-relaxed">
                      {room.description}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      {room.features.map((feature, index) => (
                        <span 
                          key={index}
                          className="text-xs font-sora text-charcoal bg-off-white px-2 py-1"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                    
                    <div className="mb-6">
                      <span className="font-sora text-lg font-semibold text-charcoal">
                        {room.price.toLocaleString('pt-AO')} Kz/noite
                      </span>
                    </div>
                    
                    <Link 
                      to={`/checkout?suite=${encodeURIComponent(room.name)}&id=${room.id}`}
                      className="block w-full bg-charcoal text-pure-white text-center py-3 font-sora font-semibold hover:bg-opacity-90 transition-colors duration-300"
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
