import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { toast } from '@/hooks/use-toast';

const Checkout = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const selectedSuite = searchParams.get('suite') || '';
  const suiteId = searchParams.get('id') || '';
  
  const [formData, setFormData] = useState({
    nomeCompleto: '',
    email: '',
    telefone: '',
    endereco: '',
    cidade: '',
    cep: '',
    dataEntrada: '',
    dataSaida: '',
    numeroHospedes: '1',
    observacoes: ''
  });

  const [paymentData, setPaymentData] = useState({
    numeroCartao: '',
    nomeCartao: '',
    validadeCartao: '',
    cvv: ''
  });

  const [isProcessing, setIsProcessing] = useState(false);

  // Preços simulados por quarto em Kwanza
  const roomPrices: { [key: string]: number } = {
    'Suíte Presidencial': 299000,
    'Suíte Executive': 199000,
    'Suíte Premium': 149000,
    'Suíte Classic': 99000,
    'Suíte Garden': 174000,
    'Suíte Family': 224000
  };

  const pricePerNight = roomPrices[selectedSuite] || 149000;

  const calculateNights = () => {
    if (formData.dataEntrada && formData.dataSaida) {
      const entrada = new Date(formData.dataEntrada);
      const saida = new Date(formData.dataSaida);
      const diffTime = Math.abs(saida.getTime() - entrada.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? diffDays : 1;
    }
    return 1;
  };

  const totalAmount = pricePerNight * calculateNights();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('payment_')) {
      const paymentField = name.replace('payment_', '');
      setPaymentData(prev => ({ ...prev, [paymentField]: value }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const processPayment = async () => {
    setIsProcessing(true);
    
    // Simulação de processamento de pagamento
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Gerar ID de transação simulado
    const transactionId = 'TXN_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    
    // Salvar reserva no localStorage (simulando base de dados)
    const booking = {
      id: Date.now().toString(),
      transactionId,
      guest: { ...formData },
      suite: selectedSuite,
      suiteId,
      pricePerNight,
      nights: calculateNights(),
      totalAmount,
      paymentStatus: 'paid',
      bookingDate: new Date().toISOString(),
      status: 'confirmed'
    };

    const existingBookings = JSON.parse(localStorage.getItem('maspe_bookings') || '[]');
    existingBookings.push(booking);
    localStorage.setItem('maspe_bookings', JSON.stringify(existingBookings));

    setIsProcessing(false);
    
    // Redirecionar para página de confirmação
    navigate(`/confirmacao?transaction=${transactionId}`);
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

    if (!paymentData.numeroCartao || !paymentData.nomeCartao || !paymentData.validadeCartao || !paymentData.cvv) {
      toast({
        title: "Dados de pagamento incompletos",
        description: "Por favor, preencha todos os dados do cartão.",
        variant: "destructive"
      });
      return;
    }

    processPayment();
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-32">
        <section className="py-16 bg-off-white">
          <div className="container max-w-6xl">
            <div className="text-center mb-12">
              <h1 className="font-playfair text-4xl md:text-5xl font-bold text-charcoal mb-6">
                Checkout - Finalizar Reserva
              </h1>
              {selectedSuite && (
                <p className="font-sora text-xl text-stone-grey">
                  Você selecionou: <strong className="text-charcoal">{selectedSuite}</strong>
                </p>
              )}
            </div>
            
            <div className="grid lg:grid-cols-3 gap-12">
              {/* Formulário Principal */}
              <div className="lg:col-span-2 bg-pure-white p-8 shadow-lg">
                <form onSubmit={handleSubmit} className="checkout-form">
                  <div className="form-section">
                    <h2>Dados do Hóspede</h2>
                    
                    <div className="grid md:grid-cols-2 gap-8">
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

                      <div className="floating-label">
                        <input
                          type="text"
                          id="endereco"
                          name="endereco"
                          value={formData.endereco}
                          onChange={handleInputChange}
                          placeholder=" "
                        />
                        <label htmlFor="endereco">Endereço</label>
                      </div>

                      <div className="floating-label">
                        <input
                          type="text"
                          id="cidade"
                          name="cidade"
                          value={formData.cidade}
                          onChange={handleInputChange}
                          placeholder=" "
                        />
                        <label htmlFor="cidade">Cidade</label>
                      </div>

                      <div className="floating-label">
                        <input
                          type="text"
                          id="cep"
                          name="cep"
                          value={formData.cep}
                          onChange={handleInputChange}
                          placeholder=" "
                        />
                        <label htmlFor="cep">CEP</label>
                      </div>
                    </div>
                  </div>

                  <div className="form-section">
                    <h2>Detalhes da Reserva</h2>
                    
                    <div className="grid md:grid-cols-3 gap-8">
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

                      <div className="floating-label">
                        <select
                          id="numeroHospedes"
                          name="numeroHospedes"
                          value={formData.numeroHospedes}
                          onChange={handleInputChange}
                        >
                          <option value="1">1 Hóspede</option>
                          <option value="2">2 Hóspedes</option>
                          <option value="3">3 Hóspedes</option>
                          <option value="4">4 Hóspedes</option>
                          <option value="5">5+ Hóspedes</option>
                        </select>
                        <label htmlFor="numeroHospedes">Número de Hóspedes</label>
                      </div>
                    </div>
                  </div>

                  <div className="form-section">
                    <h2>Dados de Pagamento</h2>
                    
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="md:col-span-2 floating-label">
                        <input
                          type="text"
                          id="numeroCartao"
                          name="payment_numeroCartao"
                          value={paymentData.numeroCartao}
                          onChange={handleInputChange}
                          placeholder="1234 5678 9012 3456"
                          maxLength={19}
                          required
                        />
                        <label htmlFor="numeroCartao">Número do Cartão *</label>
                      </div>

                      <div className="floating-label">
                        <input
                          type="text"
                          id="nomeCartao"
                          name="payment_nomeCartao"
                          value={paymentData.nomeCartao}
                          onChange={handleInputChange}
                          placeholder=" "
                          required
                        />
                        <label htmlFor="nomeCartao">Nome no Cartão *</label>
                      </div>

                      <div className="floating-label">
                        <input
                          type="text"
                          id="validadeCartao"
                          name="payment_validadeCartao"
                          value={paymentData.validadeCartao}
                          onChange={handleInputChange}
                          placeholder="MM/AA"
                          maxLength={5}
                          required
                        />
                        <label htmlFor="validadeCartao">Validade *</label>
                      </div>

                      <div className="floating-label">
                        <input
                          type="text"
                          id="cvv"
                          name="payment_cvv"
                          value={paymentData.cvv}
                          onChange={handleInputChange}
                          placeholder="123"
                          maxLength={4}
                          required
                        />
                        <label htmlFor="cvv">CVV *</label>
                      </div>
                    </div>
                  </div>

                  <div className="floating-label">
                    <textarea
                      id="observacoes"
                      name="observacoes"
                      value={formData.observacoes}
                      onChange={handleInputChange}
                      placeholder=" "
                      rows={4}
                    />
                    <label htmlFor="observacoes">Observações Especiais</label>
                  </div>

                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="btn-primary w-full py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? 'Processando Pagamento...' : `Pagar ${totalAmount.toLocaleString('pt-AO')} Kz`}
                  </button>
                </form>
              </div>

              {/* Resumo da Reserva */}
              <div className="bg-pure-white p-8 h-fit shadow-lg">
                <h3 className="font-playfair text-2xl font-bold text-charcoal mb-6">
                  Resumo da Reserva
                </h3>
                
                <div className="space-y-4 font-sora">
                  <div className="flex justify-between border-b border-stone-grey pb-2">
                    <span className="text-stone-grey">Suíte:</span>
                    <span className="text-charcoal font-medium">{selectedSuite}</span>
                  </div>
                  
                  <div className="flex justify-between border-b border-stone-grey pb-2">
                    <span className="text-stone-grey">Preço por noite:</span>
                    <span className="text-charcoal">{pricePerNight.toLocaleString('pt-AO')} Kz</span>
                  </div>
                  
                  <div className="flex justify-between border-b border-stone-grey pb-2">
                    <span className="text-stone-grey">Número de noites:</span>
                    <span className="text-charcoal">{calculateNights()}</span>
                  </div>
                  
                  <div className="flex justify-between border-b border-stone-grey pb-2">
                    <span className="text-stone-grey">Hóspedes:</span>
                    <span className="text-charcoal">{formData.numeroHospedes}</span>
                  </div>
                  
                  <div className="flex justify-between font-bold text-xl pt-4">
                    <span className="text-charcoal">Total:</span>
                    <span className="text-charcoal">{totalAmount.toLocaleString('pt-AO')} Kz</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Checkout;
