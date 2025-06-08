
const AboutSection = () => {
  return (
    <section id="sobre" className="py-20 bg-off-white">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="font-playfair text-4xl md:text-5xl font-bold text-charcoal leading-tight">
              Excelência em Cada Detalhe
            </h2>
            <p className="font-inter text-lg text-charcoal leading-relaxed">
              No Maspe Residencial, acreditamos que a verdadeira hospitalidade reside na atenção aos detalhes e no cuidado personalizado. Cada hóspede é único, e nossa missão é proporcionar uma experiência que supere expectativas.
            </p>
            <p className="font-inter text-lg text-charcoal leading-relaxed">
              Nossa equipe dedicada trabalha incansavelmente para garantir que sua estadia seja não apenas confortável, mas memorável. Desde o momento da chegada até a despedida, cada interação é cuidadosamente planejada para refletir nossos valores de excelência e discrição.
            </p>
          </div>
          
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
              alt="Membro da equipe Maspe Residencial"
              className="w-full h-96 object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
