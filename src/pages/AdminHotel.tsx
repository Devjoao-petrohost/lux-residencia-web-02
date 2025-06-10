
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/hooks/useAuth';
import { useQuartosHotel } from '@/hooks/useQuartosHotel';
import { useReservasHotel } from '@/hooks/useReservasHotel';
import { Plus, Edit, Trash2, Eye, Users, Calendar, DollarSign, Hotel } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const AdminHotel = () => {
  return (
    <ProtectedRoute requiredRoles={['admin_hotel', 'admin_total']}>
      <AdminHotelContent />
    </ProtectedRoute>
  );
};

const AdminHotelContent = () => {
  const { profile, signOut } = useAuth();
  const { quartos, loading: loadingQuartos, criarQuarto, atualizarQuarto, excluirQuarto } = useQuartosHotel();
  const { reservas, loading: loadingReservas } = useReservasHotel();
  const [activeTab, setActiveTab] = useState('overview');

  const stats = {
    totalQuartos: quartos.length,
    quartosDisponiveis: quartos.filter(q => q.status === 'disponivel').length,
    totalReservas: reservas.length,
    reservasAtivas: reservas.filter(r => r.status === 'confirmada').length
  };

  const handleLogout = async () => {
    await signOut();
    toast({
      title: "Logout realizado",
      description: "Até breve!",
    });
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-32">
        <section className="py-16 bg-off-white min-h-screen">
          <div className="container">
            <div className="flex justify-between items-center mb-12">
              <div>
                <h1 className="font-sora text-4xl md:text-5xl font-bold text-charcoal mb-4">
                  Painel do Hotel
                </h1>
                <p className="font-sora text-xl text-stone-grey">
                  Bem-vindo, {profile?.nome}
                </p>
              </div>
              <div className="flex space-x-4">
                <Link to="/" className="btn-secondary">
                  ← Site Principal
                </Link>
                <button onClick={handleLogout} className="btn-primary">
                  Sair
                </button>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="bg-pure-white p-2 shadow-lg mb-8">
              <div className="flex space-x-2">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`px-6 py-3 font-sora font-semibold transition-colors ${
                    activeTab === 'overview' 
                      ? 'bg-charcoal text-pure-white' 
                      : 'text-charcoal hover:bg-off-white'
                  }`}
                >
                  Visão Geral
                </button>
                <button
                  onClick={() => setActiveTab('quartos')}
                  className={`px-6 py-3 font-sora font-semibold transition-colors ${
                    activeTab === 'quartos' 
                      ? 'bg-charcoal text-pure-white' 
                      : 'text-charcoal hover:bg-off-white'
                  }`}
                >
                  Gestão de Quartos
                </button>
                <button
                  onClick={() => setActiveTab('reservas')}
                  className={`px-6 py-3 font-sora font-semibold transition-colors ${
                    activeTab === 'reservas' 
                      ? 'bg-charcoal text-pure-white' 
                      : 'text-charcoal hover:bg-off-white'
                  }`}
                >
                  Reservas
                </button>
              </div>
            </div>

            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-pure-white p-6 shadow-lg text-center">
                  <Hotel className="w-12 h-12 text-charcoal mx-auto mb-4" />
                  <h3 className="font-sora text-2xl font-bold text-charcoal">{stats.totalQuartos}</h3>
                  <p className="font-sora text-stone-grey">Total de Quartos</p>
                </div>
                <div className="bg-pure-white p-6 shadow-lg text-center">
                  <Eye className="w-12 h-12 text-green-600 mx-auto mb-4" />
                  <h3 className="font-sora text-2xl font-bold text-charcoal">{stats.quartosDisponiveis}</h3>
                  <p className="font-sora text-stone-grey">Quartos Disponíveis</p>
                </div>
                <div className="bg-pure-white p-6 shadow-lg text-center">
                  <Calendar className="w-12 h-12 text-charcoal mx-auto mb-4" />
                  <h3 className="font-sora text-2xl font-bold text-charcoal">{stats.totalReservas}</h3>
                  <p className="font-sora text-stone-grey">Total de Reservas</p>
                </div>
                <div className="bg-pure-white p-6 shadow-lg text-center">
                  <Users className="w-12 h-12 text-orange-600 mx-auto mb-4" />
                  <h3 className="font-sora text-2xl font-bold text-charcoal">{stats.reservasAtivas}</h3>
                  <p className="font-sora text-stone-grey">Reservas Ativas</p>
                </div>
              </div>
            )}

            {/* Quartos Tab */}
            {activeTab === 'quartos' && (
              <div>
                <div className="flex justify-between items-center mb-8">
                  <h2 className="font-sora text-3xl font-bold text-charcoal">Gestão de Quartos</h2>
                  <button className="btn-primary flex items-center space-x-2">
                    <Plus className="w-5 h-5" />
                    <span>Adicionar Quarto</span>
                  </button>
                </div>

                {loadingQuartos ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-charcoal mx-auto"></div>
                    <p className="mt-4 font-sora text-stone-grey">Carregando quartos...</p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {quartos.map((quarto) => (
                      <div key={quarto.id} className="bg-pure-white shadow-lg overflow-hidden border border-stone-grey">
                        <img 
                          src={quarto.foto_url} 
                          alt={quarto.nome}
                          className="w-full h-48 object-cover"
                        />
                        <div className="p-6">
                          <h3 className="font-sora text-lg font-bold text-charcoal mb-2">
                            Quarto {quarto.numero_quarto}
                          </h3>
                          <h4 className="font-sora text-md font-semibold text-charcoal mb-2">
                            {quarto.nome}
                          </h4>
                          <p className="font-sora text-sm text-stone-grey mb-4 line-clamp-2">
                            {quarto.descricao}
                          </p>
                          <div className="flex justify-between items-center mb-4">
                            <span className={`px-2 py-1 text-xs font-sora ${
                              quarto.status === 'disponivel' ? 'bg-green-100 text-green-800' : 
                              quarto.status === 'ocupado' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {quarto.status === 'disponivel' ? 'Disponível' :
                               quarto.status === 'ocupado' ? 'Ocupado' : 'Manutenção'}
                            </span>
                            <span className="font-sora font-semibold text-charcoal">
                              {quarto.preco_noite.toLocaleString('pt-AO')} Kz
                            </span>
                          </div>
                          <p className="font-sora text-sm text-stone-grey mb-4">
                            Capacidade: {quarto.capacidade} pessoas
                          </p>
                          <div className="flex space-x-2">
                            <button className="flex items-center space-x-1 text-charcoal hover:text-stone-grey">
                              <Edit className="w-4 h-4" />
                              <span className="font-sora text-sm">Editar</span>
                            </button>
                            <button className="flex items-center space-x-1 text-red-600 hover:text-red-800">
                              <Trash2 className="w-4 h-4" />
                              <span className="font-sora text-sm">Excluir</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Reservas Tab */}
            {activeTab === 'reservas' && (
              <div>
                <h2 className="font-sora text-3xl font-bold text-charcoal mb-8">Reservas</h2>
                
                {loadingReservas ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-charcoal mx-auto"></div>
                    <p className="mt-4 font-sora text-stone-grey">Carregando reservas...</p>
                  </div>
                ) : reservas.length > 0 ? (
                  <div className="bg-pure-white shadow-lg overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-off-white">
                          <tr>
                            <th className="px-6 py-3 text-left font-sora font-semibold text-charcoal">Hóspede</th>
                            <th className="px-6 py-3 text-left font-sora font-semibold text-charcoal">Quarto</th>
                            <th className="px-6 py-3 text-left font-sora font-semibold text-charcoal">Check-in</th>
                            <th className="px-6 py-3 text-left font-sora font-semibold text-charcoal">Check-out</th>
                            <th className="px-6 py-3 text-left font-sora font-semibold text-charcoal">Pessoas</th>
                            <th className="px-6 py-3 text-left font-sora font-semibold text-charcoal">Total</th>
                            <th className="px-6 py-3 text-left font-sora font-semibold text-charcoal">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {reservas.map((reserva) => (
                            <tr key={reserva.id} className="border-t">
                              <td className="px-6 py-4 font-sora text-sm text-charcoal">
                                {reserva.nome_hospede}
                              </td>
                              <td className="px-6 py-4 font-sora text-sm text-charcoal">
                                {reserva.quarto_id}
                              </td>
                              <td className="px-6 py-4 font-sora text-sm text-charcoal">
                                {new Date(reserva.data_checkin).toLocaleDateString('pt-AO')}
                              </td>
                              <td className="px-6 py-4 font-sora text-sm text-charcoal">
                                {new Date(reserva.data_checkout).toLocaleDateString('pt-AO')}
                              </td>
                              <td className="px-6 py-4 font-sora text-sm text-charcoal">
                                {reserva.numero_pessoas}
                              </td>
                              <td className="px-6 py-4 font-sora text-sm text-charcoal">
                                {reserva.valor_total.toLocaleString('pt-AO')} Kz
                              </td>
                              <td className="px-6 py-4">
                                <span className={`px-2 py-1 text-xs font-sora ${
                                  reserva.status === 'confirmada' ? 'bg-green-100 text-green-800' :
                                  reserva.status === 'pendente' ? 'bg-yellow-100 text-yellow-800' :
                                  reserva.status === 'cancelada' ? 'bg-red-100 text-red-800' :
                                  'bg-blue-100 text-blue-800'
                                }`}>
                                  {reserva.status === 'confirmada' ? 'Confirmada' :
                                   reserva.status === 'pendente' ? 'Pendente' :
                                   reserva.status === 'cancelada' ? 'Cancelada' : 'Concluída'}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="bg-pure-white p-12 shadow-lg text-center">
                    <Calendar className="w-16 h-16 text-stone-grey mx-auto mb-4" />
                    <h3 className="font-sora text-xl font-bold text-charcoal mb-2">
                      Nenhuma reserva encontrada
                    </h3>
                    <p className="font-sora text-stone-grey">
                      As reservas aparecerão aqui quando os clientes fizerem pedidos.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminHotel;
