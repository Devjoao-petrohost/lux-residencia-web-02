
import { Coffee, Wifi, BellRing, Calendar, Coffee as Cafeteria, UtensilsCrossed, Music, IceCream, Wine, Package } from 'lucide-react';

const features = [
  {
    icon: Coffee,
    title: "Café de manhã incluso",
    description: "Comece o dia com um café da manhã completo"
  },
  {
    icon: Wifi,
    title: "Wi-Fi gratuito",
    description: "Internet de alta velocidade em todas as áreas"
  },
  {
    icon: BellRing,
    title: "Serviço de quarto",
    description: "Atendimento 24 horas no seu quarto"
  },
  {
    icon: Calendar,
    title: "Salão de eventos",
    description: "Espaços elegantes para suas celebrações"
  },
  {
    icon: Cafeteria,
    title: "Cafetaria",
    description: "Bebidas quentes e frias a qualquer hora"
  },
  {
    icon: UtensilsCrossed,
    title: "Restaurante",
    description: "Culinária refinada com ingredientes selecionados"
  },
  {
    icon: Music,
    title: "Discoteca",
    description: "Entretenimento noturno em ambiente sofisticado"
  },
  {
    icon: IceCream,
    title: "Geladaria",
    description: "Sobremesas geladas artesanais"
  },
  {
    icon: Wine,
    title: "Bar",
    description: "Drinks exclusivos e vinhos selecionados"
  },
  {
    icon: Package,
    title: "Serviços de encomenda",
    description: "Delivery e serviços personalizados"
  }
];

const KeyFeatures = () => {
  return (
    <section className="py-24 bg-pure-white">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="font-sora text-4xl md:text-5xl font-bold text-charcoal mb-6">
            Serviços & Comodidades
          </h2>
          <p className="font-sora text-lg text-stone-grey max-w-2xl mx-auto">
            Uma experiência completa com todos os serviços que você precisa para uma estadia perfeita.
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="text-center group hover:transform hover:scale-105 transition-all duration-300"
            >
              <div className="bg-off-white p-6 mb-4 inline-flex items-center justify-center group-hover:bg-charcoal transition-colors duration-300">
                <feature.icon className="w-8 h-8 text-charcoal group-hover:text-pure-white transition-colors duration-300" />
              </div>
              <h3 className="font-sora text-sm font-semibold text-charcoal mb-2 group-hover:text-stone-grey transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="font-sora text-xs text-stone-grey leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default KeyFeatures;
