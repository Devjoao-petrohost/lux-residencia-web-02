
import { useState } from 'react';
import { Calendar, User, CreditCard, Printer, Eye, X } from 'lucide-react';
import { useQuartosHotel } from '@/hooks/useQuartosHotel';
import { useReservasHotel } from '@/hooks/useReservasHotel';
import { toast } from '@/hooks/use-toast';
import type { QuartoHotel, ReservaHotel } from '@/lib/supabase';

interface ReservaPresencialFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function ReservaPresencialForm({ onClose, onSuccess }: ReservaPresencialFormProps) {
  const { quartos } = useQuartosHotel();
  const { criarReserva } = useReservasHotel();
  
  const [step, setStep] = useState<'quarto' | 'dados' | 'pagamento' | 'fatura'>('quarto');
  const [selectedQuarto, setSelectedQuarto] = useState<QuartoHotel | null>(null);
  const [dadosCliente, setDadosCliente] = useState({
    nome_hospede: '',
    documento_hospede: '',
    telefone_hospede: '',
    email_hospede: '',
    data_checkin: '',
    data_checkout: '',
    numero_pessoas: 1,
    observacoes: ''
  });
  const [metodoPagamento, setMetodoPagamento] = useState('');
  const [reservaCriada, setReservaCriada] = useState<ReservaHotel | null>(null);

  const quartosDisponiveis = quartos.filter(q => q.status === 'disponivel');

  const calcularValorTotal = () => {
    if (!selectedQuarto || !dadosCliente.data_checkin || !dadosCliente.data_checkout) return 0;
    
    const checkin = new Date(dadosCliente.data_checkin);
    const checkout = new Date(dadosCliente.data_checkout);
    const noites = Math.ceil((checkout.getTime() - checkin.getTime()) / (1000 * 60 * 60 * 24));
    
    return noites > 0 ? noites * selectedQuarto.preco_noite : 0;
  };

  const handleSelecionarQuarto = (quarto: QuartoHotel) => {
    setSelectedQuarto(quarto);
    setStep('dados');
  };

