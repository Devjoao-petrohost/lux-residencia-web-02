
import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface Booking {
  id: string;
  transactionId: string;
  guest: any;
  suite: string;
  pricePerNight: number;
  nights: number;
  totalAmount: number;
  paymentStatus: string;
  bookingDate: string;
  status: string;
}

const Confirmation = () => {
  const [searchParams] = useSearchParams();
  const transactionId = searchParams.get('transaction') || '';
  const [booking, setBooking] = useState<Booking | null>(null);

  useEffect(() => {
    if (transactionId) {
      const existingBookings = JSON.parse(localStorage.getItem('maspe_bookings') || '[]');
      const foundBooking = existingBookings.find((b: Booking) => b.transactionId === transactionId);
      if (foundBooking) {
        setBooking(foundBooking);
      }
    }
  }, [transactionId]);

  const printInvoice = () => {
    window.print();
  };

  if (!booking) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="pt-32 py-16">
          <div className="container text-center">
            <h1 className="font-playfair text-4xl font-bold text-charcoal mb-4">
              Reserva não encontrada
            </h1>
            <Link to="/" className="text-charcoal hover:text-stone-grey font-sora">
              Voltar ao início
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-32">
        <section className="py-16 bg-off-white">
          <div className="container max-w-4xl">
            {/* Confirmação */}
            <div className="text-center mb-16">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8 text-2xl font-bold">
                ✓
              </div>
              <h1 className="font-playfair text-4xl md:text-5xl font-bold text-charcoal mb-6">
                Reserva Confirmada!
              </h1>
              <p className="font-sora text-xl text-stone-grey">
                Pagamento processado com sucesso. Sua reserva foi confirmada.
              </p>
            </div>

            {/* Fatura/Recibo */}
            <div className="bg-pure-white p-12 mb-12 shadow-lg" id="invoice">
              <div className="border-b-2 border-stone-grey pb-8 mb-8">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="font-playfair text-3xl font-bold text-charcoal mb-4">
                      Maspe Residencial
                    </h2>
                    <p className="text-stone-grey font-sora">
                      Sofisticação que Acolhe<br />
                      Rua da Elegância, 123<br />
                      Luanda, Angola
                    </p>
                  </div>
                  <div className="text-right">
                    <h3 className="font-sora text-xl font-bold text-charcoal mb-4">
                      FATURA/RECIBO
                    </h3>
                    <p className="text-stone-grey text-sm font-sora">
                      Nº: {booking.id}<br />
                      Data: {new Date(booking.bookingDate).toLocaleDateString('pt-PT')}<br />
                      Transação: {booking.transactionId}
                    </p>
                  </div>
                </div>
              </div>

              {/* Dados do Cliente */}
              <div className="mb-8">
                <h4 className="font-sora font-bold text-charcoal mb-4 text-lg">Dados do Hóspede:</h4>
                <div className="text-stone-grey font-sora space-y-2">
                  <p><strong>Nome:</strong> {booking.guest.nomeCompleto}</p>
                  <p><strong>Email:</strong> {booking.guest.email}</p>
                  <p><strong>Telefone:</strong> {booking.guest.telefone}</p>
                  {booking.guest.endereco && (
                    <p><strong>Endereço:</strong> {booking.guest.endereco}, {booking.guest.cidade}, {booking.guest.cep}</p>
                  )}
                </div>
              </div>

              {/* Detalhes da Reserva */}
              <div className="mb-8">
                <h4 className="font-sora font-bold text-charcoal mb-4 text-lg">Detalhes da Reserva:</h4>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-stone-grey">
                        <th className="text-left py-4 font-sora font-bold text-charcoal">Descrição</th>
                        <th className="text-center py-4 font-sora font-bold text-charcoal">Quantidade</th>
                        <th className="text-right py-4 font-sora font-bold text-charcoal">Preço Unit.</th>
                        <th className="text-right py-4 font-sora font-bold text-charcoal">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="py-4 text-stone-grey font-sora">
                          {booking.suite}<br />
                          <small>
                            {new Date(booking.guest.dataEntrada).toLocaleDateString('pt-PT')} - {new Date(booking.guest.dataSaida).toLocaleDateString('pt-PT')}<br />
                            {booking.guest.numeroHospedes} hóspede(s)
                          </small>
                        </td>
                        <td className="py-4 text-center text-stone-grey font-sora">{booking.nights} noite(s)</td>
                        <td className="py-4 text-right text-stone-grey font-sora">{booking.pricePerNight.toLocaleString('pt-AO')} Kz</td>
                        <td className="py-4 text-right text-charcoal font-bold font-sora">{booking.totalAmount.toLocaleString('pt-AO')} Kz</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Total */}
              <div className="border-t-2 border-stone-grey pt-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-sora text-xl text-stone-grey">Total Pago:</span>
                  <span className="font-playfair text-3xl font-bold text-charcoal">{booking.totalAmount.toLocaleString('pt-AO')} Kz</span>
                </div>
                <p className="text-sm text-stone-grey font-sora">
                  Método de Pagamento: Cartão de Crédito<br />
                  Status: <span className="text-green-600 font-bold">PAGO</span>
                </p>
              </div>

              {/* Observações */}
              {booking.guest.observacoes && (
                <div className="mt-8 pt-6 border-t border-stone-grey">
                  <h4 className="font-sora font-bold text-charcoal mb-3">Observações:</h4>
                  <p className="text-stone-grey font-sora">{booking.guest.observacoes}</p>
                </div>
              )}
            </div>

            {/* Ações */}
            <div className="flex flex-col md:flex-row gap-6 justify-center mb-16">
              <button
                onClick={printInvoice}
                className="btn-primary"
              >
                Imprimir Fatura
              </button>
              <Link
                to="/"
                className="btn-secondary text-center"
              >
                Voltar ao Início
              </Link>
            </div>

            {/* Informações adicionais */}
            <div className="text-center">
              <p className="text-stone-grey text-sm font-sora">
                Em caso de dúvidas, entre em contato conosco através do email <strong>reservas@masperesidencial.com</strong><br />
                ou pelo telefone <strong>+244 000 000 000</strong>
              </p>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Confirmation;
