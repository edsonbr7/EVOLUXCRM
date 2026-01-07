
import React from 'react';
import { ServiceRecord } from '../types';
import { Trash2, Calendar, User, Phone, Briefcase, FileSpreadsheet } from 'lucide-react';

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
    
    const headers = ['Serviço', 'Cliente', 'Telefone', 'Valor', 'Data'];
    const rows = records.map(r => [
      r.serviceName,
      r.clientName,
      r.clientPhone,
      r.value.toFixed(2).replace('.', ','),
      formatDate(r.createdAt)
    ]);

    const csvContent = [
      headers.join(';'),
      ...rows.map(row => row.join(';'))
    ].join('\n');

    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `relatorio-servicos-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (records.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 px-4">
        <div className="bg-slate-50 p-6 rounded-full mb-4">
          <Briefcase className="w-12 h-12 text-slate-200" />
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-1">Tudo limpo por aqui!</h3>
        <p className="text-slate-500 text-center max-w-xs text-sm">
          Comece registrando seu primeiro serviço clicando no botão no topo da página.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="px-6 py-3 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
          Listagem de Registros ({records.length})
        </span>
        <button 
          onClick={exportToCSV}
          className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors uppercase"
        >
          <FileSpreadsheet className="w-3.5 h-3.5" />
          Exportar Excel (CSV)
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-white border-b border-slate-100">
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Serviço</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Cliente</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Data</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Valor</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {records.map((record) => (
              <tr key={record.id} className="hover:bg-blue-50/30 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-50 p-2 rounded-lg text-blue-600 group-hover:bg-blue-100 transition-colors">
                      <Briefcase className="w-4 h-4" />
                    </div>
                    <span className="font-semibold text-slate-800">{record.serviceName}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1 text-slate-700 font-semibold">
                      <span>{record.clientName}</span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-400 text-xs">
                      <Phone className="w-3 h-3" />
                      <span>{record.clientPhone}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-300" />
                    <span>{formatDate(record.createdAt)}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-slate-900 font-bold bg-slate-100 px-2 py-1 rounded">
                    {formatCurrency(record.value)}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => onDelete(record.id)}
                    className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                    title="Excluir Permanentemente"
                  >
                    <Trash2 className="w-4.5 h-4.5" />
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
