
import { Link } from 'react-router-dom';

const accommodations = [
  {
    id: 1,
    name: 'Suíte Presidencial',
    image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    description: 'O ápice do luxo e conforto',
    price: 299000
  },
  {
    id: 2,
    name: 'Suíte Executive',
    image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80',
    description: 'Elegância e funcionalidade',
    price: 199000
  },
  {
    id: 3,
    name: 'Suíte Premium',
    image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=M3wxMJA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2126&q=80',
    description: 'Conforto sofisticado',
    price: 149000
  },
  {
    id: 4,
    name: 'Suíte Classic',
    image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    description: 'Qualidade e bom gosto',
    price: 99000
  }
];

const FeaturedAccommodations = () => {
  return (
    <section className="py-24 bg-pure-white">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="font-playfair text-4xl md:text-5xl font-bold text-charcoal mb-6">
            Nossas Acomodações
          </h2>
          <p className="font-sora text-lg text-stone-grey max-w-2xl mx-auto">
            Cada suíte foi cuidadosamente projetada para oferecer uma experiência única de conforto e elegância.
          </p>
        </div>
        
        <div className="grid-accommodations mb-16">
          {accommodations.map((room) => (
            <div key={room.id} className="accommodation-card group">
              <div className="image-container">
                <img 
                  src={room.image}
                  alt={room.name}
                  className="transition-transform duration-300 group-hover:scale-105"
                />
                <div className="image-overlay"></div>
              </div>
              <div className="accommodation-card-content">
                <h3 className="font-playfair text-xl font-bold text-charcoal mb-3">
                  {room.name}
                </h3>
                <p className="font-sora text-stone-grey mb-4">
                  {room.description}
                </p>
                <div className="flex justify-between items-center mb-6">
                  <span className="font-sora text-lg font-semibold text-charcoal">
                    {room.price.toLocaleString('pt-AO')} Kz/noite
                  </span>
                </div>
                <Link 
                  to={`/checkout?suite=${encodeURIComponent(room.name)}&id=${room.id}`}
                  className="btn-primary w-full text-center"
                >
                  Reservar Agora
                </Link>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center">
          <Link 
            to="/acomodacoes"
            className="btn-secondary"
          >
            Ver Todas as Acomodações
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedAccommodations;
