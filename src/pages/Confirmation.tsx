import { useSearchParams, Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Invoice from '@/components/Invoice';
import { CheckCircle, Copy, Phone, Mail, Download } from 'lucide-react';
import { useState } from 'react';

const Confirmation = () => {
  const [searchParams] = useSearchParams();
  const transactionId = searchParams.get('transaction');
  const paymentMethod = searchParams.get('method');
  const referenceNumber = searchParams.get('reference');
  
  const [copied, setCopied] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);

  // Get booking data from localStorage
  const getBookingData = () => {
    const bookings = JSON.parse(localStorage.getItem('maspe_bookings') || '[]');
    const booking = bookings.find((b: any) => b.transactionId === transactionId);
    
    if (booking) {
      return {
        transactionId: booking.transactionId,
        referenceNumber: booking.referenceNumber,
        guest: booking.guest,
        suite: booking.suite,
        checkIn: booking.guest.dataEntrada,
        checkOut: booking.guest.dataSaida,
        numberOfGuests: booking.guest.numeroPessoas,
        totalAmount: booking.totalAmount,
        paymentMethod: booking.paymentMethod
      };
    }
    
    return null;
  };

  const bookingData = getBookingData();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getPaymentInstructions = () => {
    if (paymentMethod === 'transferencia') {
      return {
        title: "Transferência Bancária",
        instructions: [
          "Efetue a transferência bancária para os dados abaixo:",
          "Banco: BAI - Banco Angolano de Investimentos",
          "IBAN: AO06 0040 0000 1234 5678 9012 3",
          "Titular: Maspe Residencial, Lda",
          "Referência: " + referenceNumber,
          "Após efetuar a transferência, envie o comprovativo para: pagamentos@masperesidencial.ao"
        ]
      };
    } else if (paymentMethod === 'multicaixa') {
      return {
        title: "Pagamento por Referência Multicaixa",
        instructions: [
          "Dirija-se a qualquer terminal Multicaixa Express",
          "Selecione 'Pagamentos' > 'Outros Pagamentos'",
          "Introduza a referência: " + referenceNumber,
          "Confirme o valor e efetue o pagamento",
          "Guarde o recibo como comprovativo"
        ]
      };
    }
    return null;
  };

  const paymentInfo = getPaymentInstructions();

  const printInvoice = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow && bookingData) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Fatura - Maspe Residencial</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .invoice { max-width: 400px; margin: 0 auto; }
              .header { text-align: center; border-bottom: 1px solid #ccc; padding-bottom: 10px; margin-bottom: 20px; }
              .section { margin-bottom: 20px; }
              .section h3 { border-bottom: 1px solid #ccc; padding-bottom: 5px; }
              .row { display: flex; justify-content: space-between; margin: 5px 0; }
              .total { font-weight: bold; border-top: 1px solid #ccc; padding-top: 10px; }
            </style>
          </head>
          <body>
            <div class="invoice">
              <div class="header">
                <h1>Maspe Residencial</h1>
                <p>Fatura de Reserva</p>
              </div>
              
              <div class="section">
                <h3>Detalhes da Reserva</h3>
                <div class="row"><span>ID Transação:</span><span>${bookingData.transactionId}</span></div>
                <div class="row"><span>Referência:</span><span>${bookingData.referenceNumber}</span></div>
                <div class="row"><span>Suíte:</span><span>${bookingData.suite}</span></div>
                <div class="row"><span>Check-in:</span><span>${new Date(bookingData.checkIn).toLocaleDateString('pt-AO')}</span></div>
                <div class="row"><span>Check-out:</span><span>${new Date(bookingData.checkOut).toLocaleDateString('pt-AO')}</span></div>
                <div class="row"><span>Pessoas:</span><span>${bookingData.numberOfGuests}</span></div>
              </div>
              
              <div class="section">
                <h3>Dados do Hóspede</h3>
                <div class="row"><span>Nome:</span><span>${bookingData.guest.nomeCompleto}</span></div>
                <div class="row"><span>BI:</span><span>${bookingData.guest.bi}</span></div>
                <div class="row"><span>Telefone:</span><span>${bookingData.guest.telefone}</span></div>
                <div class="row"><span>Email:</span><span>${bookingData.guest.email}</span></div>
              </div>
              
              <div class="section">
                <div class="row total"><span>Total:</span><span>${bookingData.totalAmount.toLocaleString('pt-AO')} Kz</span></div>
              </div>
              
              <div style="text-align: center; font-size: 12px; color: #666;">
                <p>Obrigado por escolher o Maspe Residencial</p>
                <p>reservas@masperesidencial.ao | +244 222 123 456</p>
              </div>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-24 lg:pt-32">
        <section className="py-8 lg:py-16 bg-off-white">
          <div className="container max-w-4xl px-4 lg:px-6">
            <div className="bg-pure-white p-8 lg:p-12 shadow-lg text-center">
              <div className="mb-8">
                <CheckCircle className="w-16 lg:w-20 h-16 lg:h-20 text-green-600 mx-auto mb-6" />
                <h1 className="font-sora text-3xl lg:text-4xl font-bold text-charcoal mb-4">
                  Reserva Confirmada!
                </h1>
                <p className="font-sora text-lg lg:text-xl text-stone-grey">
                  Sua reserva foi registada com sucesso. Agora precisa efetuar o pagamento.
                </p>
              </div>

              <div className="bg-off-white p-4 lg:p-6 mb-8">
                <div className="grid md:grid-cols-2 gap-4 text-left">
                  <div>
                    <span className="font-sora text-sm text-stone-grey">ID da Transação:</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-sora font-semibold text-charcoal">{transactionId}</span>
                      <button 
                        onClick={() => copyToClipboard(transactionId || '')}
                        className="text-charcoal hover:text-stone-grey"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div>
                    <span className="font-sora text-sm text-stone-grey">Referência de Pagamento:</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-sora font-semibold text-charcoal">{referenceNumber}</span>
                      <button 
                        onClick={() => copyToClipboard(referenceNumber || '')}
                        className="text-charcoal hover:text-stone-grey"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
                {copied && (
                  <p className="font-sora text-sm text-green-600 mt-2">Copiado para a área de transferência!</p>
                )}
              </div>

              {/* Invoice Button */}
              {bookingData && (
                <div className="mb-8">
                  <button
                    onClick={printInvoice}
                    className="btn-primary mb-4 mr-4"
                  >
                    <Download className="w-4 h-4 mr-2 inline" />
                    Baixar Fatura
                  </button>
                  <button
                    onClick={() => setShowInvoice(!showInvoice)}
                    className="btn-secondary"
                  >
                    {showInvoice ? 'Ocultar' : 'Ver'} Fatura
                  </button>
                </div>
              )}

              {/* Invoice Display */}
              {showInvoice && bookingData && (
                <div className="mb-8">
                  <Invoice bookingData={bookingData} />
                </div>
              )}

              {paymentInfo && (
                <div className="bg-stone-grey bg-opacity-10 p-6 lg:p-8 mb-8 text-left">
                  <h2 className="font-sora text-xl lg:text-2xl font-bold text-charcoal mb-6">
                    Instruções de Pagamento - {paymentInfo.title}
                  </h2>
                  <div className="space-y-3">
                    {paymentInfo.instructions.map((instruction, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <span className="bg-charcoal text-pure-white w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                          {index + 1}
                        </span>
                        <p className="font-sora text-charcoal text-sm lg:text-base">{instruction}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="border-t border-stone-grey pt-8 mb-8">
                <h3 className="font-sora text-xl font-bold text-charcoal mb-6">
                  Precisa de Ajuda?
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex items-center justify-center space-x-3">
                    <Phone className="w-5 h-5 text-charcoal" />
                    <div>
                      <p className="font-sora font-semibold text-charcoal">Telefone</p>
                      <p className="font-sora text-stone-grey">+244 222 123 456</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-center space-x-3">
                    <Mail className="w-5 h-5 text-charcoal" />
                    <div>
                      <p className="font-sora font-semibold text-charcoal">Email</p>
                      <p className="font-sora text-stone-grey">reservas@masperesidencial.ao</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <p className="font-sora text-stone-grey">
                  Após a confirmação do pagamento, enviaremos um email com todos os detalhes da sua reserva.
                  O pagamento deve ser efetuado num prazo de 24 horas para garantir a sua reserva.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link 
                    to="/"
                    className="btn-primary"
                  >
                    Voltar ao Início
                  </Link>
                  <Link 
                    to="/acomodacoes"
                    className="btn-secondary"
                  >
                    Ver Outras Acomodações
                  </Link>
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

export default Confirmation;
