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
  },
  {
    id: 3,
    texto: "Ambiente acolhedor, funcionários atenciosos e uma localização excelente. Voltarei sempre que estiver em Luanda!",
    autor: "Sr. Paulo M.",
    cargo: "Consultor"
  },
  {
    id: 4,
    texto: "O café da manhã é delicioso e as suítes são muito confortáveis. Me senti em casa durante toda a estadia.",
    autor: "Sra. Juliana S.",
    cargo: "Professora"
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
        
        <div className="grade-depoimentos grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 lg:gap-8">
          {depoimentos.map((depoimento, index) => (
            <div 
              key={depoimento.id} 
              className="card-depoimento bg-pure-white p-5 lg:p-6 shadow-md hover:shadow-lg transition-all duration-300 animacao-fade-in rounded-none border-0"
              style={{ animationDelay: `${index * 0.15}s`, border: 'none' }}
            >
              <div className="icone-aspas mb-4">
                <Quote className="w-8 h-8 text-stone-grey" />
              </div>
              
              <blockquote className="citacao mb-6">
                <p className="font-sora text-base lg:text-lg text-charcoal leading-relaxed">
                  "{depoimento.texto}"
                </p>
              </blockquote>
              
              <div className="autor-info">
                <h4 className="font-sora text-base font-bold text-charcoal mb-0.5">
                  {depoimento.autor}
                </h4>
                <p className="font-sora text-xs text-stone-grey">
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
