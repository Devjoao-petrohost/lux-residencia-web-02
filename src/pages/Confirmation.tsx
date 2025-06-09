
import { useSearchParams, Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { CheckCircle, Copy, Phone, Mail } from 'lucide-react';
import { useState } from 'react';

const Confirmation = () => {
  const [searchParams] = useSearchParams();
  const transactionId = searchParams.get('transaction');
  const paymentMethod = searchParams.get('method');
  const referenceNumber = searchParams.get('reference');
  
  const [copied, setCopied] = useState(false);

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

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-32">
        <section className="py-16 bg-off-white">
          <div className="container max-w-4xl">
            <div className="bg-pure-white p-12 shadow-lg text-center">
              <div className="mb-8">
                <CheckCircle className="w-20 h-20 text-green-600 mx-auto mb-6" />
                <h1 className="font-sora text-4xl font-bold text-charcoal mb-4">
                  Reserva Confirmada!
                </h1>
                <p className="font-sora text-xl text-stone-grey">
                  Sua reserva foi registada com sucesso. Agora precisa efetuar o pagamento.
                </p>
              </div>

              <div className="bg-off-white p-6 mb-8">
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

              {paymentInfo && (
                <div className="bg-stone-grey bg-opacity-10 p-8 mb-8 text-left">
                  <h2 className="font-sora text-2xl font-bold text-charcoal mb-6">
                    Instruções de Pagamento - {paymentInfo.title}
                  </h2>
                  <div className="space-y-3">
                    {paymentInfo.instructions.map((instruction, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <span className="bg-charcoal text-pure-white w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                          {index + 1}
                        </span>
                        <p className="font-sora text-charcoal">{instruction}</p>
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
