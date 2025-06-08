
const Footer = () => {
  return (
    <footer className="bg-charcoal text-pure-white">
      <div className="container mx-auto px-6 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-playfair text-xl font-bold mb-4">Maspe Residencial</h3>
            <p className="text-stone-grey font-inter text-sm">
              Sofisticação que Acolhe
            </p>
          </div>
          
          <div>
            <h4 className="font-inter font-semibold mb-4">Navegação</h4>
            <ul className="space-y-2">
              <li><a href="/" className="text-stone-grey hover:text-pure-white transition-colors duration-300">Início</a></li>
              <li><a href="#sobre" className="text-stone-grey hover:text-pure-white transition-colors duration-300">Sobre</a></li>
              <li><a href="/acomodacoes" className="text-stone-grey hover:text-pure-white transition-colors duration-300">Acomodações</a></li>
              <li><a href="#servicos" className="text-stone-grey hover:text-pure-white transition-colors duration-300">Serviços</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-inter font-semibold mb-4">Contato</h4>
            <div className="space-y-2 text-stone-grey text-sm">
              <p>Rua das Flores, 123</p>
              <p>Centro, São Paulo - SP</p>
              <p>CEP: 01234-567</p>
              <p>Tel: (11) 1234-5678</p>
              <p>contato@masperesidencial.com</p>
            </div>
          </div>
          
          <div>
            <h4 className="font-inter font-semibold mb-4">Redes Sociais</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-stone-grey hover:text-pure-white transition-colors duration-300">
                Instagram
              </a>
              <a href="#" className="text-stone-grey hover:text-pure-white transition-colors duration-300">
                Facebook
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-stone-grey mt-8 pt-8 text-center">
          <p className="text-stone-grey text-sm">
            © 2024 Maspe Residencial. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
