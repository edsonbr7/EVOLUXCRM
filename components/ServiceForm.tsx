
import React, { useState } from 'react';
import { X, CheckCircle2 } from 'lucide-react';

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
    const numericValue = parseFloat(value);
    
    if (!serviceName || !clientName || !clientPhone || isNaN(numericValue)) {
      alert('Por favor, preencha todos os campos corretamente.');
      return;
    }

    onSave({
      serviceName,
      clientName,
      clientPhone,
      value: numericValue,
    });
  };

  return (
    <div className="flex flex-col">
      <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-white">
        <div>
          <h2 className="text-xl font-black text-slate-800 tracking-tight">Novo Registro</h2>
          <p className="text-slate-400 text-xs font-medium uppercase tracking-widest mt-1">Preencha os detalhes abaixo</p>
        </div>
        <button 
          onClick={onCancel}
          className="p-2 hover:bg-slate-100 rounded-xl transition-all text-slate-400 hover:text-slate-600"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-6">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
            Descrição do Serviço
          </label>
          <input 
            type="text" 
            autoFocus
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium"
            placeholder="Ex: Manutenção Elétrica"
            value={serviceName}
            onChange={(e) => setServiceName(e.target.value)}
            required
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
            Nome do Cliente
          </label>
          <input 
            type="text" 
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium"
            placeholder="Quem solicitou o serviço?"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            required
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
            WhatsApp / Contato
          </label>
          <input 
            type="text" 
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium"
            placeholder="(00) 00000-0000"
            value={clientPhone}
            onChange={(e) => setClientPhone(e.target.value)}
            required
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
            Valor do Serviço
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">R$</span>
            <input 
              type="number" 
              step="0.01"
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-slate-800"
              placeholder="0,00"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="pt-4 flex gap-4">
          <button 
            type="button"
            onClick={onCancel}
            className="flex-1 py-3.5 border border-slate-200 text-slate-500 font-bold rounded-2xl hover:bg-slate-50 transition-all active:scale-95"
          >
            Voltar
          </button>
          <button 
            type="submit"
            className="flex-1 py-3.5 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 flex items-center justify-center gap-2 active:scale-95"
          >
            <CheckCircle2 className="w-5 h-5" />
            Finalizar
          </button>
        </div>
      </form>
    </div>
  );
};

export default ServiceForm;
