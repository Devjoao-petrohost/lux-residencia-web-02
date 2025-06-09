
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const About = () => {
  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-32">
        <section id="sobre" className="py-16 bg-off-white">
          <div className="container">
            <div className="text-center mb-16">
              <h1 className="font-sora text-5xl md:text-6xl font-bold text-charcoal mb-6">
                Sobre o Maspe Residencial
              </h1>
              <p className="font-sora text-xl text-stone-grey max-w-3xl mx-auto">
                Há mais de uma década, oferecemos uma experiência única de hospitalidade no coração de Luanda.
              </p>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-16 items-center mb-16">
              <div>
                <h2 className="font-sora text-3xl font-bold text-charcoal mb-6">
                  Nossa História
                </h2>
                <p className="font-sora text-stone-grey mb-6 leading-relaxed">
                  O Maspe Residencial nasceu da visão de criar um refúgio de excelência e conforto em Luanda. Combinamos a hospitalidade angolana com padrões internacionais de qualidade.
                </p>
                <p className="font-sora text-stone-grey mb-6 leading-relaxed">
                  Cada detalhe foi pensado para proporcionar uma experiência memorável, desde a arquitetura elegante até o atendimento personalizado que nos distingue.
                </p>
                <p className="font-sora text-stone-grey leading-relaxed">
                  Hoje, somos reconhecidos como uma das principais opções de hospedagem premium em Angola, atendendo tanto viajantes de negócios quanto turistas que buscam conforto e sofisticação.
                </p>
              </div>
              <div>
                <img 
                  src="/hero5.png"
                  alt="Interior elegante do Maspe Residencial"
                  className="w-full h-96 object-cover shadow-lg"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <div className="text-center">
                <div className="bg-charcoal text-pure-white w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="font-sora text-2xl font-bold">2+</span>
                </div>
                <h3 className="font-sora text-xl font-bold text-charcoal mb-2">Anos de Experiência</h3>
                <p className="font-sora text-stone-grey">Mais de uma década servindo com excelência</p>
              </div>
              
              <div className="text-center">
                <div className="bg-charcoal text-pure-white w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="font-sora text-2xl font-bold">16</span>
                </div>
                <h3 className="font-sora text-xl font-bold text-charcoal mb-2">Suítes Elegantes</h3>
                <p className="font-sora text-stone-grey">Acomodações projetadas para o seu conforto</p>
              </div>
              
              <div className="text-center">
                <div className="bg-charcoal text-pure-white w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="font-sora text-2xl font-bold">24/7</span>
                </div>
                <h3 className="font-sora text-xl font-bold text-charcoal mb-2">Atendimento</h3>
                <p className="font-sora text-stone-grey">Serviço disponível 24 horas por dia</p>
              </div>
            </div>

            <div className="bg-pure-white p-12 shadow-lg">
              <h2 className="font-sora text-3xl font-bold text-charcoal mb-8 text-center">
                Nossa Missão
              </h2>
              <p className="font-sora text-lg text-stone-grey text-center max-w-4xl mx-auto leading-relaxed">
                Proporcionar experiências inesquecíveis através da combinação perfeita entre conforto, elegância e hospitalidade genuína. 
                Acreditamos que cada hóspede merece um tratamento especial, e é isso que nos move a superar expectativas todos os dias.
              </p>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
