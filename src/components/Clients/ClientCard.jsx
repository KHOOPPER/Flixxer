import React from 'react';
import { TrashIcon, ClockIcon, CalendarIcon, CheckCircleIcon, DocumentTextIcon, PlusIcon } from '@heroicons/react/24/outline';

export default function ClientCard({ client, platforms, onHistory, onDelete, onEdit, onRenew, onAddPlat, onTicket, onFullTicket }) {
    return (
        <div className="insta-card group hover:shadow-xl transition-all">
            {/* Perfil del Cliente */}
            <div className="p-6 border-b border-[var(--border-color)] flex justify-between items-center bg-[var(--hover-color)]">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 p-[2px]">
                        <div className="w-full h-full rounded-full bg-[var(--bg-color)] flex items-center justify-center font-black text-[var(--text-primary)] text-lg">
                            {client.nombre.charAt(0).toUpperCase()}
                        </div>
                    </div>
                    <div>
                        <h3 className="text-base font-black text-[var(--text-primary)] tracking-tight line-clamp-1">{client.nombre}</h3>
                        <p className="text-[10px] font-bold text-[var(--text-secondary)] tracking-widest">{client.telefono}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 active:scale-95 transition-transform">
                    <button
                        onClick={() => onHistory(client.id, client.nombre)}
                        className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-[var(--text-secondary)] hover:text-indigo-500 hover:bg-white/10 transition-all"
                    >
                        <ClockIcon className="w-[18px] h-[18px]" />
                    </button>
                    <button
                        onClick={() => onDelete(client.id)}
                        className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-[var(--text-secondary)] hover:text-rose-500 hover:bg-white/10 transition-all"
                    >
                        <TrashIcon className="w-[18px] h-[18px]" />
                    </button>
                </div>
            </div>

            {/* Suscripciones */}
            <div className="p-6 space-y-4">
                <p className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-[0.2em] mb-2">Servicios Activos</p>
                {Object.entries(client.subscriptions || {}).map(([platId, sub]) => {
                    const plat = platforms.find(p => p.id === +platId);
                    const platName = sub.plataforma || plat?.name || 'Servicio';

                    let isSubExpired = false;
                    if (sub.fechaVencimiento) {
                        const [y, m, d] = sub.fechaVencimiento.split('-').map(Number);
                        const vDate = new Date(y, m - 1, d);
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        isSubExpired = vDate < today;
                    }

                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    let diffDays = 100;
                    if (sub.fechaVencimiento) {
                        const [y, m, d] = sub.fechaVencimiento.split('-').map(Number);
                        const vDate = new Date(y, m - 1, d);
                        diffDays = Math.ceil((vDate - today) / (1000 * 60 * 60 * 24));
                    }
                    const showRenovar = diffDays <= 5;

                    return (
                        <div key={platId} className={`p-5 rounded-2xl bg-[var(--bg-color)] border transition-all space-y-4 ${isSubExpired ? 'border-rose-500/50 bg-rose-500/5' : 'border-[var(--border-color)] hover:border-pink-500/30'}`}>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 flex items-center justify-center">
                                        <img src={sub.icon || plat?.icon} className="platform-icon filter drop-shadow-sm" alt="" />
                                    </div>
                                    <span className="text-xs font-black text-[var(--text-primary)] uppercase tracking-tight">{platName}</span>
                                </div>
                                <span className="text-xs font-black text-emerald-500 bg-emerald-500/10 px-3 py-1.5 rounded-lg tracking-widest">${sub.monto}</span>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-[10px] font-bold text-[var(--text-secondary)] uppercase">
                                <div className="flex items-center gap-2"><CalendarIcon className="w-3 h-3 text-purple-500" /> {sub.fechaInicio}</div>
                                <div className="flex items-center gap-2 text-[var(--text-primary)]"><CheckCircleIcon className="w-3 h-3 text-emerald-500" /> {sub.fechaVencimiento}</div>
                            </div>

                            <div className="flex gap-2 pt-2">
                                {showRenovar ? (
                                    <button onClick={() => onRenew(client.id, platId, platName)} className="flex-1 py-2 text-[10px] font-black uppercase text-pink-500 border border-pink-500/40 rounded-xl hover:bg-pink-500/10 transition-all">Renovar</button>
                                ) : (
                                    <button onClick={() => onEdit(client.id, platId)} className="flex-1 py-2 text-[10px] font-black uppercase text-[var(--text-secondary)] border border-[var(--border-color)] rounded-xl hover:bg-[var(--hover-color)] transition-all">Editar</button>
                                )}
                                <button onClick={() => onTicket(client, sub, platName)} className="flex-1 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white text-[10px] font-black uppercase rounded-xl shadow-lg shadow-pink-500/20 flex items-center justify-center gap-2 hover:opacity-90 transition-all">
                                    <DocumentTextIcon className="w-3 h-3" /> Factura
                                </button>
                            </div>
                        </div>
                    );
                })}
                <button onClick={() => onAddPlat(client.id)} className="w-full py-3 mt-2 border border-dashed border-[var(--border-color)] text-[var(--text-secondary)] rounded-xl hover:border-indigo-500 hover:text-indigo-500 transition-colors text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2">
                    <PlusIcon className="w-4 h-4" /> Agregar Plat. / Servicio
                </button>
                {Object.keys(client.subscriptions || {}).length > 1 && (
                    <button onClick={() => onFullTicket(client)} className="w-full py-3 mt-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl shadow-lg shadow-pink-500/20 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:opacity-90 transition-all">
                        <DocumentTextIcon className="w-4 h-4" /> Factura Completa
                    </button>
                )}
            </div>
        </div>
    );
}
