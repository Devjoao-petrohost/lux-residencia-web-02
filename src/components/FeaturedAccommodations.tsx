
import { Link } from 'react-router-dom';

const accommodations = [
  {
    id: 1,
    name: 'Suíte Presidencial',
    image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    description: 'O ápice do luxo e conforto com serviços premium inclusos',
    capacity: 4,
    price: 299000,
    services: ['Café da manhã incluso', 'Wi-Fi gratuito', 'Serviço de quarto', 'Bar']
  },
  {
    id: 2,
    name: 'Suíte Executive',
    image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80',
    description: 'Elegância e funcionalidade para o viajante de negócios',
    capacity: 2,
    price: 199000,
    services: ['Café da manhã incluso', 'Wi-Fi gratuito', 'Salão de eventos']
  },
  {
    id: 3,
    name: 'Suíte Premium',
    image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=M3wxMJA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2126&q=80',
    description: 'Conforto sofisticado com vista privilegiada',
    capacity: 3,
    price: 149000,
    services: ['Café da manhã incluso', 'Wi-Fi gratuito', 'Cafetaria']
  },
  {
    id: 4,
    name: 'Suíte Classic',
    image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    description: 'Qualidade e bom gosto para estadias de lazer',
    capacity: 2,
    price: 99000,
    services: ['Café da manhã incluso', 'Wi-Fi gratuito', 'Bar']
  }
];

const FeaturedAccommodations = () => {
  return (
    <section className="secao-acomodacoes py-12 lg:py-24 bg-pure-white">
      <div className="container px-4 lg:px-6">
        <div className="texto-centro mb-8 lg:mb-16 animacao-fade-in">
          <h2 className="titulo-secao font-sora text-3xl md:text-4xl lg:text-5xl font-bold text-charcoal mb-4 lg:mb-6">
            Nossas Acomodações
          </h2>
          <p className="descricao-secao font-sora text-base lg:text-lg text-stone-grey max-w-2xl mx-auto">
            Cada suíte foi cuidadosamente projetada para oferecer uma experiência única de conforto e elegância.
          </p>
        </div>
        
        <div className="grade-acomodacoes grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-8 lg:mb-16">
          {accommodations.map((room, index) => (
            <div 
              key={room.id} 
              className="card-acomodacao group animacao-fade-in border border-stone-grey hover:shadow-lg transition-all duration-300"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="container-imagem">
                <img 
                  src={room.image}
                  alt={room.name}
                  className="imagem-quarto transition-transform duration-300 group-hover:scale-105 w-full h-48 lg:h-64 object-cover"
                />
                <div className="sobreposicao-imagem"></div>
              </div>
              <div className="conteudo-card p-4 lg:p-6">
                <h3 className="nome-quarto font-sora text-lg lg:text-xl font-bold text-charcoal mb-2 lg:mb-3">
                  {room.name}
                </h3>
                
                <div className="info-capacidade mb-3">
                  <span className="etiqueta-capacidade text-sm font-sora font-semibold text-charcoal bg-off-white px-2 py-1">
                    Capacidade: {room.capacity} pessoa{room.capacity > 1 ? 's' : ''}
                  </span>
                </div>
                
                <p className="descricao-quarto font-sora text-sm lg:text-base text-stone-grey mb-4">
                  {room.description}
                </p>
                
                <div className="info-preco flex justify-between items-center mb-4 lg:mb-6">
                  <span className="preco-quarto font-sora text-base lg:text-lg font-semibold text-charcoal">
                    {room.price.toLocaleString('pt-AO')} Kz/noite
                  </span>
                </div>
                
                <Link 
                  to={`/checkout?suite=${encodeURIComponent(room.name)}&id=${room.id}`}
                  className="botao-reservar btn-primary w-full text-center text-sm lg:text-base"
                >
                  Reservar Agora
                </Link>
              </div>
            </div>
          ))}
        </div>
        
        <div className="texto-centro animacao-fade-in">
          <Link 
            to="/acomodacoes"
            className="botao-ver-todas btn-secondary text-sm lg:text-base"
          >
            Ver Todas as Acomodações
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedAccommodations;
