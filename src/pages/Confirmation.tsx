
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
        <main className="pt-20 py-16">
          <div className="container mx-auto px-6 text-center">
            <h1 className="font-playfair text-4xl font-bold text-charcoal mb-4">
              Reserva não encontrada
            </h1>
            <Link to="/" className="text-charcoal hover:text-stone-grey">
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
      
      <main className="pt-20">
        <section className="py-16 bg-off-white">
          <div className="container mx-auto px-6 max-w-4xl">
            {/* Confirmação */}
            <div className="text-center mb-12">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                ✓
              </div>
              <h1 className="font-playfair text-4xl md:text-5xl font-bold text-charcoal mb-4">
                Reserva Confirmada!
              </h1>
              <p className="font-inter text-xl text-stone-grey">
                Pagamento processado com sucesso. Sua reserva foi confirmada.
              </p>
            </div>

            {/* Fatura/Recibo */}
            <div className="bg-pure-white p-8 mb-8" id="invoice">
              <div className="border-b border-stone-grey pb-6 mb-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="font-playfair text-3xl font-bold text-charcoal mb-2">
                      Maspe Residencial
                    </h2>
                    <p className="text-stone-grey">
                      Sofisticação que Acolhe<br />
                      Rua da Elegância, 123<br />
                      Lisboa, Portugal
                    </p>
                  </div>
                  <div className="text-right">
                    <h3 className="font-inter text-xl font-bold text-charcoal mb-2">
                      FATURA/RECIBO
                    </h3>
                    <p className="text-stone-grey text-sm">
                      Nº: {booking.id}<br />
                      Data: {new Date(booking.bookingDate).toLocaleDateString('pt-PT')}<br />
                      Transação: {booking.transactionId}
                    </p>
                  </div>
                </div>
              </div>

              {/* Dados do Cliente */}
              <div className="mb-6">
                <h4 className="font-inter font-bold text-charcoal mb-3">Dados do Hóspede:</h4>
                <div className="text-stone-grey">
                  <p><strong>Nome:</strong> {booking.guest.nomeCompleto}</p>
                  <p><strong>Email:</strong> {booking.guest.email}</p>
                  <p><strong>Telefone:</strong> {booking.guest.telefone}</p>
                  {booking.guest.endereco && (
                    <p><strong>Endereço:</strong> {booking.guest.endereco}, {booking.guest.cidade}, {booking.guest.cep}</p>
                  )}
                </div>
              </div>

              {/* Detalhes da Reserva */}
              <div className="mb-6">
                <h4 className="font-inter font-bold text-charcoal mb-3">Detalhes da Reserva:</h4>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-stone-grey">
                        <th className="text-left py-2 font-inter font-bold text-charcoal">Descrição</th>
                        <th className="text-center py-2 font-inter font-bold text-charcoal">Quantidade</th>
                        <th className="text-right py-2 font-inter font-bold text-charcoal">Preço Unit.</th>
                        <th className="text-right py-2 font-inter font-bold text-charcoal">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="py-3 text-stone-grey">
                          {booking.suite}<br />
                          <small>
                            {new Date(booking.guest.dataEntrada).toLocaleDateString('pt-PT')} - {new Date(booking.guest.dataSaida).toLocaleDateString('pt-PT')}<br />
                            {booking.guest.numeroHospedes} hóspede(s)
                          </small>
                        </td>
                        <td className="py-3 text-center text-stone-grey">{booking.nights} noite(s)</td>
                        <td className="py-3 text-right text-stone-grey">€{booking.pricePerNight}</td>
                        <td className="py-3 text-right text-charcoal font-bold">€{booking.totalAmount}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Total */}
              <div className="border-t border-stone-grey pt-4">
                <div className="flex justify-between items-center">
                  <span className="font-inter text-lg text-stone-grey">Total Pago:</span>
                  <span className="font-playfair text-2xl font-bold text-charcoal">€{booking.totalAmount}</span>
                </div>
                <p className="text-sm text-stone-grey mt-2">
                  Método de Pagamento: Cartão de Crédito<br />
                  Status: <span className="text-green-600 font-bold">PAGO</span>
                </p>
              </div>

              {/* Observações */}
              {booking.guest.observacoes && (
                <div className="mt-6 pt-4 border-t border-stone-grey">
                  <h4 className="font-inter font-bold text-charcoal mb-2">Observações:</h4>
                  <p className="text-stone-grey">{booking.guest.observacoes}</p>
                </div>
              )}
            </div>

            {/* Ações */}
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <button
                onClick={printInvoice}
                className="bg-charcoal text-pure-white px-6 py-3 font-inter font-semibold hover:bg-opacity-90 transition-colors duration-300"
              >
                Imprimir Fatura
              </button>
              <Link
                to="/"
                className="bg-pure-white text-charcoal border border-charcoal px-6 py-3 font-inter font-semibold hover:bg-charcoal hover:text-pure-white transition-colors duration-300 text-center"
              >
                Voltar ao Início
              </Link>
            </div>

            {/* Informações adicionais */}
            <div className="mt-12 text-center">
              <p className="text-stone-grey text-sm">
                Em caso de dúvidas, entre em contato conosco através do email <strong>reservas@masperesidencial.com</strong><br />
                ou pelo telefone <strong>+351 21 000 0000</strong>
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
