
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Plus, Edit, Trash2, Eye, Users, Calendar, DollarSign } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Room {
  id: number;
  name: string;
  image: string;
  description: string;
  status: 'Disponível' | 'Ocupado';
  features: string[];
  price: number;
}

interface Booking {
  id: string;
  transactionId: string;
  guest: any;
  suite: string;
  totalAmount: number;
  paymentStatus: string;
  bookingDate: string;
  status: string;
}

const AdminDashboard = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [showAddRoom, setShowAddRoom] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const [roomForm, setRoomForm] = useState({
    name: '',
    image: '',
    description: '',
    status: 'Disponível' as 'Disponível' | 'Ocupado',
    features: [''],
    price: 0
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    // Load rooms
    const savedRooms = localStorage.getItem('maspe_rooms');
    if (savedRooms) {
      setRooms(JSON.parse(savedRooms));
    } else {
      // Initialize with default rooms if none exist
      initializeDefaultRooms();
    }

    // Load bookings
    const savedBookings = localStorage.getItem('maspe_bookings');
    if (savedBookings) {
      setBookings(JSON.parse(savedBookings));
    }
  };

  const initializeDefaultRooms = () => {
    const defaultRooms = [
      {
        id: 1,
        name: 'Suíte Presidencial Deluxe',
        image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
        description: 'Nossa suíte mais luxuosa com vista panorâmica da cidade, sala de estar separada, banheiro com banheira de hidromassagem e serviço de mordomo 24h.',
        status: 'Disponível' as 'Disponível',
        features: ['120m²', 'Vista panorâmica', 'Banheira de hidromassagem', 'Serviço de mordomo'],
        price: 299000
      }
    ];
    
    setRooms(defaultRooms);
    localStorage.setItem('maspe_rooms', JSON.stringify(defaultRooms));
  };

  const handleRoomFormChange = (field: string, value: any) => {
    setRoomForm(prev => ({ ...prev, [field]: value }));
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...roomForm.features];
    newFeatures[index] = value;
    setRoomForm(prev => ({ ...prev, features: newFeatures }));
  };

  const addFeature = () => {
    setRoomForm(prev => ({ ...prev, features: [...prev.features, ''] }));
  };

  const removeFeature = (index: number) => {
    const newFeatures = roomForm.features.filter((_, i) => i !== index);
    setRoomForm(prev => ({ ...prev, features: newFeatures }));
  };

  const saveRoom = () => {
    if (!roomForm.name || !roomForm.description || !roomForm.price) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    const validFeatures = roomForm.features.filter(f => f.trim() !== '');
    
    if (editingRoom) {
      // Update existing room
      const updatedRooms = rooms.map(room => 
        room.id === editingRoom.id 
          ? { ...roomForm, id: editingRoom.id, features: validFeatures }
          : room
      );
      setRooms(updatedRooms);
      localStorage.setItem('maspe_rooms', JSON.stringify(updatedRooms));
      setEditingRoom(null);
    } else {
      // Add new room
      const newRoom = {
        ...roomForm,
        id: Date.now(),
        features: validFeatures
      };
      const updatedRooms = [...rooms, newRoom];
      setRooms(updatedRooms);
      localStorage.setItem('maspe_rooms', JSON.stringify(updatedRooms));
      setShowAddRoom(false);
    }

    // Reset form
    setRoomForm({
      name: '',
      image: '',
      description: '',
      status: 'Disponível',
      features: [''],
      price: 0
    });

    toast({
      title: "Sucesso",
      description: editingRoom ? "Quarto atualizado com sucesso!" : "Quarto adicionado com sucesso!",
    });
  };

  const deleteRoom = (id: number) => {
    if (confirm('Tem certeza que deseja excluir este quarto?')) {
      const updatedRooms = rooms.filter(room => room.id !== id);
      setRooms(updatedRooms);
      localStorage.setItem('maspe_rooms', JSON.stringify(updatedRooms));
      
      toast({
        title: "Sucesso",
        description: "Quarto excluído com sucesso!",
      });
    }
  };

  const startEditing = (room: Room) => {
    setEditingRoom(room);
    setRoomForm({
      name: room.name,
      image: room.image,
      description: room.description,
      status: room.status,
      features: [...room.features, ''],
      price: room.price
    });
  };

  const cancelEditing = () => {
    setEditingRoom(null);
    setShowAddRoom(false);
    setRoomForm({
      name: '',
      image: '',
      description: '',
      status: 'Disponível',
      features: [''],
      price: 0
    });
  };

  const stats = {
    totalRooms: rooms.length,
    availableRooms: rooms.filter(r => r.status === 'Disponível').length,
    totalBookings: bookings.length,
    pendingPayments: bookings.filter(b => b.paymentStatus === 'pending').length
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-32">
        <section className="py-16 bg-off-white min-h-screen">
          <div className="container">
            <div className="text-center mb-12">
              <h1 className="font-sora text-4xl md:text-5xl font-bold text-charcoal mb-6">
                Painel Administrativo
              </h1>
              <p className="font-sora text-xl text-stone-grey">
                Gerencie quartos, reservas e conteúdo do site
              </p>
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
                  onClick={() => setActiveTab('rooms')}
                  className={`px-6 py-3 font-sora font-semibold transition-colors ${
                    activeTab === 'rooms' 
                      ? 'bg-charcoal text-pure-white' 
                      : 'text-charcoal hover:bg-off-white'
                  }`}
                >
                  Gestão de Quartos
                </button>
                <button
                  onClick={() => setActiveTab('bookings')}
                  className={`px-6 py-3 font-sora font-semibold transition-colors ${
                    activeTab === 'bookings' 
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
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-pure-white p-6 shadow-lg text-center">
                  <Users className="w-12 h-12 text-charcoal mx-auto mb-4" />
                  <h3 className="font-sora text-2xl font-bold text-charcoal">{stats.totalRooms}</h3>
                  <p className="font-sora text-stone-grey">Total de Quartos</p>
                </div>
                <div className="bg-pure-white p-6 shadow-lg text-center">
                  <Eye className="w-12 h-12 text-green-600 mx-auto mb-4" />
                  <h3 className="font-sora text-2xl font-bold text-charcoal">{stats.availableRooms}</h3>
                  <p className="font-sora text-stone-grey">Quartos Disponíveis</p>
                </div>
                <div className="bg-pure-white p-6 shadow-lg text-center">
                  <Calendar className="w-12 h-12 text-charcoal mx-auto mb-4" />
                  <h3 className="font-sora text-2xl font-bold text-charcoal">{stats.totalBookings}</h3>
                  <p className="font-sora text-stone-grey">Total de Reservas</p>
                </div>
                <div className="bg-pure-white p-6 shadow-lg text-center">
                  <DollarSign className="w-12 h-12 text-orange-600 mx-auto mb-4" />
                  <h3 className="font-sora text-2xl font-bold text-charcoal">{stats.pendingPayments}</h3>
                  <p className="font-sora text-stone-grey">Pagamentos Pendentes</p>
                </div>
              </div>
            )}

            {/* Rooms Tab */}
            {activeTab === 'rooms' && (
              <div>
                <div className="flex justify-between items-center mb-8">
                  <h2 className="font-sora text-3xl font-bold text-charcoal">Gestão de Quartos</h2>
                  <button
                    onClick={() => setShowAddRoom(true)}
                    className="btn-primary flex items-center space-x-2"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Adicionar Quarto</span>
                  </button>
                </div>

                {/* Room Form Modal */}
                {(showAddRoom || editingRoom) && (
                  <div className="bg-pure-white p-8 shadow-lg mb-8">
                    <h3 className="font-sora text-2xl font-bold text-charcoal mb-6">
                      {editingRoom ? 'Editar Quarto' : 'Adicionar Novo Quarto'}
                    </h3>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="floating-label">
                        <input
                          type="text"
                          id="roomName"
                          value={roomForm.name}
                          onChange={(e) => handleRoomFormChange('name', e.target.value)}
                          placeholder=" "
                        />
                        <label htmlFor="roomName">Nome do Quarto *</label>
                      </div>

                      <div className="floating-label">
                        <input
                          type="number"
                          id="roomPrice"
                          value={roomForm.price || ''}
                          onChange={(e) => handleRoomFormChange('price', Number(e.target.value))}
                          placeholder=" "
                        />
                        <label htmlFor="roomPrice">Preço por Noite (Kz) *</label>
                      </div>

                      <div className="md:col-span-2 floating-label">
                        <input
                          type="url"
                          id="roomImage"
                          value={roomForm.image}
                          onChange={(e) => handleRoomFormChange('image', e.target.value)}
                          placeholder=" "
                        />
                        <label htmlFor="roomImage">URL da Imagem</label>
                      </div>

                      <div className="md:col-span-2 floating-label">
                        <textarea
                          id="roomDescription"
                          value={roomForm.description}
                          onChange={(e) => handleRoomFormChange('description', e.target.value)}
                          placeholder=" "
                          rows={4}
                        />
                        <label htmlFor="roomDescription">Descrição *</label>
                      </div>

                      <div className="floating-label">
                        <select
                          id="roomStatus"
                          value={roomForm.status}
                          onChange={(e) => handleRoomFormChange('status', e.target.value)}
                        >
                          <option value="Disponível">Disponível</option>
                          <option value="Ocupado">Ocupado</option>
                        </select>
                        <label htmlFor="roomStatus">Status</label>
                      </div>
                    </div>

                    <div className="mt-6">
                      <h4 className="font-sora text-lg font-semibold text-charcoal mb-4">Características</h4>
                      {roomForm.features.map((feature, index) => (
                        <div key={index} className="flex space-x-2 mb-2">
                          <input
                            type="text"
                            value={feature}
                            onChange={(e) => handleFeatureChange(index, e.target.value)}
                            placeholder="Ex: 50m², Wi-Fi premium..."
                            className="flex-1 px-4 py-2 border border-stone-grey focus:border-charcoal focus:outline-none"
                          />
                          {roomForm.features.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeFeature(index)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={addFeature}
                        className="text-charcoal hover:text-stone-grey font-sora text-sm"
                      >
                        + Adicionar característica
                      </button>
                    </div>

                    <div className="flex space-x-4 mt-8">
                      <button onClick={saveRoom} className="btn-primary">
                        {editingRoom ? 'Atualizar' : 'Salvar'} Quarto
                      </button>
                      <button onClick={cancelEditing} className="btn-secondary">
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}

                {/* Rooms List */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {rooms.map((room) => (
                    <div key={room.id} className="bg-pure-white shadow-lg overflow-hidden">
                      <img 
                        src={room.image} 
                        alt={room.name}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-6">
                        <h3 className="font-sora text-lg font-bold text-charcoal mb-2">{room.name}</h3>
                        <p className="font-sora text-sm text-stone-grey mb-4 line-clamp-2">{room.description}</p>
                        <div className="flex justify-between items-center mb-4">
                          <span className={`px-2 py-1 text-xs font-sora ${
                            room.status === 'Disponível' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {room.status}
                          </span>
                          <span className="font-sora font-semibold text-charcoal">
                            {room.price.toLocaleString('pt-AO')} Kz
                          </span>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => startEditing(room)}
                            className="flex items-center space-x-1 text-charcoal hover:text-stone-grey"
                          >
                            <Edit className="w-4 h-4" />
                            <span className="font-sora text-sm">Editar</span>
                          </button>
                          <button
                            onClick={() => deleteRoom(room.id)}
                            className="flex items-center space-x-1 text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span className="font-sora text-sm">Excluir</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bookings Tab */}
            {activeTab === 'bookings' && (
              <div>
                <h2 className="font-sora text-3xl font-bold text-charcoal mb-8">Reservas Recentes</h2>
                
                {bookings.length > 0 ? (
                  <div className="bg-pure-white shadow-lg overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-off-white">
                          <tr>
                            <th className="px-6 py-3 text-left font-sora font-semibold text-charcoal">ID</th>
                            <th className="px-6 py-3 text-left font-sora font-semibold text-charcoal">Hóspede</th>
                            <th className="px-6 py-3 text-left font-sora font-semibold text-charcoal">Suíte</th>
                            <th className="px-6 py-3 text-left font-sora font-semibold text-charcoal">Total</th>
                            <th className="px-6 py-3 text-left font-sora font-semibold text-charcoal">Status</th>
                            <th className="px-6 py-3 text-left font-sora font-semibold text-charcoal">Data</th>
                          </tr>
                        </thead>
                        <tbody>
                          {bookings.map((booking) => (
                            <tr key={booking.id} className="border-t">
                              <td className="px-6 py-4 font-sora text-sm text-charcoal">{booking.transactionId}</td>
                              <td className="px-6 py-4 font-sora text-sm text-charcoal">{booking.guest.nomeCompleto}</td>
                              <td className="px-6 py-4 font-sora text-sm text-charcoal">{booking.suite}</td>
                              <td className="px-6 py-4 font-sora text-sm text-charcoal">{booking.totalAmount.toLocaleString('pt-AO')} Kz</td>
                              <td className="px-6 py-4">
                                <span className={`px-2 py-1 text-xs font-sora ${
                                  booking.paymentStatus === 'paid' 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-orange-100 text-orange-800'
                                }`}>
                                  {booking.paymentStatus === 'paid' ? 'Pago' : 'Pendente'}
                                </span>
                              </td>
                              <td className="px-6 py-4 font-sora text-sm text-stone-grey">
                                {new Date(booking.bookingDate).toLocaleDateString('pt-AO')}
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
                    <h3 className="font-sora text-xl font-bold text-charcoal mb-2">Nenhuma reserva encontrada</h3>
                    <p className="font-sora text-stone-grey">As reservas aparecerão aqui quando os clientes fizerem pedidos.</p>
                  </div>
                )}
              </div>
            )}

            <div className="text-center mt-12">
              <Link to="/" className="btn-secondary">
                ← Voltar ao Site Principal
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminDashboard;
