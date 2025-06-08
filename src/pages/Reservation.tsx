
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { toast } from '@/hooks/use-toast';

const Reservation = () => {
  const [searchParams] = useSearchParams();
  const selectedSuite = searchParams.get('suite') || '';
  
  const [formData, setFormData] = useState({
    nomeCompleto: '',
    email: '',
    telefone: '',
    dataEntrada: '',
    dataSaida: '',
    numeroHospedes: '1',
    observacoes: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação básica
    if (!formData.nomeCompleto || !formData.email || !formData.telefone || !formData.dataEntrada || !formData.dataSaida) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    // Simular envio do pedido
    toast({
      title: "Pedido de reserva enviado!",
      description: "Entraremos em contato em até 24 horas para confirmar sua reserva.",
    });

    console.log('Pedido de reserva:', { ...formData, suite: selectedSuite });
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-20">
        <section className="py-16 bg-off-white">
          <div className="container mx-auto px-6 max-w-2xl">
            <div className="text-center mb-8">
              <h1 className="font-playfair text-4xl md:text-5xl font-bold text-charcoal mb-4">
                Finalize o seu Pedido de Reserva
              </h1>
              {selectedSuite && (
                <p className="font-inter text-xl text-stone-grey">
                  Você selecionou: <strong className="text-charcoal">{selectedSuite}</strong>
                </p>
              )}
            </div>
            
            <div className="bg-pure-white p-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="floating-label">
                  <input
                    type="text"
                    id="nomeCompleto"
                    name="nomeCompleto"
                    value={formData.nomeCompleto}
                    onChange={handleInputChange}
                    placeholder=" "
                    required
                  />
                  <label htmlFor="nomeCompleto">Nome Completo *</label>
                </div>

                <div className="floating-label">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder=" "
                    required
                  />
                  <label htmlFor="email">Email *</label>
                </div>

                <div className="floating-label">
                  <input
                    type="tel"
                    id="telefone"
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleInputChange}
                    placeholder=" "
                    required
                  />
                  <label htmlFor="telefone">Telefone *</label>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="floating-label">
                    <input
                      type="date"
                      id="dataEntrada"
                      name="dataEntrada"
                      value={formData.dataEntrada}
                      onChange={handleInputChange}
                      required
                    />
                    <label htmlFor="dataEntrada">Data de Entrada *</label>
                  </div>

                  <div className="floating-label">
                    <input
                      type="date"
                      id="dataSaida"
                      name="dataSaida"
                      value={formData.dataSaida}
                      onChange={handleInputChange}
                      required
                    />
                    <label htmlFor="dataSaida">Data de Saída *</label>
                  </div>
                </div>

                <div className="floating-label">
                  <select
                    id="numeroHospedes"
                    name="numeroHospedes"
                    value={formData.numeroHospedes}
                    onChange={handleInputChange}
                    className="w-full px-0 py-3 text-charcoal bg-transparent border-0 border-b border-stone-grey focus:border-charcoal focus:outline-none transition-colors duration-300"
                  >
                    <option value="1">1 Hóspede</option>
                    <option value="2">2 Hóspedes</option>
                    <option value="3">3 Hóspedes</option>
                    <option value="4">4 Hóspedes</option>
                    <option value="5">5+ Hóspedes</option>
                  </select>
                  <label htmlFor="numeroHospedes">Número de Hóspedes</label>
                </div>

                <div className="floating-label">
                  <textarea
                    id="observacoes"
                    name="observacoes"
                    value={formData.observacoes}
                    onChange={handleInputChange}
                    placeholder=" "
                    rows={4}
                    className="w-full px-0 py-3 text-charcoal bg-transparent border-0 border-b border-stone-grey focus:border-charcoal focus:outline-none transition-colors duration-300 resize-none"
                  />
                  <label htmlFor="observacoes">Observações Especiais</label>
                </div>

                <button
                  type="submit"
                  className="w-full bg-charcoal text-pure-white py-4 font-inter font-semibold text-lg hover:bg-opacity-90 transition-colors duration-300"
                >
                  Enviar Pedido
                </button>
              </form>
              
              <div className="mt-6 text-center">
                <p className="font-inter text-sm text-stone-grey">
                  * Campos obrigatórios<br />
                  Entraremos em contato em até 24 horas para confirmar sua reserva.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Reservation;
