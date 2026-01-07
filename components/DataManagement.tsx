
import React, { useRef } from 'react';
import { Download, Upload, ShieldCheck } from 'lucide-react';
import { ServiceRecord } from '../types';

interface DataManagementProps {
  data: ServiceRecord[];
  onImport: (data: ServiceRecord[]) => void;
}

const DataManagement: React.FC<DataManagementProps> = ({ data, onImport }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    if (data.length === 0) {
      alert("Não há dados para exportar.");
      return;
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const date = new Date().toISOString().split('T')[0];
    link.href = url;
    link.download = `backup-crmevolux-${date}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (Array.isArray(json)) {
          onImport(json);
        } else {
          alert("Arquivo inválido. Certifique-se de que é um backup do CRMEVOLUX.");
        }
      } catch (err) {
        alert("Erro ao ler o arquivo. Certifique-se de que é um arquivo JSON válido.");
      }
    };
    reader.readAsText(file);
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-2 mr-2">
        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div className="hidden sm:block">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Segurança de Dados</p>
          <p className="text-xs text-slate-600 font-medium">Backup & Restauração</p>
        </div>
      </div>

      <div className="flex gap-2 flex-1 sm:flex-initial">
        <button 
          onClick={handleExport}
          className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-lg transition-colors"
          title="Salvar uma cópia dos dados no seu computador"
        >
          <Download className="w-4 h-4" />
          Exportar
        </button>

        <button 
          onClick={() => fileInputRef.current?.click()}
          className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 border border-slate-200 hover:border-slate-300 text-slate-600 text-sm font-semibold rounded-lg transition-colors"
          title="Restaurar dados de um backup anterior"
        >
          <Upload className="w-4 h-4" />
          Importar
        </button>
      </div>

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept=".json" 
        className="hidden" 
      />
    </div>
  );
};

export default DataManagement;
