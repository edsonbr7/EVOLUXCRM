
import React, { useState } from 'react';
import { X } from 'lucide-react';

interface ServiceFormProps {
  onSave: (data: { serviceName: string; clientName: string; clientPhone: string; value: number }) => void;
  onCancel: () => void;
}

const ServiceForm: React.FC<ServiceFormProps> = ({ onSave, onCancel }) => {
  const [serviceName, setServiceName] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [value, setValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceName || !clientName || !clientPhone || !value) {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    onSave({
      serviceName,
      clientName,
      clientPhone,
      value: parseFloat(value),
    });
  };

  return (
    <div className="flex flex-col">
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
        <h2 className="text-lg font-bold text-slate-800">Novo Registro de Serviço</h2>
        <button 
          onClick={onCancel}
          className="p-1 hover:bg-slate-200 rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-slate-500" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Nome do Serviço
          </label>
          <input 
            type="text" 
            autoFocus
            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
            placeholder="Ex: Consultoria Técnica, Limpeza, etc."
            value={serviceName}
            onChange={(e) => setServiceName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Nome do Cliente
          </label>
          <input 
            type="text" 
            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
            placeholder="Nome completo do cliente"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Número de Telefone / Contato
          </label>
          <input 
            type="text" 
            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
            placeholder="(00) 00000-0000"
            value={clientPhone}
            onChange={(e) => setClientPhone(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Valor do Serviço (R$)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">R$</span>
            <input 
              type="number" 
              step="0.01"
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
              placeholder="0,00"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="pt-4 flex gap-3">
          <button 
            type="button"
            onClick={onCancel}
            className="flex-1 py-2.5 border border-slate-200 text-slate-600 font-medium rounded-lg hover:bg-slate-50 transition-colors"
          >
            Cancelar
          </button>
          <button 
            type="submit"
            className="flex-1 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            Salvar Registro
          </button>
        </div>
      </form>
    </div>
  );
};

export default ServiceForm;
