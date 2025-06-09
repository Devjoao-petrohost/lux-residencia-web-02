
import { CheckCircle } from 'lucide-react';

interface InvoiceProps {
  bookingData: {
    transactionId: string;
    referenceNumber: string;
    guest: {
      nomeCompleto: string;
      bi: string;
      telefone: string;
      email: string;
    };
    suite: string;
    checkIn: string;
    checkOut: string;
    numberOfGuests: string;
    totalAmount: number;
    paymentMethod: string;
  };
}

const Invoice = ({ bookingData }: InvoiceProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-AO');
  };

  const getPaymentMethodText = (method: string) => {
    switch (method) {
      case 'transferencia':
        return 'Transferência Bancária';
      case 'multicaixa':
        return 'Pagamento por Referência (Multicaixa Express)';
      default:
        return method;
    }
  };

  return (
    <div className="max-w-md mx-auto bg-pure-white p-8 shadow-lg border border-stone-grey">
      {/* Header */}
      <div className="text-center mb-6 border-b border-stone-grey pb-4">
        <h1 className="font-sora text-2xl font-bold text-charcoal mb-2">
          Maspe Residencial
        </h1>
        <p className="font-sora text-sm text-stone-grey">
          Fatura de Reserva
        </p>
      </div>

      {/* Status */}
      <div className="flex items-center justify-center mb-6">
        <CheckCircle className="w-6 h-6 text-green-600 mr-2" />
        <span className="font-sora font-semibold text-green-600">
          Reserva Confirmada
        </span>
      </div>

      {/* Booking Details */}
      <div className="mb-6">
        <h3 className="font-sora text-lg font-bold text-charcoal mb-3 border-b border-stone-grey pb-1">
          Detalhes da Reserva
        </h3>
        
        <div className="space-y-2 font-sora text-sm">
          <div className="flex justify-between">
            <span className="text-stone-grey">ID Transação:</span>
            <span className="text-charcoal font-medium">{bookingData.transactionId}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-stone-grey">Referência:</span>
            <span className="text-charcoal font-medium">{bookingData.referenceNumber}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-stone-grey">Suíte:</span>
            <span className="text-charcoal font-medium">{bookingData.suite}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-stone-grey">Check-in:</span>
            <span className="text-charcoal">{formatDate(bookingData.checkIn)}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-stone-grey">Check-out:</span>
            <span className="text-charcoal">{formatDate(bookingData.checkOut)}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-stone-grey">Pessoas:</span>
            <span className="text-charcoal">{bookingData.numberOfGuests}</span>
          </div>
        </div>
      </div>

      {/* Guest Details */}
      <div className="mb-6">
        <h3 className="font-sora text-lg font-bold text-charcoal mb-3 border-b border-stone-grey pb-1">
          Dados do Hóspede
        </h3>
        
        <div className="space-y-2 font-sora text-sm">
          <div className="flex justify-between">
            <span className="text-stone-grey">Nome:</span>
            <span className="text-charcoal font-medium">{bookingData.guest.nomeCompleto}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-stone-grey">BI:</span>
            <span className="text-charcoal">{bookingData.guest.bi}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-stone-grey">Telefone:</span>
            <span className="text-charcoal">{bookingData.guest.telefone}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-stone-grey">Email:</span>
            <span className="text-charcoal">{bookingData.guest.email}</span>
          </div>
        </div>
      </div>

      {/* Payment Details */}
      <div className="mb-6">
        <h3 className="font-sora text-lg font-bold text-charcoal mb-3 border-b border-stone-grey pb-1">
          Pagamento
        </h3>
        
        <div className="space-y-2 font-sora text-sm">
          <div className="flex justify-between">
            <span className="text-stone-grey">Método:</span>
            <span className="text-charcoal">{getPaymentMethodText(bookingData.paymentMethod)}</span>
          </div>
          
          <div className="flex justify-between items-center pt-2 border-t border-stone-grey">
            <span className="text-charcoal font-bold">Total:</span>
            <span className="text-charcoal font-bold text-lg">
              {bookingData.totalAmount.toLocaleString('pt-AO')} Kz
            </span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center border-t border-stone-grey pt-4">
        <p className="font-sora text-xs text-stone-grey mb-2">
          Obrigado por escolher o Maspe Residencial
        </p>
        <p className="font-sora text-xs text-stone-grey">
          reservas@masperesidencial.ao | +244 222 123 456
        </p>
      </div>
    </div>
  );
};

export default Invoice;
