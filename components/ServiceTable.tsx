
import React from 'react';
import { ServiceRecord } from '../types';
import { Trash2, Calendar, Phone, Briefcase, FileSpreadsheet, User2 } from 'lucide-react';

interface ServiceTableProps {
  records: ServiceRecord[];
  onDelete: (id: string) => void;
}

const ServiceTable: React.FC<ServiceTableProps> = ({ records, onDelete }) => {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  const formatDate = (isoStr: string) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(isoStr));
  };

  const exportToCSV = () => {
    if (records.length === 0) return;
    const headers = ['Servico', 'Cliente', 'Telefone', 'Valor', 'Data'];
    const rows = records.map(r => [
      r.serviceName,
      r.clientName,
      r.clientPhone,
      r.value.toFixed(2),
      formatDate(r.createdAt)
    ]);
    const csvContent = "\uFEFF" + [headers.join(';'), ...rows.map(row => row.join(';'))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `crmevolux-relatorio-${new Date().getTime()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (records.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-40 px-6 text-center">
        <div className="bg-slate-50 p-8 rounded-full mb-6 border border-slate-100">
          <Briefcase className="w-16 h-16 text-slate-200" />
        </div>
        <h3 className="text-2xl font-black text-slate-800 mb-2">Sem registros ainda</h3>
        <p className="text-slate-400 max-w-sm text-sm font-medium">
          Sua lista está vazia. Comece a organizar seu negócio clicando em "Novo Registro" acima.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="px-8 py-5 border-b border-slate-100 flex justify-between items-center bg-white">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
          <span className="text-xs font-black text-slate-800 uppercase tracking-widest">
            Fluxo de Serviços ({records.length})
          </span>
        </div>
        <button 
          onClick={exportToCSV}
          className="flex items-center gap-2 text-xs font-extrabold text-emerald-600 hover:text-emerald-700 transition-all uppercase bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100"
        >
          <FileSpreadsheet className="w-4 h-4" />
          Exportar Relatório
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Descrição do Serviço</th>
              <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Cliente & Contato</th>
              <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Data de Registro</th>
              <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Investimento</th>
              <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Controles</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {records.map((record) => (
              <tr key={record.id} className="hover:bg-blue-50/20 transition-all group">
                <td className="px-8 py-5">
                  <div className="flex items-center gap-4">
                    <div className="bg-slate-100 p-2.5 rounded-xl text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-600 transition-all">
                      <Briefcase className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-slate-800 group-hover:text-blue-700 transition-colors">{record.serviceName}</span>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 text-slate-700 font-bold mb-0.5">
                      <User2 className="w-3.5 h-3.5 text-slate-300" />
                      <span>{record.clientName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
                      <Phone className="w-3 h-3" />
                      <span>{record.clientPhone}</span>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-5 text-sm">
                  <div className="flex items-center gap-2 text-slate-500 font-medium">
                    <Calendar className="w-4 h-4 text-slate-300" />
                    <span>{formatDate(record.createdAt)}</span>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <span className="text-emerald-700 font-black bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100">
                    {formatCurrency(record.value)}
                  </span>
                </td>
                <td className="px-8 py-5 text-right">
                  <button 
                    onClick={() => onDelete(record.id)}
                    className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    title="Remover permanentemente"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ServiceTable;
