import React from 'react';

const TopServices = ({ topServices, platforms }) => {
    return (
        <div className="insta-card p-6 md:p-8 bg-[var(--bg-color)]">
            <div className="mb-6 md:mb-8">
                <h3 className="text-sm font-black text-[var(--text-primary)] uppercase tracking-widest">Top Servicios</h3>
                <p className="text-[9px] text-[var(--text-secondary)] font-bold uppercase tracking-[0.2em] mt-1">Por volumen de ingresos</p>
            </div>
            <div className="space-y-3 md:space-y-4">
                {topServices.length === 0 ? (
                    <p className="text-center py-10 opacity-40 text-[10px] uppercase font-black tracking-widest">Sin datos suficientes</p>
                ) : (
                    topServices.map(([name, rev], i) => {
                        const platform = platforms.find(p => p.name.toLowerCase() === name.toLowerCase());
                        return (
                            <div key={name} className="flex items-center justify-between p-4 rounded-2xl bg-[var(--hover-color)] border border-[var(--border-color)] group hover:border-pink-500/30 transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <div className="w-12 h-12 rounded-2xl bg-white border border-[var(--border-color)] p-2 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                                            {platform?.icon ? (
                                                <img src={platform.icon} className="w-full h-full object-contain filter drop-shadow-sm" alt={name} />
                                            ) : (
                                                <span className="font-black text-xs text-black">{name.charAt(0)}</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-black text-[var(--text-primary)] uppercase text-xs tracking-tight">{name}</span>
                                        <span className="text-[9px] font-bold text-[var(--text-secondary)] uppercase tracking-widest opacity-60">Posición #{i + 1}</span>
                                    </div>
                                </div>
                                <span className="font-black text-emerald-500 tracking-widest text-sm">${rev.toFixed(2)}</span>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default TopServices;
