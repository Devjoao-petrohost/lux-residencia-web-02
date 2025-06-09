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
    bi: '',
    endereco: '',
    cidade: '',
    dataEntrada: '',
    dataSaida: '',
    numeroPessoas: '1',
    observacoes: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Get room prices from localStorage or default
  const getRoomPrices = () => {
    const rooms = JSON.parse(localStorage.getItem('maspe_rooms') || '[]');
    const roomPrices: { [key: string]: number } = {};
    
    rooms.forEach((room: any) => {
      roomPrices[room.name] = room.price;
    });
    
    // Preços padrão iguais ao Accommodations.tsx
    if (rooms.length === 0) {
      return {
        'Suíte Simples': 79000,
        'Suíte Standard': 89000,
        'Suíte Conforto': 99000,
        'Suíte Luxo': 129000,
        'Suíte Premium': 149000,
        'Suíte Master': 179000,
        'Suíte Familiar': 199000,
        'Suíte Executiva': 189000,
        'Suíte Romântica': 159000,
        'Suíte Terraço': 174000,
        'Suíte Spa': 209000,
        'Suíte Cultural': 169000,
        'Suíte Moderna': 179000,
        'Suíte Artística': 199000,
        'Suíte Cobertura': 269000,
        'Suíte Platina': 249000
      };
    }
    
    return roomPrices;
  };

  const roomPrices = getRoomPrices();
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
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const processPayment = async () => {
    setIsProcessing(true);
    
    // Simulação de processamento de pagamento
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Gerar ID de transação simulado
    const transactionId = 'TXN_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    const referenceNumber = 'REF_' + Math.random().toString(36).substr(2, 9).toUpperCase();
    
    // Salvar reserva no localStorage (simulando base de dados)
    const booking = {
      id: Date.now().toString(),
      transactionId,
      referenceNumber,
      guest: { ...formData },
      suite: selectedSuite,
      suiteId,
      pricePerNight,
      nights: calculateNights(),
      totalAmount,
      paymentMethod,
      paymentStatus: 'pending',
      bookingDate: new Date().toISOString(),
      status: 'pending_payment'
    };

    const existingBookings = JSON.parse(localStorage.getItem('maspe_bookings') || '[]');
    existingBookings.push(booking);
    localStorage.setItem('maspe_bookings', JSON.stringify(existingBookings));

    setIsProcessing(false);
    
    // Redirecionar para página de confirmação
    navigate(`/confirmacao?transaction=${transactionId}&method=${paymentMethod}&reference=${referenceNumber}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação básica
    if (!formData.nomeCompleto || !formData.email || !formData.telefone || !formData.bi || !formData.dataEntrada || !formData.dataSaida) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    if (!paymentMethod) {
      toast({
        title: "Método de pagamento",
        description: "Por favor, selecione um método de pagamento.",
        variant: "destructive"
      });
      return;
    }

    processPayment();
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-24 lg:pt-32">
        <section className="py-8 lg:py-16 bg-off-white">
          <div className="container max-w-6xl px-4 lg:px-6">
            <div className="text-center mb-8 lg:mb-12">
              <h1 className="font-sora text-3xl md:text-4xl lg:text-5xl font-bold text-charcoal mb-4 lg:mb-6">
                Checkout - Finalizar Reserva
              </h1>
              {selectedSuite && (
                <p className="font-sora text-lg lg:text-xl text-stone-grey">
                  Você selecionou: <strong className="text-charcoal">{selectedSuite}</strong>
                </p>
              )}
            </div>
            
            <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
              {/* Formulário Principal */}
              <div className="lg:col-span-2 bg-pure-white p-6 lg:p-8 shadow-lg">
                <form onSubmit={handleSubmit} className="checkout-form">
                  <div className="form-section">
                    <h2>Dados do Hóspede</h2>
                    
                    <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
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
                          id="bi"
                          name="bi"
                          value={formData.bi}
                          onChange={handleInputChange}
                          placeholder=" "
                          required
                        />
                        <label htmlFor="bi">Nº do BI *</label>
                      </div>

                      <div className="floating-label md:col-span-2">
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
                    </div>
                  </div>

                  <div className="form-section">
                    <h2>Detalhes da Reserva</h2>
                    
                    <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
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
                          id="numeroPessoas"
                          name="numeroPessoas"
                          value={formData.numeroPessoas}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="1">1 Pessoa</option>
                          <option value="2">2 Pessoas</option>
                          <option value="3">3 Pessoas</option>
                          <option value="4">4 Pessoas</option>
                          <option value="5">5 Pessoas</option>
                          <option value="6">6+ Pessoas</option>
                        </select>
                        <label htmlFor="numeroPessoas">Número de Pessoas *</label>
                      </div>
                    </div>
                  </div>

                  <div className="form-section">
                    <h2>Método de Pagamento</h2>
                    
                    <div className="space-y-4">
                      <div 
                        className={`payment-method ${paymentMethod === 'transferencia' ? 'selected' : ''}`}
                        onClick={() => setPaymentMethod('transferencia')}
                      >
                        <div className="flex items-center">
                          <input
                            type="radio"
                            id="transferencia"
                            name="paymentMethod"
                            value="transferencia"
                            checked={paymentMethod === 'transferencia'}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="mr-3"
                          />
                          <div>
                            <h4 className="font-sora font-semibold text-charcoal">Transferência Bancária</h4>
                            <p className="font-sora text-sm text-stone-grey">Transfira diretamente para nossa conta bancária</p>
                          </div>
                        </div>
                      </div>

                      <div 
                        className={`payment-method ${paymentMethod === 'multicaixa' ? 'selected' : ''}`}
                        onClick={() => setPaymentMethod('multicaixa')}
                      >
                        <div className="flex items-center">
                          <input
                            type="radio"
                            id="multicaixa"
                            name="paymentMethod"
                            value="multicaixa"
                            checked={paymentMethod === 'multicaixa'}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="mr-3"
                          />
                          <div>
                            <h4 className="font-sora font-semibold text-charcoal">Pagamento por Referência (Multicaixa Express)</h4>
                            <p className="font-sora text-sm text-stone-grey">Pague usando uma referência no Multicaixa Express</p>
                          </div>
                        </div>
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
                    className="btn-primary w-full py-3 lg:py-4 text-base lg:text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? 'Processando Reserva...' : `Confirmar Reserva - ${totalAmount.toLocaleString('pt-AO')} Kz`}
                  </button>
                </form>
              </div>

              {/* Resumo da Reserva */}
              <div className="bg-pure-white p-6 lg:p-8 h-fit shadow-lg">
                <h3 className="font-sora text-xl lg:text-2xl font-bold text-charcoal mb-4 lg:mb-6">
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
                    <span className="text-stone-grey">Pessoas:</span>
                    <span className="text-charcoal">{formData.numeroPessoas}</span>
                  </div>
                  
                  <div className="flex justify-between font-bold text-lg lg:text-xl pt-4">
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
