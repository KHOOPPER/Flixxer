import React from 'react';
import { Pie } from 'react-chartjs-2';

const PlatformDistribution = ({ data, options }) => {
    return (
        <div className="insta-card p-10 bg-[var(--bg-color)] shadow-sm">
            <h3 className="text-[11px] font-black text-[var(--text-secondary)] uppercase tracking-[0.4em] mb-10">Distribución de Servicios</h3>
            <div className="h-[320px] w-full flex items-center justify-center">
                <Pie data={data} options={options} />
            </div>
        </div>
    );
};

export default PlatformDistribution;
