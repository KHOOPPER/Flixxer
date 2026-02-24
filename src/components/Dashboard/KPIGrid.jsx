import React from 'react';
import { CurrencyDollarIcon, UsersIcon, ClockIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const KPI_CONFIG = [
    { key: 'monthlyRevenue', title: 'Ventas del Mes', icon: CurrencyDollarIcon, bg: 'bg-emerald-500/10', text: 'text-emerald-500', format: (v) => `$${v}` },
    { key: 'activeClients', title: 'Clientes Activos', icon: UsersIcon, bg: 'bg-indigo-500/10', text: 'text-indigo-500' },
    { key: 'activeSubs', title: 'Servicios Activos', icon: ClockIcon, bg: 'bg-purple-500/10', text: 'text-purple-500' },
    { key: 'toExpire', title: 'Por Vencer (5d)', icon: ExclamationTriangleIcon, bg: 'bg-rose-500/10', text: 'text-rose-500' }
];

const KPICard = ({ title, value, icon: Icon, bg, text, trend }) => (
    <div className="insta-card p-8 flex flex-col gap-4 bg-[var(--bg-color)] shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
            <div className={`p-4 rounded-2xl ${bg}`}>
                <Icon className={`w-7 h-7 ${text}`} />
            </div>
            {trend && (
                <span className="text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-3 py-1.5 rounded-full uppercase tracking-wider">
                    {trend}
                </span>
            )}
        </div>
        <div>
            <p className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.3em] mb-1">{title}</p>
            <h3 className="text-3xl font-black text-[var(--text-primary)] tracking-tighter">{value}</h3>
        </div>
    </div>
);

const KPIGrid = ({ stats }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        {KPI_CONFIG.map(({ key, title, icon, bg, text, format }) => (
            <KPICard
                key={key}
                title={title}
                value={format ? format(stats[key]) : stats[key]}
                icon={icon}
                bg={bg}
                text={text}
                trend={key === 'monthlyRevenue' ? '+12.5%' : undefined}
            />
        ))}
    </div>
);

export default KPIGrid;
