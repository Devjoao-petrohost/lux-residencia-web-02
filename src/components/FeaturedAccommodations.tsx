
import { Link } from 'react-router-dom';

const accommodations = [
  {
    id: 1,
    name: 'Suíte Presidencial',
    image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    description: 'O ápice do luxo e conforto'
  },
  {
    id: 2,
    name: 'Suíte Executive',
    image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80',
    description: 'Elegância e funcionalidade'
  },
  {
    id: 3,
    name: 'Suíte Premium',
    image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=M3wxMJA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2126&q=80',
    description: 'Conforto sofisticado'
  },
  {
    id: 4,
    name: 'Suíte Classic',
    image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    description: 'Qualidade e bom gosto'
  }
];

const FeaturedAccommodations = () => {
  return (
    <section className="py-20 bg-pure-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="font-playfair text-4xl md:text-5xl font-bold text-charcoal mb-4">
            Nossas Acomodações
          </h2>
          <p className="font-inter text-lg text-stone-grey max-w-2xl mx-auto">
            Cada suíte foi cuidadosamente projetada para oferecer uma experiência única de conforto e elegância.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {accommodations.map((room) => (
            <div key={room.id} className="group">
              <div className="relative overflow-hidden mb-4">
                <img 
                  src={room.image}
                  alt={room.name}
                  className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <h3 className="font-playfair text-xl font-bold text-charcoal mb-2">
                {room.name}
              </h3>
              <p className="font-inter text-stone-grey mb-4">
                {room.description}
              </p>
              <Link 
                to={`/reserva?suite=${encodeURIComponent(room.name)}`}
                className="inline-block bg-charcoal text-pure-white px-6 py-2 font-inter font-medium text-sm hover:bg-opacity-90 transition-colors duration-300"
              >
                Solicitar Reserva
              </Link>
            </div>
          ))}
        </div>
        
        <div className="text-center">
          <Link 
            to="/acomodacoes"
            className="inline-block border border-charcoal text-charcoal px-8 py-3 font-inter font-semibold hover:bg-charcoal hover:text-pure-white transition-all duration-300"
          >
            Ver Todas as Acomodações
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedAccommodations;
