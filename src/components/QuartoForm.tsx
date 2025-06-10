
import { useState } from 'react';
import { X, Save } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import type { QuartoHotel } from '@/lib/supabase';

interface QuartoFormProps {
  quarto?: QuartoHotel;
  onSave: (quarto: Omit<QuartoHotel, 'id' | 'created_at'>) => Promise<boolean>;
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
        onCancel();
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-pure-white p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-sora text-2xl font-bold text-charcoal">
            {quarto ? 'Editar Quarto' : 'Novo Quarto'}
          </h2>
          <button onClick={onCancel} className="text-stone-grey hover:text-charcoal">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="floating-label">
              <input
                type="text"
                id="numero_quarto"
                value={formData.numero_quarto}
                onChange={(e) => setFormData(prev => ({ ...prev, numero_quarto: e.target.value }))}
                placeholder=" "
                required
              />
              <label htmlFor="numero_quarto">Número do Quarto *</label>
            </div>

            <div className="floating-label">
              <input
                type="text"
                id="nome"
                value={formData.nome}
                onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                placeholder=" "
                required
              />
              <label htmlFor="nome">Nome do Quarto *</label>
            </div>
          </div>

          <div className="floating-label">
            <textarea
              id="descricao"
              value={formData.descricao}
              onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
              placeholder=" "
              rows={3}
            />
            <label htmlFor="descricao">Descrição</label>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="floating-label">
              <input
                type="number"
                id="preco_noite"
                value={formData.preco_noite}
                onChange={(e) => setFormData(prev => ({ ...prev, preco_noite: Number(e.target.value) }))}
                placeholder=" "
                min="0"
                step="0.01"
                required
              />
              <label htmlFor="preco_noite">Preço por Noite (Kz) *</label>
            </div>

            <div className="floating-label">
              <input
                type="number"
                id="capacidade"
                value={formData.capacidade}
                onChange={(e) => setFormData(prev => ({ ...prev, capacidade: Number(e.target.value) }))}
                placeholder=" "
                min="1"
                required
              />
              <label htmlFor="capacidade">Capacidade (pessoas) *</label>
            </div>
          </div>

          <div className="floating-label">
            <input
              type="url"
              id="foto_url"
              value={formData.foto_url}
              onChange={(e) => setFormData(prev => ({ ...prev, foto_url: e.target.value }))}
              placeholder=" "
            />
            <label htmlFor="foto_url">URL da Foto</label>
          </div>

          <div className="floating-label">
            <select
              id="status"
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
              required
            >
              <option value="disponivel">Disponível</option>
              <option value="ocupado">Ocupado</option>
              <option value="manutencao">Manutenção</option>
            </select>
            <label htmlFor="status">Status *</label>
          </div>

          <div className="floating-label">
            <input
              type="text"
              id="servicos"
              value={servicosInput}
              onChange={(e) => setServicosInput(e.target.value)}
              placeholder=" "
            />
            <label htmlFor="servicos">Serviços (separados por vírgula)</label>
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary flex items-center space-x-2 disabled:opacity-50"
            >
              <Save className="w-5 h-5" />
              <span>{isLoading ? 'Salvando...' : 'Salvar'}</span>
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="btn-secondary"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
