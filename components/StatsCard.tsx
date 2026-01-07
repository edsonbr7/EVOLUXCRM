
import React, { ReactNode } from 'react';

interface StatsCardProps {
  label: string;
  value: number;
  type: 'currency' | 'number';
  icon: ReactNode;
}

const StatsCard: React.FC<StatsCardProps> = ({ label, value, type, icon }) => {
  const displayValue = type === 'currency' 
    ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
    : value.toString();

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500 mb-1">{label}</p>
        <h4 className="text-2xl font-bold text-slate-800 tracking-tight">{displayValue}</h4>
      </div>
      <div className="bg-slate-50 p-3 rounded-lg flex items-center justify-center">
        {icon}
      </div>
    </div>
  );
};

export default StatsCard;
