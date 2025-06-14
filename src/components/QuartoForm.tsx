
import { useState, useEffect } from 'react';
import { X, Save, Upload, Eye } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import type { QuartoHotel } from '@/lib/supabase';

interface QuartoFormProps {
  quarto?: QuartoHotel;
  onSave: (quarto: Omit<QuartoHotel, 'id' | 'created_at' | 'updated_at'>) => Promise<boolean>;
  onCancel: () => void;
  isOpen: boolean;
}

export function QuartoForm({ quarto, onSave, onCancel, isOpen }: QuartoFormProps) {
  const [formData, setFormData] = useState({
    numero_quarto: quarto?.numero_quarto || '',
    nome: quarto?.nome || '',
    descricao: quarto?.descricao || '',
    preco_noite: quarto?.preco_noite || 0,
    capacidade: quarto?.capacidade || 1,
    foto_url: quarto?.foto_url || '',
    status: quarto?.status || 'disponivel' as const,
    servicos: quarto?.servicos || []
  });

  const [servicosInput, setServicosInput] = useState(
    quarto?.servicos?.join(', ') || ''
  );

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (quarto) {
      setFormData({
        numero_quarto: quarto.numero_quarto || '',
        nome: quarto.nome || '',
        descricao: quarto.descricao || '',
        preco_noite: quarto.preco_noite || 0,
        capacidade: quarto.capacidade || 1,
        foto_url: quarto.foto_url || '',
        status: quarto.status || 'disponivel',
        servicos: quarto.servicos || []
      });
      setServicosInput(quarto.servicos?.join(', ') || '');
    }
  }, [quarto]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.numero_quarto.trim()) {
      newErrors.numero_quarto = 'Número do quarto é obrigatório';
    }

    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome do quarto é obrigatório';
    }

    if (formData.preco_noite <= 0) {
      newErrors.preco_noite = 'Preço deve ser maior que zero';
    }

    if (formData.capacidade < 1) {
      newErrors.capacidade = 'Capacidade deve ser pelo menos 1 pessoa';
    }

    if (formData.foto_url && !isValidUrl(formData.foto_url)) {
      newErrors.foto_url = 'URL da foto inválida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Formulário inválido",
        description: "Por favor, corrija os erros antes de continuar.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const servicosArray = servicosInput
        .split(',')
        .map(s => s.trim())
        .filter(s => s.length > 0);

      const success = await onSave({
        ...formData,
        servicos: servicosArray
      });

      if (success) {
        toast({
          title: quarto ? "Quarto atualizado!" : "Quarto criado!",
          description: `Quarto ${formData.numero_quarto} ${quarto ? 'atualizado' : 'criado'} com sucesso.`,
        });
        onCancel();
      }
    } catch (error) {
      console.error('Erro ao salvar quarto:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar o quarto. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-pure-white rounded-lg shadow-xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-stone-grey">
          <h2 className="font-sora text-2xl font-bold text-charcoal">
            {quarto ? 'Editar Quarto' : 'Novo Quarto'}
          </h2>
          <button onClick={onCancel} className="text-stone-grey hover:text-charcoal">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block font-sora text-sm font-medium text-charcoal mb-2">
                Número do Quarto *
              </label>
              <input
                type="text"
                value={formData.numero_quarto}
                onChange={(e) => handleInputChange('numero_quarto', e.target.value)}
                className={`w-full p-3 border rounded-lg font-sora focus:outline-none focus:ring-2 focus:ring-charcoal ${
                  errors.numero_quarto ? 'border-red-500' : 'border-stone-grey'
                }`}
                placeholder="Ex: 101, A-01, Superior 1"
                required
              />
              {errors.numero_quarto && (
                <p className="mt-1 text-sm text-red-600 font-sora">{errors.numero_quarto}</p>
              )}
            </div>

            <div>
              <label className="block font-sora text-sm font-medium text-charcoal mb-2">
                Nome do Quarto *
              </label>
              <input
                type="text"
                value={formData.nome}
                onChange={(e) => handleInputChange('nome', e.target.value)}
                className={`w-full p-3 border rounded-lg font-sora focus:outline-none focus:ring-2 focus:ring-charcoal ${
                  errors.nome ? 'border-red-500' : 'border-stone-grey'
                }`}
                placeholder="Ex: Quarto Standard, Suite Executiva"
                required
              />
              {errors.nome && (
                <p className="mt-1 text-sm text-red-600 font-sora">{errors.nome}</p>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block font-sora text-sm font-medium text-charcoal mb-2">
              Descrição
            </label>
            <textarea
              value={formData.descricao}
              onChange={(e) => handleInputChange('descricao', e.target.value)}
              className="w-full p-3 border border-stone-grey rounded-lg font-sora focus:outline-none focus:ring-2 focus:ring-charcoal"
              rows={3}
              placeholder="Descreva as características e comodidades do quarto..."
            />
          </div>

          {/* Price and Capacity */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block font-sora text-sm font-medium text-charcoal mb-2">
                Preço por Noite (Kz) *
              </label>
              <input
                type="number"
                value={formData.preco_noite}
                onChange={(e) => handleInputChange('preco_noite', Number(e.target.value))}
                className={`w-full p-3 border rounded-lg font-sora focus:outline-none focus:ring-2 focus:ring-charcoal ${
                  errors.preco_noite ? 'border-red-500' : 'border-stone-grey'
                }`}
                min="0"
                step="100"
                placeholder="0"
                required
              />
              {errors.preco_noite && (
                <p className="mt-1 text-sm text-red-600 font-sora">{errors.preco_noite}</p>
              )}
            </div>

            <div>
              <label className="block font-sora text-sm font-medium text-charcoal mb-2">
                Capacidade (pessoas) *
              </label>
              <select
                value={formData.capacidade}
                onChange={(e) => handleInputChange('capacidade', Number(e.target.value))}
                className="w-full p-3 border border-stone-grey rounded-lg font-sora focus:outline-none focus:ring-2 focus:ring-charcoal"
                required
              >
                {[1, 2, 3, 4, 5, 6].map(num => (
                  <option key={num} value={num}>
                    {num} pessoa{num > 1 ? 's' : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Photo URL */}
          <div>
            <label className="block font-sora text-sm font-medium text-charcoal mb-2">
              URL da Foto
            </label>
            <div className="flex space-x-3">
              <input
                type="url"
                value={formData.foto_url}
                onChange={(e) => handleInputChange('foto_url', e.target.value)}
                className={`flex-1 p-3 border rounded-lg font-sora focus:outline-none focus:ring-2 focus:ring-charcoal ${
                  errors.foto_url ? 'border-red-500' : 'border-stone-grey'
                }`}
                placeholder="https://exemplo.com/foto-do-quarto.jpg"
              />
              {formData.foto_url && (
                <button
                  type="button"
                  onClick={() => window.open(formData.foto_url, '_blank')}
                  className="px-4 py-3 bg-stone-100 text-charcoal rounded-lg hover:bg-stone-200 transition-colors"
                >
                  <Eye className="w-5 h-5" />
                </button>
              )}
            </div>
            {errors.foto_url && (
              <p className="mt-1 text-sm text-red-600 font-sora">{errors.foto_url}</p>
            )}
            {formData.foto_url && (
              <div className="mt-3">
                <img 
                  src={formData.foto_url} 
                  alt="Preview" 
                  className="w-full h-32 object-cover rounded-lg border border-stone-grey"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    setErrors(prev => ({ ...prev, foto_url: 'URL da foto inválida ou inacessível' }));
                  }}
                />
              </div>
            )}
          </div>

          {/* Status */}
          <div>
            <label className="block font-sora text-sm font-medium text-charcoal mb-2">
              Status *
            </label>
            <select
              value={formData.status}
              onChange={(e) => handleInputChange('status', e.target.value)}
              className="w-full p-3 border border-stone-grey rounded-lg font-sora focus:outline-none focus:ring-2 focus:ring-charcoal"
              required
            >
              <option value="disponivel">Disponível</option>
              <option value="ocupado">Ocupado</option>
              <option value="manutencao">Manutenção</option>
            </select>
          </div>

          {/* Services */}
          <div>
            <label className="block font-sora text-sm font-medium text-charcoal mb-2">
              Serviços e Comodidades
            </label>
            <input
              type="text"
              value={servicosInput}
              onChange={(e) => setServicosInput(e.target.value)}
              className="w-full p-3 border border-stone-grey rounded-lg font-sora focus:outline-none focus:ring-2 focus:ring-charcoal"
              placeholder="Wi-Fi, Ar Condicionado, TV, Frigobar, Cofre..."
            />
            <p className="mt-1 text-xs text-stone-grey font-sora">
              Separe os serviços com vírgulas
            </p>
            {servicosInput && (
              <div className="mt-3 flex flex-wrap gap-2">
                {servicosInput.split(',').map((servico, index) => {
                  const servicoTrimmed = servico.trim();
                  if (!servicoTrimmed) return null;
                  return (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-charcoal text-pure-white text-xs font-sora rounded-full"
                    >
                      {servicoTrimmed}
                    </span>
                  );
                })}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-6 border-t border-stone-grey">
            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              className="sm:flex-1 btn-secondary disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="sm:flex-1 btn-primary disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Salvando...</span>
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>{quarto ? 'Atualizar Quarto' : 'Criar Quarto'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
