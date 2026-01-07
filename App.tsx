// Fixed malformed import and removed duplicate interface definitions
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { ServiceRecord, BusinessStats } from './types';
import ServiceForm from './components/ServiceForm';
import ServiceTable from './components/ServiceTable';
import StatsCard from './components/StatsCard';
import DataManagement from './components/DataManagement';
import { Search, Briefcase, PlusCircle, LayoutDashboard, Database } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'crmevolux_data_v1';

const App: React.FC = () => {
  const [services, setServices] = useState<ServiceRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [lastAction, setLastAction] = useState<string | null>(null);

  // Load data on mount
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setServices(parsed);
        }
      } catch (e) {
        console.error("Erro ao carregar dados do localStorage", e);
      }
    }
  }, []);

  // Save data on change
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(services));
  }, [services]);

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
    if (window.confirm('Tem certeza que deseja excluir este registro? Esta ação não pode ser desfeita.')) {
      setServices(prev => prev.filter(s => s.id !== id));
      showFeedback('Registro excluído.');
    }
  };

  const showFeedback = (msg: string) => {
    setLastAction(msg);
    setTimeout(() => setLastAction(null), 3000);
  };

  const handleImport = (importedData: ServiceRecord[]) => {
    if (window.confirm(`Deseja importar ${importedData.length} registros? Isso substituirá seus dados atuais.`)) {
      setServices(importedData);
      showFeedback('Dados importados com sucesso!');
    }
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
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Briefcase className="text-white w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800 tracking-tight leading-none">CRM<span className="text-blue-600 font-medium">EVOLUX</span></h1>
              <div className="flex items-center gap-1 mt-1">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Armazenamento Local Ativo</span>
              </div>
            </div>
          </div>
          
          <button 
            onClick={() => setIsFormOpen(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all shadow-md active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Novo Registro</span>
            <span className="sm:hidden">Novo</span>
          </button>
        </div>
      </header>

      {/* Toast Feedback */}
      {lastAction && (
        <div className="fixed top-20 right-4 bg-slate-800 text-white px-4 py-2 rounded-lg shadow-xl z-50 animate-in slide-in-from-right duration-300 flex items-center gap-2">
          <Database className="w-4 h-4 text-blue-400" />
          <span className="text-sm font-medium">{lastAction}</span>
        </div>
      )}

      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
        {/* Stats Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatsCard 
            label="Total Faturado" 
            value={stats.totalEarned} 
            type="currency" 
            icon={<span className="text-emerald-500 font-bold">R$</span>}
          />
          <StatsCard 
            label="Serviços Realizados" 
            value={stats.serviceCount} 
            type="number" 
            icon={<LayoutDashboard className="text-blue-500 w-5 h-5" />}
          />
          <StatsCard 
            label="Ticket Médio" 
            value={stats.averageValue} 
            type="currency" 
            icon={<span className="text-amber-500 font-bold">R$</span>}
          />
        </section>

        {/* Controls & Search */}
        <div className="flex flex-col lg:flex-row gap-6 mb-6">
          <div className="flex-1 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Pesquisar por serviço, cliente ou número..." 
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700"
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

        {/* Content Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden min-h-[400px]">
          <ServiceTable 
            records={filteredServices} 
            onDelete={deleteService} 
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-400 text-sm">
          <p>© {new Date().getFullYear()} CRMEVOLUX - Seus dados são salvos automaticamente neste navegador.</p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5">
              <Database className="w-4 h-4" />
              Persistência Local: 100%
            </span>
          </div>
        </div>
      </footer>

      {/* Modal Form */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg my-8 overflow-hidden animate-in fade-in zoom-in duration-200">
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