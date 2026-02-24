import React from 'react';
import { Bar } from 'react-chartjs-2';

const RevenueChart = ({ data, options }) => {
    return (
        <div className="insta-card p-10 bg-[var(--bg-color)] shadow-sm">
            <div className="flex items-center justify-between mb-10">
                <h3 className="text-[11px] font-black text-[var(--text-secondary)] uppercase tracking-[0.4em]">Crecimiento Mensual</h3>
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-gradient-to-tr from-purple-600 to-pink-500" />
                    <span className="text-[9px] font-black text-[var(--text-primary)] uppercase tracking-widest leading-none">Ingresos Brutos</span>
                </div>
            </div>
            <div className="h-[320px] w-full">
                <Bar data={data} options={options} />
            </div>
        </div>
    );
};

export default RevenueChart;
