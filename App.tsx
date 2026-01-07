
import React, { useState, useEffect, useMemo } from 'react';
import { ServiceRecord, BusinessStats } from './types';
import ServiceForm from './components/ServiceForm';
import ServiceTable from './components/ServiceTable';
import StatsCard from './components/StatsCard';
import DataManagement from './components/DataManagement';
import { Search, Briefcase, PlusCircle, LayoutDashboard, Database } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'crmevolux_v1_store';

const App: React.FC = () => {
  const [services, setServices] = useState<ServiceRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [lastAction, setLastAction] = useState<string | null>(null);

  // Carrega os dados ao iniciar
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setServices(parsed);
        }
      } catch (e) {
        console.error("Erro ao carregar dados", e);
      }
    }
  }, []);

  // Salva os dados sempre que a lista mudar
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(services));
  }, [services]);

  const showFeedback = (msg: string) => {
    setLastAction(msg);
    setTimeout(() => setLastAction(null), 3000);
  };

  const addService = (newService: Omit<ServiceRecord, 'id' | 'createdAt'>) => {
    const record: ServiceRecord = {
      ...newService,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setServices(prev => [record, ...prev]);
    setIsFormOpen(false);
    showFeedback('Serviço registrado com sucesso!');
  };

  const deleteService = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este registro?')) {
      setServices(prev => prev.filter(s => s.id !== id));
      showFeedback('Registro excluído com sucesso.');
    }
  };

  const handleImport = (importedData: ServiceRecord[]) => {
    setServices(importedData);
    showFeedback('Backup restaurado com sucesso!');
  };

  const stats: BusinessStats = useMemo(() => {
    const total = services.reduce((acc, curr) => acc + curr.value, 0);
    const count = services.length;
    return {
      totalEarned: total,
      serviceCount: count,
      averageValue: count > 0 ? total / count : 0,
    };
  }, [services]);

  const filteredServices = services.filter(s => 
    s.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.clientPhone.includes(searchTerm)
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      {/* Header Fixo */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2.5 rounded-xl shadow-lg shadow-blue-200">
              <Briefcase className="text-white w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-800 tracking-tight leading-none">
                CRM<span className="text-blue-600">EVOLUX</span>
              </h1>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Database Local</span>
              </div>
            </div>
          </div>
          
          <button 
            onClick={() => setIsFormOpen(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-blue-100 active:scale-95"
          >
            <PlusCircle className="w-5 h-5" />
            <span className="hidden sm:inline">Novo Registro</span>
            <span className="sm:hidden">Novo</span>
          </button>
        </div>
      </header>

      {/* Notificação Toast */}
      {lastAction && (
        <div className="fixed top-20 right-4 bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl z-50 animate-in slide-in-from-right duration-300 flex items-center gap-3 border border-white/10">
          <Database className="w-5 h-5 text-blue-400" />
          <span className="text-sm font-bold">{lastAction}</span>
        </div>
      )}

      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full space-y-8">
        {/* Painel de Estatísticas */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <StatsCard 
            label="Total Faturado" 
            value={stats.totalEarned} 
            type="currency" 
            icon={<span className="text-emerald-500 font-black text-xl">R$</span>}
          />
          <StatsCard 
            label="Serviços" 
            value={stats.serviceCount} 
            type="number" 
            icon={<LayoutDashboard className="text-blue-500 w-6 h-6" />}
          />
          <StatsCard 
            label="Ticket Médio" 
            value={stats.averageValue} 
            type="currency" 
            icon={<span className="text-amber-500 font-black text-xl">R$</span>}
          />
        </section>

        {/* Ferramentas e Busca */}
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Pesquisar registros..." 
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-slate-700 placeholder:text-slate-400 font-medium"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <DataManagement 
            data={services} 
            onImport={handleImport} 
          />
        </div>

        {/* Tabela de Dados */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden">
          <ServiceTable 
            records={filteredServices} 
            onDelete={deleteService} 
          />
        </div>
      </main>

      <footer className="py-10 bg-white border-t border-slate-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <p className="text-slate-800 font-bold">CRMEVOLUX</p>
            <p className="text-slate-400 text-xs mt-1">Sua central de registros offline e segura.</p>
          </div>
          <p className="text-slate-400 text-sm font-medium">
            © {new Date().getFullYear()} Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-4 bg-slate-50 px-4 py-2 rounded-full border border-slate-100">
            <Database className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-bold text-slate-500 uppercase tracking-tighter">Status: 100% Funcional</span>
          </div>
        </div>
      </footer>

      {/* Modal Novo Serviço */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[100] flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg my-8 overflow-hidden animate-in fade-in zoom-in duration-300">
            <ServiceForm 
              onSave={addService} 
              onCancel={() => setIsFormOpen(false)} 
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
