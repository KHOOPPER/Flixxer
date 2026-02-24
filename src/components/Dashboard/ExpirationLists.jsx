import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ClockIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const ExpirationLists = ({ expired, upcoming }) => {
    const navigate = useNavigate();

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Vencidos */}
            <div className="insta-card bg-[var(--bg-color)] shadow-sm overflow-hidden">
                <div className="p-8 border-b border-[var(--border-color)] flex items-center justify-between bg-rose-500/5">
                    <div className="flex items-center gap-3">
                        <ExclamationTriangleIcon className="w-5 h-5 text-rose-500" />
                        <h3 className="text-[11px] font-black text-rose-600 uppercase tracking-[0.3em]">Cuentas Vencidas</h3>
                    </div>
                    <span className="text-[10px] font-black text-rose-500 bg-rose-500/10 px-3 py-1 rounded-full">{expired.length}</span>
                </div>
                <div className="p-6 space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar">
                    {expired.length === 0 ? (
                        <p className="text-center py-10 text-[10px] uppercase font-bold text-[var(--text-secondary)] tracking-widest">Sin deudas pendientes</p>
                    ) : (
                        expired.map((u) => (
                            <div
                                key={`expired-${u.client}-${u.plataforma}`}
                                role="button"
                                tabIndex={0}
                                onClick={() => navigate('/clients', { state: { search: u.client } })}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        navigate('/clients', { state: { search: u.client } });
                                    }
                                }}
                                className="p-4 flex items-center justify-between bg-[var(--hover-color)]/50 rounded-2xl border border-rose-500/20 hover:border-rose-500/50 transition-all cursor-pointer group/item"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-500 font-bold text-[10px]">
                                        {u.client.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-xs font-black text-[var(--text-primary)] uppercase tracking-tight">{u.client}</p>
                                        <p className="text-[9px] font-bold text-[var(--text-secondary)] uppercase tracking-widest">{u.plataforma}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-black text-rose-500 uppercase">{u.vence}</p>
                                    <p className="text-[8px] font-bold text-[var(--text-secondary)] uppercase tracking-tighter">Expiró hace {u.daysDiff * -1}d</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Próximos Vencimientos */}
            <div className="insta-card bg-[var(--bg-color)] shadow-sm overflow-hidden">
                <div className="p-8 border-b border-[var(--border-color)] flex items-center justify-between bg-amber-500/5">
                    <div className="flex items-center gap-3">
                        <ClockIcon className="w-5 h-5 text-amber-500" />
                        <h3 className="text-[11px] font-black text-amber-600 uppercase tracking-[0.3em]">Por Vencer (5 días)</h3>
                    </div>
                    <span className="text-[10px] font-black text-amber-500 bg-amber-500/10 px-3 py-1 rounded-full">{upcoming.length}</span>
                </div>
                <div className="p-6 space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar">
                    {upcoming.length === 0 ? (
                        <p className="text-center py-10 text-[10px] uppercase font-bold text-[var(--text-secondary)] tracking-widest">Nadie vence pronto</p>
                    ) : (
                        upcoming.map((u) => (
                            <div
                                key={`upcoming-${u.client}-${u.plataforma}`}
                                role="button"
                                tabIndex={0}
                                onClick={() => navigate('/clients', { state: { search: u.client } })}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        navigate('/clients', { state: { search: u.client } });
                                    }
                                }}
                                className="p-4 flex items-center justify-between bg-[var(--hover-color)]/50 rounded-2xl border border-[var(--border-color)] hover:border-pink-500/30 transition-all cursor-pointer group/item"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-500 font-bold text-[10px]">
                                        {u.client.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-xs font-black text-[var(--text-primary)] uppercase tracking-tight">{u.client}</p>
                                        <p className="text-[9px] font-bold text-[var(--text-secondary)] uppercase tracking-widest">{u.plataforma}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-black text-amber-500 uppercase">{u.vence}</p>
                                    <p className="text-[8px] font-bold text-[var(--text-secondary)] uppercase tracking-tighter">En {u.daysDiff} días</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default ExpirationLists;