  const handleDadosSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('pagamento');
  };

  const handleFinalizarReserva = async () => {
    if (!selectedQuarto) return;

    const valorTotal = calcularValorTotal();
    
    const novaReserva: Omit<ReservaHotel, 'id' | 'created_at'> = {
      quarto_id: selectedQuarto.id,
      nome_hospede: dadosCliente.nome_hospede,
      documento_hospede: dadosCliente.documento_hospede,
      telefone_hospede: dadosCliente.telefone_hospede,
      email_hospede: dadosCliente.email_hospede,
      data_checkin: dadosCliente.data_checkin,
      data_checkout: dadosCliente.data_checkout,
      numero_pessoas: dadosCliente.numero_pessoas,
      valor_total: valorTotal,
      status: 'confirmada',
      metodo_pagamento: metodoPagamento,
      observacoes: dadosCliente.observacoes
    };

    const resultado = await criarReserva(novaReserva);
    
    if (resultado) {
      setReservaCriada(resultado);
      setStep('fatura');
      toast({
        title: "Reserva criada com sucesso!",
        description: "A fatura foi gerada e está pronta para impressão.",
      });
    }
  };

  const gerarPDF = () => {
    if (!reservaCriada || !selectedQuarto) return;

    const conteudoFatura = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Fatura - Maspe Residencial</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; }
          .header { text-align: center; margin-bottom: 30px; }
          .details { margin: 20px 0; }
          .total { font-weight: bold; font-size: 18px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>MASPE RESIDENCIAL</h1>
          <p>Fatura de Reserva</p>
        </div>
        
        <div class="details">
          <p><strong>Reserva:</strong> ${reservaCriada.id}</p>
          <p><strong>Cliente:</strong> ${reservaCriada.nome_hospede}</p>
          <p><strong>Documento:</strong> ${reservaCriada.documento_hospede}</p>
          <p><strong>Quarto:</strong> ${selectedQuarto.numero_quarto} - ${selectedQuarto.nome}</p>
          <p><strong>Check-in:</strong> ${new Date(reservaCriada.data_checkin).toLocaleDateString('pt-AO')}</p>
          <p><strong>Check-out:</strong> ${new Date(reservaCriada.data_checkout).toLocaleDateString('pt-AO')}</p>
          <p><strong>Pessoas:</strong> ${reservaCriada.numero_pessoas}</p>
          <p><strong>Método de Pagamento:</strong> ${reservaCriada.metodo_pagamento}</p>
        </div>
        
        <div class="total">
          <p>TOTAL: ${reservaCriada.valor_total.toLocaleString('pt-AO')} Kz</p>
        </div>
      </body>
      </html>
    `;

    const novaJanela = window.open('', '_blank');
    if (novaJanela) {
      novaJanela.document.write(conteudoFatura);
      novaJanela.document.close();
    }
  };

  const imprimirFatura = () => {
    gerarPDF();
    setTimeout(() => {
      window.print();
    }, 500);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-pure-white p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-sora text-2xl font-bold text-charcoal">
            Nova Reserva Presencial
          </h2>
          <button onClick={onClose} className="text-stone-grey hover:text-charcoal">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Seleção de Quarto */}
        {step === 'quarto' && (
          <div>
            <h3 className="font-sora text-xl font-semibold text-charcoal mb-4">
              1. Selecione um Quarto Disponível
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {quartosDisponiveis.map((quarto) => (
                <div
                  key={quarto.id}
                  onClick={() => handleSelecionarQuarto(quarto)}
                  className="border border-stone-grey p-4 cursor-pointer hover:bg-off-white transition-colors"
                >
                  <h4 className="font-sora font-semibold text-charcoal">
                    Quarto {quarto.numero_quarto}
                  </h4>
                  <p className="font-sora text-sm text-stone-grey">{quarto.nome}</p>
                  <p className="font-sora text-lg font-bold text-charcoal mt-2">
                    {quarto.preco_noite.toLocaleString('pt-AO')} Kz/noite
                  </p>
                  <p className="font-sora text-sm text-stone-grey">
                    Capacidade: {quarto.capacidade} pessoas
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dados do Cliente */}
        {step === 'dados' && selectedQuarto && (
          <div>
            <h3 className="font-sora text-xl font-semibold text-charcoal mb-4">
              2. Dados do Cliente - Quarto {selectedQuarto.numero_quarto}
            </h3>
            <form onSubmit={handleDadosSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-sora text-charcoal mb-2">Nome Completo *</label>
                  <input
                    type="text"
                    value={dadosCliente.nome_hospede}
                    onChange={(e) => setDadosCliente(prev => ({...prev, nome_hospede: e.target.value}))}
                    className="w-full p-3 border border-stone-grey font-sora"
                    required
                  />
                </div>
                <div>
                  <label className="block font-sora text-charcoal mb-2">Documento *</label>
                  <input
                    type="text"
                    value={dadosCliente.documento_hospede}
                    onChange={(e) => setDadosCliente(prev => ({...prev, documento_hospede: e.target.value}))}
                    className="w-full p-3 border border-stone-grey font-sora"
                    required
                  />
                </div>
                <div>
                  <label className="block font-sora text-charcoal mb-2">Telefone *</label>
                  <input
                    type="tel"
                    value={dadosCliente.telefone_hospede}
                    onChange={(e) => setDadosCliente(prev => ({...prev, telefone_hospede: e.target.value}))}
                    className="w-full p-3 border border-stone-grey font-sora"
                    required
                  />
                </div>
                <div>
                  <label className="block font-sora text-charcoal mb-2">Email</label>
                  <input
                    type="email"
                    value={dadosCliente.email_hospede}
                    onChange={(e) => setDadosCliente(prev => ({...prev, email_hospede: e.target.value}))}
                    className="w-full p-3 border border-stone-grey font-sora"
                  />
                </div>
                <div>
                  <label className="block font-sora text-charcoal mb-2">Check-in *</label>
                  <input
                    type="date"
                    value={dadosCliente.data_checkin}
                    onChange={(e) => setDadosCliente(prev => ({...prev, data_checkin: e.target.value}))}
                    className="w-full p-3 border border-stone-grey font-sora"
                    required
                  />
                </div>
                <div>
                  <label className="block font-sora text-charcoal mb-2">Check-out *</label>
                  <input
                    type="date"
                    value={dadosCliente.data_checkout}
                    onChange={(e) => setDadosCliente(prev => ({...prev, data_checkout: e.target.value}))}
                    className="w-full p-3 border border-stone-grey font-sora"
                    required
                  />
                </div>
                <div>
                  <label className="block font-sora text-charcoal mb-2">Número de Pessoas *</label>
                  <input
                    type="number"
                    min="1"
                    max={selectedQuarto.capacidade}
                    value={dadosCliente.numero_pessoas}
                    onChange={(e) => setDadosCliente(prev => ({...prev, numero_pessoas: parseInt(e.target.value)}))}
                    className="w-full p-3 border border-stone-grey font-sora"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block font-sora text-charcoal mb-2">Observações</label>
                <textarea
                  value={dadosCliente.observacoes}
                  onChange={(e) => setDadosCliente(prev => ({...prev, observacoes: e.target.value}))}
                  className="w-full p-3 border border-stone-grey font-sora"
                  rows={3}
                />
              </div>
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setStep('quarto')}
                  className="btn-secondary"
                >
                  Voltar
                </button>
                <button type="submit" className="btn-primary">
                  Continuar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Pagamento */}
        {step === 'pagamento' && (
          <div>
            <h3 className="font-sora text-xl font-semibold text-charcoal mb-4">
              3. Pagamento e Confirmação
            </h3>
            <div className="bg-off-white p-6 mb-6">
              <h4 className="font-sora font-semibold text-charcoal mb-2">Resumo da Reserva</h4>
              <p>Cliente: {dadosCliente.nome_hospede}</p>
              <p>Quarto: {selectedQuarto?.numero_quarto} - {selectedQuarto?.nome}</p>
              <p>Período: {dadosCliente.data_checkin} até {dadosCliente.data_checkout}</p>
              <p className="font-bold text-lg mt-2">
                Total: {calcularValorTotal().toLocaleString('pt-AO')} Kz
              </p>
            </div>
            
            <div className="mb-6">
              <label className="block font-sora text-charcoal mb-2">Método de Pagamento *</label>
              <select
                value={metodoPagamento}
                onChange={(e) => setMetodoPagamento(e.target.value)}
                className="w-full p-3 border border-stone-grey font-sora"
                required
              >
                <option value="">Selecione o método</option>
                <option value="TPA/Cartão">TPA/Cartão</option>
                <option value="Transferência Bancária">Transferência Bancária</option>
                <option value="Dinheiro/Espécie">Dinheiro/Espécie</option>
              </select>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={() => setStep('dados')}
                className="btn-secondary"
              >
                Voltar
              </button>
              <button
                onClick={handleFinalizarReserva}
                disabled={!metodoPagamento}
                className="btn-primary disabled:opacity-50"
              >
                Finalizar Reserva
              </button>
            </div>
          </div>
        )}

        {/* Fatura */}
        {step === 'fatura' && reservaCriada && (
          <div className="text-center">
            <h3 className="font-sora text-xl font-semibold text-green-600 mb-4">
              ✅ Reserva Criada com Sucesso!
            </h3>
            <div className="bg-off-white p-6 mb-6">
              <p className="font-sora text-charcoal">
                <strong>Número da Reserva:</strong> {reservaCriada.id}
              </p>
              <p className="font-sora text-charcoal">
                <strong>Cliente:</strong> {reservaCriada.nome_hospede}
              </p>
              <p className="font-sora text-charcoal">
                <strong>Total Pago:</strong> {reservaCriada.valor_total.toLocaleString('pt-AO')} Kz
              </p>
            </div>
            
            <div className="flex justify-center space-x-4">
              <button
                onClick={gerarPDF}
                className="btn-secondary flex items-center space-x-2"
              >
                <Eye className="w-5 h-5" />
                <span>Visualizar Fatura</span>
              </button>
              <button
                onClick={imprimirFatura}
                className="btn-primary flex items-center space-x-2"
              >
                <Printer className="w-5 h-5" />
                <span>Imprimir Fatura</span>
              </button>
              <button
                onClick={() => {
                  onSuccess();
                  onClose();
                }}
                className="btn-secondary"
              >
                Fechar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
