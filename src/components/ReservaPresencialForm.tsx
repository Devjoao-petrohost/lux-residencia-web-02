
import { useState } from 'react';
import { Calendar, User, CreditCard, Printer, Eye, X, Check, AlertCircle } from 'lucide-react';
import { useQuartosHotel } from '@/hooks/useQuartosHotel';
import { useReservasHotel } from '@/hooks/useReservasHotel';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import type { QuartoHotel, ReservaHotel } from '@/lib/supabase';

interface ReservaPresencialFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function ReservaPresencialForm({ onClose, onSuccess }: ReservaPresencialFormProps) {
  const { quartos } = useQuartosHotel();
  const { criarReserva } = useReservasHotel();
  const { profile } = useAuth();
  
  const [step, setStep] = useState<'quarto' | 'dados' | 'pagamento' | 'confirmacao' | 'fatura'>('quarto');
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
  const [dadosPagamento, setDadosPagamento] = useState({
    metodo_pagamento: '',
    valor_pago: 0,
    troco: 0,
    referencia_pagamento: ''
  });
  const [reservaCriada, setReservaCriada] = useState<ReservaHotel | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

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
    
    // Validações
    if (!dadosCliente.nome_hospede.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "Nome do hóspede é obrigatório.",
        variant: "destructive"
      });
      return;
    }

    if (!dadosCliente.documento_hospede.trim()) {
      toast({
        title: "Campo obrigatório", 
        description: "Documento do hóspede é obrigatório.",
        variant: "destructive"
      });
      return;
    }

    if (!dadosCliente.data_checkin || !dadosCliente.data_checkout) {
      toast({
        title: "Datas obrigatórias",
        description: "Datas de check-in e check-out são obrigatórias.",
        variant: "destructive"
      });
      return;
    }

    const checkin = new Date(dadosCliente.data_checkin);
    const checkout = new Date(dadosCliente.data_checkout);
    
    if (checkout <= checkin) {
      toast({
        title: "Datas inválidas",
        description: "A data de check-out deve ser posterior ao check-in.",
        variant: "destructive"
      });
      return;
    }

    if (dadosCliente.numero_pessoas > (selectedQuarto?.capacidade || 1)) {
      toast({
        title: "Capacidade excedida",
        description: `Este quarto comporta no máximo ${selectedQuarto?.capacidade} pessoa(s).`,
        variant: "destructive"
      });
      return;
    }

    setStep('pagamento');
  };

  const handlePagamentoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!dadosPagamento.metodo_pagamento) {
      toast({
        title: "Método de pagamento obrigatório",
        description: "Selecione um método de pagamento.",
        variant: "destructive"
      });
      return;
    }

    const valorTotal = calcularValorTotal();
    
    if (dadosPagamento.metodo_pagamento === 'Dinheiro/Espécie') {
      if (dadosPagamento.valor_pago < valorTotal) {
        toast({
          title: "Valor insuficiente",
          description: "O valor pago deve ser igual ou superior ao total.",
          variant: "destructive"
        });
        return;
      }
      setDadosPagamento(prev => ({
        ...prev,
        troco: prev.valor_pago - valorTotal
      }));
    } else {
      setDadosPagamento(prev => ({
        ...prev,
        valor_pago: valorTotal,
        troco: 0
      }));
    }

    setStep('confirmacao');
  };

  const handleConfirmarReserva = async () => {
    if (!selectedQuarto) return;

    setIsProcessing(true);
    
    try {
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
        metodo_pagamento: dadosPagamento.metodo_pagamento,
        observacoes: dadosCliente.observacoes
      };

      const resultado = await criarReserva(novaReserva);
      
      if (resultado) {
        setReservaCriada(resultado);
        setStep('fatura');
        toast({
          title: "Reserva criada com sucesso!",
          description: "Pagamento processado e reserva confirmada.",
        });
        onSuccess();
      } else {
        throw new Error('Falha ao criar reserva');
      }
    } catch (error) {
      console.error('Erro ao criar reserva:', error);
      toast({
        title: "Erro",
        description: "Não foi possível processar a reserva. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const gerarFaturaPDF = () => {
    if (!reservaCriada || !selectedQuarto) return;

    const conteudoFatura = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Fatura - Maspe Residencial</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            margin: 40px; 
            line-height: 1.6;
            color: #333;
          }
          .header { 
            text-align: center; 
            margin-bottom: 40px; 
            border-bottom: 2px solid #333;
            padding-bottom: 20px;
          }
          .logo {
            font-size: 24px;
            font-weight: bold;
            color: #333;
          }
          .details { 
            margin: 20px 0; 
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
          }
          .section {
            background: #f9f9f9;
            padding: 15px;
            border-radius: 5px;
          }
          .section h3 {
            margin-top: 0;
            color: #333;
            border-bottom: 1px solid #ddd;
            padding-bottom: 5px;
          }
          .total { 
            font-weight: bold; 
            font-size: 18px; 
            text-align: center;
            background: #333;
            color: white;
            padding: 15px;
            margin-top: 20px;
            border-radius: 5px;
          }
          .footer {
            text-align: center;
            margin-top: 40px;
            font-size: 12px;
            color: #666;
          }
          @media print {
            body { margin: 20px; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">MASPE RESIDENCIAL</div>
          <p>Fatura de Reserva Presencial</p>
          <p>Data: ${new Date().toLocaleDateString('pt-AO')}</p>
        </div>
        
        <div class="details">
          <div class="section">
            <h3>Informações da Reserva</h3>
            <p><strong>Número:</strong> ${reservaCriada.id.slice(0, 8)}</p>
            <p><strong>Quarto:</strong> ${selectedQuarto.numero_quarto} - ${selectedQuarto.nome}</p>
            <p><strong>Check-in:</strong> ${new Date(reservaCriada.data_checkin).toLocaleDateString('pt-AO')}</p>
            <p><strong>Check-out:</strong> ${new Date(reservaCriada.data_checkout).toLocaleDateString('pt-AO')}</p>
            <p><strong>Pessoas:</strong> ${reservaCriada.numero_pessoas}</p>
          </div>
          
          <div class="section">
            <h3>Dados do Cliente</h3>
            <p><strong>Nome:</strong> ${reservaCriada.nome_hospede}</p>
            <p><strong>Documento:</strong> ${reservaCriada.documento_hospede}</p>
            <p><strong>Telefone:</strong> ${reservaCriada.telefone_hospede}</p>
            ${reservaCriada.email_hospede ? `<p><strong>Email:</strong> ${reservaCriada.email_hospede}</p>` : ''}
          </div>
        </div>

        <div class="section">
          <h3>Informações de Pagamento</h3>
          <p><strong>Método:</strong> ${reservaCriada.metodo_pagamento}</p>
          <p><strong>Valor Pago:</strong> ${dadosPagamento.valor_pago.toLocaleString('pt-AO')} Kz</p>
          ${dadosPagamento.troco > 0 ? `<p><strong>Troco:</strong> ${dadosPagamento.troco.toLocaleString('pt-AO')} Kz</p>` : ''}
          ${dadosPagamento.referencia_pagamento ? `<p><strong>Referência:</strong> ${dadosPagamento.referencia_pagamento}</p>` : ''}
          <p><strong>Responsável:</strong> ${profile?.nome || profile?.email || 'Administrador'}</p>
        </div>
        
        <div class="total">
          TOTAL PAGO: ${reservaCriada.valor_total.toLocaleString('pt-AO')} Kz
        </div>

        <div class="footer">
          <p>Maspe Residencial - Luanda, Angola</p>
          <p>Telefone: +244 972463599 | Email: contato@masperesidencial.ao</p>
          <p>Obrigado pela preferência!</p>
        </div>
      </body>
      </html>
    `;

    const novaJanela = window.open('', '_blank');
    if (novaJanela) {
      novaJanela.document.write(conteudoFatura);
      novaJanela.document.close();
      novaJanela.print();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-pure-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-stone-grey">
          <h2 className="font-sora text-2xl font-bold text-charcoal">
            Nova Reserva Presencial
          </h2>
          <button onClick={onClose} className="text-stone-grey hover:text-charcoal">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Progress Indicator */}
          <div className="flex items-center mb-8">
            {['quarto', 'dados', 'pagamento', 'confirmacao', 'fatura'].map((stepName, index) => (
              <div key={stepName} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  step === stepName ? 'bg-charcoal text-white' :
                  ['quarto', 'dados', 'pagamento', 'confirmacao', 'fatura'].indexOf(step) > index ? 'bg-green-500 text-white' :
                  'bg-stone-grey text-white'
                }`}>
                  {['quarto', 'dados', 'pagamento', 'confirmacao', 'fatura'].indexOf(step) > index ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    index + 1
                  )}
                </div>
                {index < 4 && (
                  <div className={`w-12 h-1 mx-2 ${
                    ['quarto', 'dados', 'pagamento', 'confirmacao', 'fatura'].indexOf(step) > index ? 'bg-green-500' : 'bg-stone-grey'
                  }`} />
                )}
              </div>
            ))}
          </div>

          {/* Seleção de Quarto */}
          {step === 'quarto' && (
            <div>
              <h3 className="font-sora text-xl font-semibold text-charcoal mb-6">
                1. Selecione um Quarto Disponível
              </h3>
              {quartosDisponiveis.length === 0 ? (
                <div className="text-center py-12">
                  <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                  <h4 className="font-sora text-lg font-semibold text-charcoal mb-2">
                    Nenhum quarto disponível
                  </h4>
                  <p className="font-sora text-stone-grey">
                    Todos os quartos estão ocupados ou em manutenção no momento.
                  </p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {quartosDisponiveis.map((quarto) => (
                    <div
                      key={quarto.id}
                      onClick={() => handleSelecionarQuarto(quarto)}
                      className="border border-stone-grey rounded-lg p-4 cursor-pointer hover:bg-off-white transition-colors hover:border-charcoal"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-sora font-semibold text-charcoal">
                          Quarto {quarto.numero_quarto}
                        </h4>
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-sora rounded">
                          Disponível
                        </span>
                      </div>
                      <p className="font-sora text-sm text-stone-grey mb-3">{quarto.nome}</p>
                      <p className="font-sora text-lg font-bold text-charcoal mb-2">
                        {quarto.preco_noite.toLocaleString('pt-AO')} Kz/noite
                      </p>
                      <p className="font-sora text-sm text-stone-grey">
                        Capacidade: {quarto.capacidade} pessoa{quarto.capacidade > 1 ? 's' : ''}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Dados do Cliente */}
          {step === 'dados' && selectedQuarto && (
            <div>
              <h3 className="font-sora text-xl font-semibold text-charcoal mb-6">
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
                      className="w-full p-3 border border-stone-grey rounded font-sora"
                      placeholder="Nome do hóspede"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-sora text-charcoal mb-2">Documento *</label>
                    <input
                      type="text"
                      value={dadosCliente.documento_hospede}
                      onChange={(e) => setDadosCliente(prev => ({...prev, documento_hospede: e.target.value}))}
                      className="w-full p-3 border border-stone-grey rounded font-sora"
                      placeholder="BI ou Passaporte"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-sora text-charcoal mb-2">Telefone *</label>
                    <input
                      type="tel"
                      value={dadosCliente.telefone_hospede}
                      onChange={(e) => setDadosCliente(prev => ({...prev, telefone_hospede: e.target.value}))}
                      className="w-full p-3 border border-stone-grey rounded font-sora"
                      placeholder="+244 9xx xxx xxx"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-sora text-charcoal mb-2">Email</label>
                    <input
                      type="email"
                      value={dadosCliente.email_hospede}
                      onChange={(e) => setDadosCliente(prev => ({...prev, email_hospede: e.target.value}))}
                      className="w-full p-3 border border-stone-grey rounded font-sora"
                      placeholder="email@exemplo.com"
                    />
                  </div>
                  <div>
                    <label className="block font-sora text-charcoal mb-2">Check-in *</label>
                    <input
                      type="date"
                      value={dadosCliente.data_checkin}
                      onChange={(e) => setDadosCliente(prev => ({...prev, data_checkin: e.target.value}))}
                      className="w-full p-3 border border-stone-grey rounded font-sora"
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-sora text-charcoal mb-2">Check-out *</label>
                    <input
                      type="date"
                      value={dadosCliente.data_checkout}
                      onChange={(e) => setDadosCliente(prev => ({...prev, data_checkout: e.target.value}))}
                      className="w-full p-3 border border-stone-grey rounded font-sora"
                      min={dadosCliente.data_checkin || new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-sora text-charcoal mb-2">Número de Pessoas *</label>
                    <select
                      value={dadosCliente.numero_pessoas}
                      onChange={(e) => setDadosCliente(prev => ({...prev, numero_pessoas: parseInt(e.target.value)}))}
                      className="w-full p-3 border border-stone-grey rounded font-sora"
                      required
                    >
                      {Array.from({length: selectedQuarto.capacidade}, (_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1} pessoa{i > 0 ? 's' : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block font-sora text-charcoal mb-2">Observações</label>
                  <textarea
                    value={dadosCliente.observacoes}
                    onChange={(e) => setDadosCliente(prev => ({...prev, observacoes: e.target.value}))}
                    className="w-full p-3 border border-stone-grey rounded font-sora"
                    rows={3}
                    placeholder="Observações especiais ou pedidos do cliente"
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
                    Continuar para Pagamento
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Pagamento */}
          {step === 'pagamento' && (
            <div>
              <h3 className="font-sora text-xl font-semibold text-charcoal mb-6">
                3. Informações de Pagamento
              </h3>
              
              <div className="bg-off-white p-6 rounded-lg mb-6">
                <h4 className="font-sora font-semibold text-charcoal mb-4">Resumo da Reserva</h4>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p><strong>Cliente:</strong> {dadosCliente.nome_hospede}</p>
                    <p><strong>Quarto:</strong> {selectedQuarto?.numero_quarto} - {selectedQuarto?.nome}</p>
                    <p><strong>Pessoas:</strong> {dadosCliente.numero_pessoas}</p>
                  </div>
                  <div>
                    <p><strong>Check-in:</strong> {new Date(dadosCliente.data_checkin).toLocaleDateString('pt-AO')}</p>
                    <p><strong>Check-out:</strong> {new Date(dadosCliente.data_checkout).toLocaleDateString('pt-AO')}</p>
                    <p className="font-bold text-lg text-charcoal mt-2">
                      <strong>Total:</strong> {calcularValorTotal().toLocaleString('pt-AO')} Kz
                    </p>
                  </div>
                </div>
              </div>

              <form onSubmit={handlePagamentoSubmit} className="space-y-6">
                <div>
                  <label className="block font-sora text-charcoal mb-3">Método de Pagamento *</label>
                  <div className="grid md:grid-cols-3 gap-3">
                    {['TPA/Cartão', 'Transferência Bancária', 'Dinheiro/Espécie'].map((metodo) => (
                      <button
                        key={metodo}
                        type="button"
                        onClick={() => setDadosPagamento(prev => ({...prev, metodo_pagamento: metodo}))}
                        className={`p-4 border rounded-lg text-center transition-colors font-sora ${
                          dadosPagamento.metodo_pagamento === metodo
                            ? 'border-charcoal bg-charcoal text-white'
                            : 'border-stone-grey hover:bg-off-white'
                        }`}
                      >
                        {metodo}
                      </button>
                    ))}
                  </div>
                </div>

                {dadosPagamento.metodo_pagamento === 'Dinheiro/Espécie' && (
                  <div>
                    <label className="block font-sora text-charcoal mb-2">Valor Recebido *</label>
                    <input
                      type="number"
                      value={dadosPagamento.valor_pago || ''}
                      onChange={(e) => setDadosPagamento(prev => ({...prev, valor_pago: parseFloat(e.target.value) || 0}))}
                      className="w-full p-3 border border-stone-grey rounded font-sora"
                      placeholder="Valor em Kz"
                      min={calcularValorTotal()}
                      step="0.01"
                      required
                    />
                    {dadosPagamento.valor_pago > 0 && dadosPagamento.valor_pago >= calcularValorTotal() && (
                      <p className="mt-2 font-sora text-sm">
                        <strong>Troco:</strong> {(dadosPagamento.valor_pago - calcularValorTotal()).toLocaleString('pt-AO')} Kz
                      </p>
                    )}
                  </div>
                )}

                {dadosPagamento.metodo_pagamento && dadosPagamento.metodo_pagamento !== 'Dinheiro/Espécie' && (
                  <div>
                    <label className="block font-sora text-charcoal mb-2">Referência/Comprovativo</label>
                    <input
                      type="text"
                      value={dadosPagamento.referencia_pagamento}
                      onChange={(e) => setDadosPagamento(prev => ({...prev, referencia_pagamento: e.target.value}))}
                      className="w-full p-3 border border-stone-grey rounded font-sora"
                      placeholder="Número de referência ou comprovativo"
                    />
                  </div>
                )}

                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setStep('dados')}
                    className="btn-secondary"
                  >
                    Voltar
                  </button>
                  <button
                    type="submit"
                    disabled={!dadosPagamento.metodo_pagamento}
                    className="btn-primary disabled:opacity-50"
                  >
                    Confirmar Pagamento
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Confirmação */}
          {step === 'confirmacao' && (
            <div>
              <h3 className="font-sora text-xl font-semibold text-charcoal mb-6">
                4. Confirmação Final
              </h3>
              
              <div className="bg-off-white p-6 rounded-lg mb-6">
                <h4 className="font-sora font-semibold text-charcoal mb-4">Confirme todos os dados:</h4>
                <div className="grid md:grid-cols-2 gap-6 text-sm">
                  <div>
                    <h5 className="font-semibold mb-2">Dados do Cliente:</h5>
                    <p><strong>Nome:</strong> {dadosCliente.nome_hospede}</p>
                    <p><strong>Documento:</strong> {dadosCliente.documento_hospede}</p>
                    <p><strong>Telefone:</strong> {dadosCliente.telefone_hospede}</p>
                    {dadosCliente.email_hospede && <p><strong>Email:</strong> {dadosCliente.email_hospede}</p>}
                  </div>
                  <div>
                    <h5 className="font-semibold mb-2">Reserva:</h5>
                    <p><strong>Quarto:</strong> {selectedQuarto?.numero_quarto} - {selectedQuarto?.nome}</p>
                    <p><strong>Check-in:</strong> {new Date(dadosCliente.data_checkin).toLocaleDateString('pt-AO')}</p>
                    <p><strong>Check-out:</strong> {new Date(dadosCliente.data_checkout).toLocaleDateString('pt-AO')}</p>
                    <p><strong>Pessoas:</strong> {dadosCliente.numero_pessoas}</p>
                  </div>
                  <div>
                    <h5 className="font-semibold mb-2">Pagamento:</h5>
                    <p><strong>Método:</strong> {dadosPagamento.metodo_pagamento}</p>
                    <p><strong>Valor Total:</strong> {calcularValorTotal().toLocaleString('pt-AO')} Kz</p>
                    {dadosPagamento.metodo_pagamento === 'Dinheiro/Espécie' && (
                      <>
                        <p><strong>Valor Pago:</strong> {dadosPagamento.valor_pago.toLocaleString('pt-AO')} Kz</p>
                        {dadosPagamento.valor_pago > calcularValorTotal() && (
                          <p><strong>Troco:</strong> {(dadosPagamento.valor_pago - calcularValorTotal()).toLocaleString('pt-AO')} Kz</p>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => setStep('pagamento')}
                  className="btn-secondary"
                  disabled={isProcessing}
                >
                  Voltar
                </button>
                <button
                  onClick={handleConfirmarReserva}
                  disabled={isProcessing}
                  className="btn-primary disabled:opacity-50 flex items-center space-x-2"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Processando...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-5 h-5" />
                      <span>Confirmar Reserva</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Fatura */}
          {step === 'fatura' && reservaCriada && (
            <div className="text-center">
              <div className="mb-6">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="font-sora text-2xl font-bold text-green-600 mb-2">
                  Reserva Criada com Sucesso!
                </h3>
                <p className="font-sora text-stone-grey">
                  Pagamento processado e reserva confirmada
                </p>
              </div>

              <div className="bg-off-white p-6 rounded-lg mb-6">
                <h4 className="font-sora font-semibold text-charcoal mb-4">Detalhes da Reserva:</h4>
                <div className="text-left space-y-2">
                  <p><strong>Número da Reserva:</strong> {reservaCriada.id.slice(0, 8).toUpperCase()}</p>
                  <p><strong>Cliente:</strong> {reservaCriada.nome_hospede}</p>
                  <p><strong>Quarto:</strong> {selectedQuarto?.numero_quarto} - {selectedQuarto?.nome}</p>
                  <p><strong>Total Pago:</strong> {reservaCriada.valor_total.toLocaleString('pt-AO')} Kz</p>
                  <p><strong>Status:</strong> <span className="text-green-600 font-semibold">Confirmada</span></p>
                </div>
              </div>
              
              <div className="flex justify-center space-x-4">
                <button
                  onClick={gerarFaturaPDF}
                  className="btn-primary flex items-center space-x-2"
                >
                  <Printer className="w-5 h-5" />
                  <span>Imprimir Fatura</span>
                </button>
                <button
                  onClick={onClose}
                  className="btn-secondary"
                >
                  Fechar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
