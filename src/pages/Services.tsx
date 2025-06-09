
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Coffee, Wifi, BellRing, Calendar, UtensilsCrossed, Music, IceCream, Wine, Package, Car } from 'lucide-react';

const services = [
  {
    icon: Coffee,
    title: "Café da Manhã Incluso",
    description: "Comece o dia com um café da manhã completo e variado, preparado com ingredientes frescos e locais.",
    details: ["Buffet completo", "Opções continentais", "Frutas tropicais", "Café angolano premium"]
  },
  {
    icon: Wifi,
    title: "Wi-Fi Gratuito",
    description: "Internet de alta velocidade disponível em todas as áreas do hotel, ideal para trabalho e lazer.",
    details: ["Conexão de alta velocidade", "Cobertura total", "Acesso ilimitado", "Suporte técnico 24h"]
  },
  {
    icon: BellRing,
    title: "Serviço de Quarto",
    description: "Atendimento personalizado 24 horas para garantir o máximo conforto durante sua estadia.",
    details: ["Disponível 24/7", "Menu completo", "Entrega rápida", "Serviço personalizado"]
  },
  {
    icon: Calendar,
    title: "Salão de Eventos",
    description: "Espaços elegantes e versáteis para suas celebrações, reuniões e eventos corporativos.",
    details: ["Capacidade para 200 pessoas", "Equipamentos audiovisuais", "Decoração personalizada", "Catering incluso"]
  },
  {
    icon: UtensilsCrossed,
    title: "Restaurante Gourmet",
    description: "Culinária refinada que combina sabores internacionais com especialidades angolanas.",
    details: ["Chef internacional", "Ingredientes premium", "Carta de vinhos", "Ambiente sofisticado"]
  },
  {
    icon: Music,
    title: "Discoteca",
    description: "Entretenimento noturno em ambiente sofisticado com música selecionada e drinks especiais.",
    details: ["DJ residente", "Sistema de som profissional", "Pista de dança", "Drinks exclusivos"]
  },
  {
    icon: IceCream,
    title: "Geladaria Artesanal",
    description: "Sobremesas geladas artesanais preparadas diariamente com receitas exclusivas.",
    details: ["Sabores únicos", "Receitas artesanais", "Ingredientes naturais", "Preparo diário"]
  },
  {
    icon: Wine,
    title: "Bar Premium",
    description: "Drinks exclusivos e vinhos cuidadosamente selecionados em ambiente acolhedor.",
    details: ["Carta de vinhos premium", "Cocktails autorais", "Ambiente acolhedor", "Mixologista profissional"]
  },
  {
    icon: Package,
    title: "Serviços de Encomenda",
    description: "Delivery personalizado e serviços especiais para atender suas necessidades específicas.",
    details: ["Delivery 24h", "Compras personalizadas", "Serviços especiais", "Entrega rápida"]
  },
  {
    icon: Car,
    title: "Transfer e Transporte",
    description: "Serviço de transfer do aeroporto e transporte personalizado pela cidade.",
    details: ["Transfer aeroporto", "Veículos executivos", "Motoristas experientes", "Disponível 24h"]
  }
];

const Services = () => {
  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-32">
        <section id="servicos" className="py-16 bg-off-white">
          <div className="container">
            <div className="text-center mb-16">
              <h1 className="font-sora text-5xl md:text-6xl font-bold text-charcoal mb-6">
                Nossos Serviços
              </h1>
              <p className="font-sora text-xl text-stone-grey max-w-3xl mx-auto">
                Uma gama completa de serviços pensados para tornar sua estadia uma experiência inesquecível.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-12">
              {services.map((service, index) => (
                <div key={index} className="bg-pure-white p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="flex items-start space-x-6">
                    <div className="bg-charcoal p-4 flex-shrink-0">
                      <service.icon className="w-8 h-8 text-pure-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-sora text-2xl font-bold text-charcoal mb-4">
                        {service.title}
                      </h3>
                      <p className="font-sora text-stone-grey mb-6 leading-relaxed">
                        {service.description}
                      </p>
                      <ul className="space-y-2">
                        {service.details.map((detail, detailIndex) => (
                          <li key={detailIndex} className="font-sora text-sm text-charcoal flex items-center">
                            <span className="w-2 h-2 bg-charcoal mr-3 flex-shrink-0"></span>
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </div>
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

export default Services;
