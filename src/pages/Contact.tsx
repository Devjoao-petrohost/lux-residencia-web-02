
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

const Contact = () => {
  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-32">
        <section id="contato" className="py-16 bg-off-white">
          <div className="container">
            <div className="text-center mb-16">
              <h1 className="font-sora text-5xl md:text-6xl font-bold text-charcoal mb-6">
                Entre em Contato
              </h1>
              <p className="font-sora text-xl text-stone-grey max-w-3xl mx-auto">
                Estamos aqui para ajudar e responder a todas as suas questões. Entre em contato conosco.
              </p>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-16">
              <div>
                <h2 className="font-sora text-3xl font-bold text-charcoal mb-8">
                  Informações de Contato
                </h2>
                
                <div className="space-y-8">
                  <div className="flex items-start space-x-4">
                    <div className="bg-charcoal p-3">
                      <MapPin className="w-6 h-6 text-pure-white" />
                    </div>
                    <div>
                      <h3 className="font-sora text-lg font-bold text-charcoal mb-2">Endereço</h3>
                      <p className="font-sora text-stone-grey">
                        Rua Amílcar Cabral, 123<br />
                        Maianga, Luanda<br />
                        Angola
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="bg-charcoal p-3">
                      <Phone className="w-6 h-6 text-pure-white" />
                    </div>
                    <div>
                      <h3 className="font-sora text-lg font-bold text-charcoal mb-2">Telefones</h3>
                      <p className="font-sora text-stone-grey">
                        +244 222 123 456<br />
                        +244 923 456 789
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="bg-charcoal p-3">
                      <Mail className="w-6 h-6 text-pure-white" />
                    </div>
                    <div>
                      <h3 className="font-sora text-lg font-bold text-charcoal mb-2">Email</h3>
                      <p className="font-sora text-stone-grey">
                        reservas@masperesidencial.ao<br />
                        info@masperesidencial.ao
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="bg-charcoal p-3">
                      <Clock className="w-6 h-6 text-pure-white" />
                    </div>
                    <div>
                      <h3 className="font-sora text-lg font-bold text-charcoal mb-2">Horário de Atendimento</h3>
                      <p className="font-sora text-stone-grey">
                        Recepção: 24 horas<br />
                        Administração: 08:00 - 18:00
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-pure-white p-8 shadow-lg">
                <h2 className="font-sora text-3xl font-bold text-charcoal mb-8">
                  Envie uma Mensagem
                </h2>
                
                <form className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="floating-label">
                      <input
                        type="text"
                        id="nome"
                        name="nome"
                        placeholder=" "
                        required
                      />
                      <label htmlFor="nome">Nome Completo *</label>
                    </div>
                    
                    <div className="floating-label">
                      <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder=" "
                        required
                      />
                      <label htmlFor="email">Email *</label>
                    </div>
                  </div>
                  
                  <div className="floating-label">
                    <input
                      type="tel"
                      id="telefone"
                      name="telefone"
                      placeholder=" "
                    />
                    <label htmlFor="telefone">Telefone</label>
                  </div>
                  
                  <div className="floating-label">
                    <input
                      type="text"
                      id="assunto"
                      name="assunto"
                      placeholder=" "
                      required
                    />
                    <label htmlFor="assunto">Assunto *</label>
                  </div>
                  
                  <div className="floating-label">
                    <textarea
                      id="mensagem"
                      name="mensagem"
                      placeholder=" "
                      rows={6}
                      required
                    />
                    <label htmlFor="mensagem">Mensagem *</label>
                  </div>
                  
                  <button
                    type="submit"
                    className="btn-primary w-full py-4"
                  >
                    Enviar Mensagem
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Contact;
