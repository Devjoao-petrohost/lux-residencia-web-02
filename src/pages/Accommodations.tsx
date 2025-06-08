
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const accommodations = [
  {
    id: 1,
    name: 'Suíte Presidencial',
    image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    description: 'Nossa suíte mais luxuosa com vista panorâmica da cidade, sala de estar separada, banheiro com banheira de hidromassagem e serviço de mordomo 24h.',
    status: 'Disponível',
    features: ['120m²', 'Vista panorâmica', 'Banheira de hidromassagem', 'Serviço de mordomo']
  },
  {
    id: 2,
    name: 'Suíte Executive',
    image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80',
    description: 'Ideal para executivos, com escritório integrado, alta velocidade de internet e acesso ao business center.',
    status: 'Ocupado',
    features: ['80m²', 'Escritório integrado', 'Wi-Fi premium', 'Business center']
  },
  {
    id: 3,
    name: 'Suíte Premium',
    image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=M3wxMJA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2126&q=80',
    description: 'Combinação perfeita de conforto e elegância, com varanda privativa e amenidades de luxo.',
    status: 'Disponível',
    features: ['65m²', 'Varanda privativa', 'Amenidades premium', 'Room service 24h']
  },
  {
    id: 4,
    name: 'Suíte Classic',
    image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    description: 'Nosso quarto mais aconchegante, perfeito para estadias de lazer com todo o conforto necessário.',
    status: 'Disponível',
    features: ['45m²', 'Design aconchegante', 'Minibar premium', 'Concierge personalizado']
  },
  {
    id: 5,
    name: 'Suíte Garden',
    image: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    description: 'Suíte única com acesso direto ao jardim privativo, perfeita para quem busca tranquilidade.',
    status: 'Disponível',
    features: ['70m²', 'Jardim privativo', 'Terraço', 'Banheira externa']
  },
  {
    id: 6,
    name: 'Suíte Family',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    description: 'Ampla suíte familiar com dois quartos conectados, ideal para famílias que valorizam privacidade e conforto.',
    status: 'Ocupado',
    features: ['95m²', 'Dois quartos', 'Sala de estar', 'Cozinha compacta']
  }
];

const Accommodations = () => {
  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-20">
        <section className="py-16 bg-off-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h1 className="font-playfair text-5xl md:text-6xl font-bold text-charcoal mb-4">
                Nossas Acomodações
              </h1>
              <p className="font-inter text-xl text-stone-grey max-w-3xl mx-auto">
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
                        className={`px-3 py-1 text-xs font-inter font-semibold ${
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
                    <h3 className="font-playfair text-2xl font-bold text-charcoal mb-3">
                      {room.name}
                    </h3>
                    
                    <p className="font-inter text-stone-grey mb-4 leading-relaxed">
                      {room.description}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-2 mb-6">
                      {room.features.map((feature, index) => (
                        <span 
                          key={index}
                          className="text-xs font-inter text-charcoal bg-off-white px-2 py-1"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                    
                    <Link 
                      to={`/reserva?suite=${encodeURIComponent(room.name)}`}
                      className="block w-full bg-charcoal text-pure-white text-center py-3 font-inter font-semibold hover:bg-opacity-90 transition-colors duration-300"
                    >
                      Solicitar Reserva
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
