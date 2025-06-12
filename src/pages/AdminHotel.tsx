
import { useState } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AdminLayout } from '@/components/AdminLayout';
import { useAuth } from '@/hooks/useAuth';
import { useQuartosHotel } from '@/hooks/useQuartosHotel';
import { useReservasHotel } from '@/hooks/useReservasHotel';
import { QuartoForm } from '@/components/QuartoForm';
import { ReservasList } from '@/components/ReservasList';
import { ReservaPresencialForm } from '@/components/ReservaPresencialForm';
import { Plus, Edit, Trash2, BarChart3, Hotel, Calendar, Users, DollarSign, UserPlus } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import type { QuartoHotel } from '@/lib/supabase';

const AdminHotel = () => {
  return (
    <ProtectedRoute requiredRoles={['admin_hotel', 'admin_total']}>
      <AdminHotelContent />
    </ProtectedRoute>
  );
};

const AdminHotelContent = () => {
  const { profile } = useAuth();
  const { quartos, loading: loadingQuartos, criarQuarto, atualizarQuarto, excluirQuarto } = useQuartosHotel();
  const { reservas, loading: loadingReservas, carregarReservas } = useReservasHotel();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedQuarto, setSelectedQuarto] = useState<QuartoHotel | undefined>();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isReservaPresencialOpen, setIsReservaPresencialOpen] = useState(false);

  const stats = {
    totalQuartos: quartos.length,
    quartosDisponiveis: quartos.filter(q => q.status === 'disponivel').length,
    quartosOcupados: quartos.filter(q => q.status === 'ocupado').length,
    quartosManutencao: quartos.filter(q => q.status === 'manutencao').length,
    totalReservas: reservas.length,
    reservasAtivas: reservas.filter(r => r.status === 'confirmada').length,
    reservasPendentes: reservas.filter(r => r.status === 'pendente').length,
    receitaTotal: reservas
      .filter(r => r.status === 'confirmada' || r.status === 'concluida')
      .reduce((total, r) => total + r.valor_total, 0)
  };

  const handleNovoQuarto = () => {
    setSelectedQuarto(undefined);
    setIsFormOpen(true);
  };

  const handleEditarQuarto = (quarto: QuartoHotel) => {
    setSelectedQuarto(quarto);
    setIsFormOpen(true);
  };

  const handleSalvarQuarto = async (quartoData: Omit<QuartoHotel, 'id' | 'created_at'>) => {
    if (selectedQuarto) {
      return await atualizarQuarto(selectedQuarto.id, quartoData);
    } else {
      const result = await criarQuarto(quartoData);
      return result !== null;
    }
  };

  const handleExcluirQuarto = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este quarto? Esta ação não pode ser desfeita.')) {
      await excluirQuarto(id);
    }
  };

  const handleStatusChange = async (quartoId: string, novoStatus: 'disponivel' | 'ocupado' | 'manutencao') => {
    await atualizarQuarto(quartoId, { status: novoStatus });
  };

  const handleReservaPresencialSuccess = () => {
    carregarReservas();
    toast({
      title: "Reserva criada!",
      description: "Nova reserva presencial registrada com sucesso.",
    });
  };

  return (
    <AdminLayout 
      title="Gestão do Hotel"
      subtitle={`Bem-vindo, ${profile?.nome || profile?.email || 'Administrador'}`}
      showExecutiveLink={profile?.role === 'admin_total'}
    >
      {/* Navigation Tabs */}
      <div className="bg-pure-white rounded-lg shadow-sm mb-8">
        <div className="flex border-b border-stone-grey">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-4 font-sora font-medium transition-colors flex items-center space-x-2 ${
              activeTab === 'overview' 
                ? 'bg-charcoal text-pure-white border-b-2 border-charcoal' 
                : 'text-charcoal hover:bg-off-white'
            }`}
          >
            <BarChart3 className="w-5 h-5" />
            <span>Dashboard</span>
          </button>
          <button
            onClick={() => setActiveTab('quartos')}
            className={`px-6 py-4 font-sora font-medium transition-colors flex items-center space-x-2 ${
              activeTab === 'quartos' 
                ? 'bg-charcoal text-pure-white border-b-2 border-charcoal' 
                : 'text-charcoal hover:bg-off-white'
            }`}
          >
            <Hotel className="w-5 h-5" />
            <span>Quartos ({quartos.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('reservas')}
            className={`px-6 py-4 font-sora font-medium transition-colors flex items-center space-x-2 ${
              activeTab === 'reservas' 
                ? 'bg-charcoal text-pure-white border-b-2 border-charcoal' 
                : 'text-charcoal hover:bg-off-white'
            }`}
          >
            <Calendar className="w-5 h-5" />
            <span>Reservas ({reservas.length})</span>
          </button>
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Stats Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-pure-white p-6 rounded-lg shadow-sm border border-stone-grey">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-sora text-sm text-stone-grey">Total de Quartos</p>
                  <p className="font-sora text-3xl font-bold text-charcoal">{stats.totalQuartos}</p>
                </div>
                <Hotel className="w-12 h-12 text-charcoal opacity-20" />
              </div>
            </div>
            
            <div className="bg-pure-white p-6 rounded-lg shadow-sm border border-stone-grey">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-sora text-sm text-stone-grey">Quartos Disponíveis</p>
                  <p className="font-sora text-3xl font-bold text-green-600">{stats.quartosDisponiveis}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <div className="w-6 h-6 rounded-full bg-green-500"></div>
                </div>
              </div>
            </div>

            <div className="bg-pure-white p-6 rounded-lg shadow-sm border border-stone-grey">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-sora text-sm text-stone-grey">Reservas Ativas</p>
                  <p className="font-sora text-3xl font-bold text-blue-600">{stats.reservasAtivas}</p>
                </div>
                <Users className="w-12 h-12 text-blue-600 opacity-20" />
              </div>
            </div>

            <div className="bg-pure-white p-6 rounded-lg shadow-sm border border-stone-grey">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-sora text-sm text-stone-grey">Receita Total</p>
                  <p className="font-sora text-2xl font-bold text-green-600">
                    {stats.receitaTotal.toLocaleString('pt-AO')} Kz
                  </p>
                </div>
                <DollarSign className="w-12 h-12 text-green-600 opacity-20" />
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-pure-white p-6 rounded-lg shadow-sm border border-stone-grey">
            <h3 className="font-sora text-lg font-semibold text-charcoal mb-4">Ações Rápidas</h3>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={handleNovoQuarto}
                className="btn-primary flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Novo Quarto</span>
              </button>
              <button
                onClick={() => setIsReservaPresencialOpen(true)}
                className="btn-secondary flex items-center space-x-2"
              >
                <UserPlus className="w-5 h-5" />
                <span>Nova Reserva Presencial</span>
              </button>
            </div>
          </div>

          {/* Status Overview */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-pure-white p-6 rounded-lg shadow-sm border border-stone-grey">
              <h4 className="font-sora font-semibold text-charcoal mb-3">Status dos Quartos</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-sora text-sm text-stone-grey">Disponíveis</span>
                  <span className="font-sora text-sm font-medium text-green-600">{stats.quartosDisponiveis}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-sora text-sm text-stone-grey">Ocupados</span>
                  <span className="font-sora text-sm font-medium text-red-600">{stats.quartosOcupados}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-sora text-sm text-stone-grey">Manutenção</span>
                  <span className="font-sora text-sm font-medium text-yellow-600">{stats.quartosManutencao}</span>
                </div>
              </div>
            </div>

            <div className="bg-pure-white p-6 rounded-lg shadow-sm border border-stone-grey">
              <h4 className="font-sora font-semibold text-charcoal mb-3">Reservas</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-sora text-sm text-stone-grey">Confirmadas</span>
                  <span className="font-sora text-sm font-medium text-green-600">{stats.reservasAtivas}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-sora text-sm text-stone-grey">Pendentes</span>
                  <span className="font-sora text-sm font-medium text-yellow-600">{stats.reservasPendentes}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-sora text-sm text-stone-grey">Total</span>
                  <span className="font-sora text-sm font-medium text-charcoal">{stats.totalReservas}</span>
                </div>
              </div>
            </div>

            <div className="bg-pure-white p-6 rounded-lg shadow-sm border border-stone-grey">
              <h4 className="font-sora font-semibold text-charcoal mb-3">Ocupação</h4>
              <div className="text-center">
                <div className="text-3xl font-bold text-charcoal font-sora">
                  {stats.totalQuartos > 0 ? Math.round((stats.quartosOcupados / stats.totalQuartos) * 100) : 0}%
                </div>
                <p className="text-sm text-stone-grey font-sora">Taxa de Ocupação</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quartos Tab */}
      {activeTab === 'quartos' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="font-sora text-2xl font-bold text-charcoal">Gestão de Quartos</h2>
            <button onClick={handleNovoQuarto} className="btn-primary flex items-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Adicionar Quarto</span>
            </button>
          </div>

          {loadingQuartos ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-charcoal mx-auto"></div>
              <p className="mt-4 font-sora text-stone-grey">Carregando quartos...</p>
            </div>
          ) : quartos.length === 0 ? (
            <div className="bg-pure-white p-12 text-center rounded-lg border border-stone-grey">
              <Hotel className="w-16 h-16 text-stone-grey mx-auto mb-4" />
              <h3 className="font-sora text-xl font-semibold text-charcoal mb-2">Nenhum quarto cadastrado</h3>
              <p className="font-sora text-stone-grey mb-6">Comece adicionando o primeiro quarto do hotel.</p>
              <button onClick={handleNovoQuarto} className="btn-primary">
                Adicionar Primeiro Quarto
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {quartos.map((quarto) => (
                <div key={quarto.id} className="bg-pure-white rounded-lg shadow-sm overflow-hidden border border-stone-grey">
                  <div className="relative">
                    <img 
                      src={quarto.foto_url || '/placeholder.svg'} 
                      alt={quarto.nome}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-3 right-3">
                      <select
                        value={quarto.status}
                        onChange={(e) => handleStatusChange(quarto.id, e.target.value as any)}
                        className={`px-3 py-1 text-xs font-sora font-medium border-0 rounded-full ${
                          quarto.status === 'disponivel' ? 'bg-green-100 text-green-800' : 
                          quarto.status === 'ocupado' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        <option value="disponivel">Disponível</option>
                        <option value="ocupado">Ocupado</option>
                        <option value="manutencao">Manutenção</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-sora text-lg font-bold text-charcoal">
                          Quarto {quarto.numero_quarto}
                        </h3>
                        <h4 className="font-sora text-md font-semibold text-charcoal">
                          {quarto.nome}
                        </h4>
                      </div>
                    </div>
                    
                    <p className="font-sora text-sm text-stone-grey mb-4 line-clamp-2">
                      {quarto.descricao}
                    </p>
                    
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-sora text-lg font-bold text-charcoal">
                        {quarto.preco_noite.toLocaleString('pt-AO')} Kz
                      </span>
                      <span className="font-sora text-sm text-stone-grey">
                        até {quarto.capacidade} pessoas
                      </span>
                    </div>

                    {quarto.servicos && quarto.servicos.length > 0 && (
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-1">
                          {quarto.servicos.slice(0, 3).map((servico, index) => (
                            <span 
                              key={index}
                              className="px-2 py-1 bg-off-white text-xs font-sora text-charcoal rounded"
                            >
                              {servico}
                            </span>
                          ))}
                          {quarto.servicos.length > 3 && (
                            <span className="px-2 py-1 bg-off-white text-xs font-sora text-stone-grey rounded">
                              +{quarto.servicos.length - 3} mais
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleEditarQuarto(quarto)}
                        className="flex-1 btn-secondary text-sm py-2 flex items-center justify-center space-x-1"
                      >
                        <Edit className="w-4 h-4" />
                        <span>Editar</span>
                      </button>
                      <button 
                        onClick={() => handleExcluirQuarto(quarto.id)}
                        className="px-3 py-2 text-red-600 hover:bg-red-50 border border-red-200 rounded transition-colors flex items-center"
                      >
                        <Trash2 className="w-4 h-4" />
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
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="font-sora text-2xl font-bold text-charcoal">Gestão de Reservas</h2>
            <button
              onClick={() => setIsReservaPresencialOpen(true)}
              className="btn-primary flex items-center space-x-2"
            >
              <UserPlus className="w-5 h-5" />
              <span>Nova Reserva Presencial</span>
            </button>
          </div>
          <ReservasList />
        </div>
      )}

      {/* Modais */}
      <QuartoForm
        quarto={selectedQuarto}
        onSave={handleSalvarQuarto}
        onCancel={() => setIsFormOpen(false)}
        isOpen={isFormOpen}
      />

      {isReservaPresencialOpen && (
        <ReservaPresencialForm
          onClose={() => setIsReservaPresencialOpen(false)}
          onSuccess={handleReservaPresencialSuccess}
        />
      )}
    </AdminLayout>
  );
};

export default AdminHotel;
