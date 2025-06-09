
import { Quote } from 'lucide-react';

const depoimentos = [
  {
    id: 1,
    texto: "A discrição, o conforto e o atendimento impecável fazem do Maspe Residencial a minha única escolha na cidade. Uma experiência de cinco estrelas.",
    autor: "Eng. Matias V.",
    cargo: "Diretor Executivo"
  },
  {
    id: 2,
    texto: "Desde a receção até ao último detalhe do quarto, tudo reflete a qualidade e sofisticação que esperamos. Recomendo vivamente.",
    autor: "Dra. Helena R.",
    cargo: "Empresária"
  }
];

const SecaoDepoimentos = () => {
  return (
    <section className="secao-depoimentos py-24 bg-off-white">
      <div className="container">
        <div className="texto-centro mb-16 animacao-fade-in">
          <h2 className="font-sora text-4xl md:text-5xl font-bold text-charcoal mb-6">
            O Que os Nossos Hóspedes Dizem
          </h2>
          <p className="font-sora text-lg text-stone-grey max-w-2xl mx-auto">
            A satisfação dos nossos hóspedes é o reflexo do nosso compromisso com a excelência.
          </p>
        </div>
        
        <div className="grade-depoimentos grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {depoimentos.map((depoimento, index) => (
            <div 
              key={depoimento.id} 
              className="card-depoimento bg-pure-white p-8 lg:p-10 shadow-lg hover:shadow-xl transition-all duration-300 animacao-fade-in"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="icone-aspas mb-6">
                <Quote className="w-12 h-12 text-stone-grey" />
              </div>
              
              <blockquote className="citacao mb-8">
                <p className="font-sora text-lg lg:text-xl text-charcoal leading-relaxed italic">
                  "{depoimento.texto}"
                </p>
              </blockquote>
              
              <div className="autor-info">
                <h4 className="font-sora text-lg font-bold text-charcoal mb-1">
                  {depoimento.autor}
                </h4>
                <p className="font-sora text-sm text-stone-grey">
                  {depoimento.cargo}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SecaoDepoimentos;
