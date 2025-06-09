const Footer = () => {
  return (
    <footer className="bg-charcoal text-pure-white">
      <div className="container mx-auto px-6 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <img src="/logo1.png" alt="Maspe Residencial Logo" className="h-12 w-auto lg:h-16 border-2 border-stone-grey rounded-md bg-white" />
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
              <p>Luanda</p>
              <p>Luanda, Angola</p>
              <p>+244 972463599</p>
              <p>Tel: (+244) 972463599</p>
              <p>contato@masperesidencial.ao</p>
            </div>
          </div>
          
          <div>
            <h4 className="font-inter font-semibold mb-4">Redes Sociais</h4>
            <div className="flex flex-col space-y-2">
              <a href="#" className="text-stone-grey hover:text-pure-white transition-colors duration-300">
                Instagram
              </a>
              <a href="#" className="text-stone-grey hover:text-pure-white transition-colors duration-300">
                Facebook
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-stone-grey mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-stone-grey text-sm text-left w-full md:w-auto md:text-left">
            © 2025 Maspe Residencial. Todos os direitos reservados.
          </p>
          <a
            href="https://petrohost.ao"
            target="_blank"
            rel="noopener noreferrer"
            className="text-stone-grey text-sm mt-2 md:mt-0 md:text-right hover:text-pure-white transition-colors duration-300"
            style={{ textDecoration: 'none' }}
          >
            Site desenvolvido pela Petrohost
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
