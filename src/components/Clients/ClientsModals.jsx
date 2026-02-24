import React from 'react';
import { createPortal } from 'react-dom';
import { XMarkIcon, ClockIcon, DocumentTextIcon, CalendarIcon } from '@heroicons/react/24/outline';
import ConfirmDialog from '../ConfirmDialog';

export default function ClientsModals({
    state, dispatch, platforms,
    saveEdit, saveRenew, saveAddPlat,
    closeEdit, closeRenew, closeAddPlat,
    handleDeleteSub, closeConfirm
}) {
    const { historyModal, edit, renew, addPlat, isSelectOpen, confirm } = state;

    return (
        <>
            <ConfirmDialog open={confirm.open} message={confirm.message} onConfirm={confirm.onConfirm} onCancel={closeConfirm} />
            {/* Edit Modal */}
            <ConfirmDialog
                open={edit.open}
                header="Ajustar Suscripción"
                message={
                    <div className="space-y-8 pt-4 w-full flex flex-col items-center">
                        <div className="space-y-3 flex flex-col items-center w-full">
                            <label htmlFor="edit-monto" className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.2em]">Precio Final (USD)</label>
                            <input id="edit-monto" type="number" step="0.01" className="insta-input text-center max-w-[240px] w-full" value={edit.monto} onChange={e => dispatch({ type: 'SET_EDIT', payload: { monto: e.target.value } })} />
                        </div>
                        <div className="space-y-3 flex flex-col items-center w-full">
                            <label htmlFor="edit-fecha-alta" className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.2em]">Fecha de Alta</label>
                            <button
                                id="edit-fecha-alta"
                                type="button"
                                onClick={() => dispatch({ type: 'SET_DATE_PICKER_OPEN', payload: true })}
                                className="insta-input text-center max-w-[240px] w-full flex items-center justify-center gap-2 hover:border-pink-500/50 transition-all cursor-pointer"
                            >
                                <CalendarIcon className="w-3.5 h-3.5 text-pink-500" />
                                <span className="font-bold">{edit.fechaInicio.split('-').reverse().join('/')}</span>
                            </button>
                        </div>
                        <div className="space-y-3 flex flex-col items-center w-full">
                            <label htmlFor="edit-vigencia" className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.2em]">Vigencia (Meses)</label>
                            <input id="edit-vigencia" type="number" className="insta-input text-center max-w-[240px] w-full" value={edit.mesesPagados} onChange={e => dispatch({ type: 'SET_EDIT', payload: { mesesPagados: e.target.value } })} />
                        </div>
                    </div>
                }
                onConfirm={saveEdit}
                onCancel={closeEdit}
                deleteAction={() => handleDeleteSub(edit.clientId, edit.platId)}
            />

            {/* Renew Modal */}
            <ConfirmDialog
                open={renew.open}
                header="Renovar Suscripción"
                message={
                    <div className="space-y-8 pt-4 w-full flex flex-col items-center">
                        <div className="space-y-3 flex flex-col items-center w-full">
                            <label htmlFor="renew-monto" className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.2em]">Precio de Renovación (USD)</label>
                            <input id="renew-monto" type="number" step="0.01" className="insta-input text-center max-w-[240px] w-full" value={renew.monto} onChange={e => dispatch({ type: 'SET_RENEW', payload: { monto: e.target.value } })} />
                        </div>
                        <div className="space-y-3 flex flex-col items-center w-full">
                            <label htmlFor="renew-meses" className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.2em]">Meses a Renovar</label>
                            <input id="renew-meses" type="number" className="insta-input text-center max-w-[240px] w-full" value={renew.mesesPagados} onChange={e => dispatch({ type: 'SET_RENEW', payload: { mesesPagados: e.target.value } })} />
                        </div>
                    </div>
                }
                onConfirm={saveRenew}
                onCancel={closeRenew}
            />

            {/* Add Platform Modal */}
            <ConfirmDialog
                open={addPlat.open}
                header="Nueva Plataforma"
                message={
                    <div className="space-y-6 pt-4 w-full flex flex-col items-center">
                        <div className="space-y-3 flex flex-col items-center w-full">
                            <label htmlFor="add-plat-btn" className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.2em]">Servicio</label>
                            <div className="relative w-full max-w-[240px]">
                                <button
                                    id="add-plat-btn"
                                    type="button"
                                    onClick={() => dispatch({ type: 'TOGGLE_SELECT' })}
                                    className="insta-input w-full flex items-center justify-between text-center bg-[var(--bg-color)] !py-3 hover:border-indigo-500/50 transition-all"
                                >
                                    {addPlat.platId ? (
                                        <div className="flex items-center gap-3">
                                            <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center p-1">
                                                <img src={platforms.find(p => p.id === Number(addPlat.platId))?.icon} className="w-full h-full object-contain" alt="" />
                                            </div>
                                            <span className="font-bold text-sm text-[var(--text-primary)]">{platforms.find(p => p.id === Number(addPlat.platId))?.name}</span>
                                        </div>
                                    ) : (
                                        <span className="font-bold text-sm text-[var(--text-secondary)] flex-1 text-center pl-4">Plataforma</span>
                                    )}
                                    <svg className={`w-4 h-4 text-[var(--text-secondary)] transition-transform ${isSelectOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                </button>
                                {isSelectOpen && (
                                    <div className="absolute top-full left-0 right-0 mt-2 bg-[var(--bg-color)] border-2 border-[var(--border-color)] rounded-[1.5rem] shadow-2xl z-[100] p-4 max-h-48 overflow-y-auto custom-scrollbar animate-fade-in">
                                        <div className="grid grid-cols-4 place-items-center gap-3 w-full">
                                            {platforms.map((p) => (
                                                <button
                                                    key={p.id}
                                                    type="button"
                                                    onClick={() => {
                                                        dispatch({ type: 'SET_ADD_PLAT', payload: { platId: String(p.id) } });
                                                        dispatch({ type: 'SET_SELECT_OPEN', payload: false });
                                                    }}
                                                    className={`w-12 h-12 rounded-full border-2 flex items-center justify-center p-2.5 transition-all ${addPlat.platId === String(p.id) ? 'border-indigo-500 bg-indigo-500/10 scale-110' : 'border-[var(--border-color)] bg-[var(--hover-color)] hover:border-pink-500/50'}`}
                                                    title={p.name}
                                                >
                                                    <img src={p.icon} className="w-full h-full object-contain" alt={p.name} />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="space-y-3 flex flex-col items-center w-full">
                            <label htmlFor="add-costo" className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.2em]">Costo (USD)</label>
                            <input id="add-costo" type="number" step="0.01" className="insta-input text-center max-w-[240px] w-full" value={addPlat.monto} onChange={e => dispatch({ type: 'SET_ADD_PLAT', payload: { monto: e.target.value } })} />
                        </div>
                        <div className="space-y-3 flex flex-col items-center w-full">
                            <label htmlFor="add-meses" className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.2em]">Meses</label>
                            <input id="add-meses" type="number" className="insta-input text-center max-w-[240px] w-full" value={addPlat.mesesPagados} onChange={e => dispatch({ type: 'SET_ADD_PLAT', payload: { mesesPagados: e.target.value } })} />
                        </div>
                        <div className="space-y-3 flex flex-col items-center w-full">
                            <label htmlFor="add-fecha-inicio" className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.2em]">Fecha Inicio</label>
                            <button
                                id="add-fecha-inicio"
                                type="button"
                                onClick={() => dispatch({ type: 'SET_DATE_PICKER_OPEN', payload: true })}
                                className="insta-input text-center max-w-[240px] w-full flex items-center justify-center gap-2 hover:border-indigo-500/50 transition-all cursor-pointer"
                            >
                                <CalendarIcon className="w-3.5 h-3.5 text-indigo-500" />
                                <span className="font-bold">{addPlat.fechaInicio.split('-').reverse().join('/')}</span>
                            </button>
                        </div>
                    </div>
                }
                onConfirm={saveAddPlat}
                onCancel={closeAddPlat}
            />

            {/* History Modal */}
            {historyModal.open && createPortal(
                <div className="fixed inset-0 z-[1000] grid place-items-center h-screen w-screen p-4 pointer-events-none">
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto"
                        onClick={() => dispatch({ type: 'CLOSE_HISTORY' })}
                        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && dispatch({ type: 'CLOSE_HISTORY' })}
                        role="button"
                        tabIndex={-1}
                        aria-label="Cerrar"
                    />
                    <div className="w-full max-w-lg bg-[var(--bg-color)] rounded-[2.5rem] border border-[var(--border-color)] shadow-2xl overflow-hidden relative pointer-events-auto animate-insta">
                        <div className="px-8 py-6 border-b border-[var(--border-color)] flex items-center justify-between bg-[var(--hover-color)]">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                                    <ClockIcon className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-black uppercase tracking-tighter text-[var(--text-primary)]">Historial de Pagos</h4>
                                    <p className="text-[9px] font-bold text-[var(--text-secondary)] uppercase tracking-widest">{historyModal.clientName}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => dispatch({ type: 'CLOSE_HISTORY' })}
                                className="w-10 h-10 rounded-full flex items-center justify-center text-[var(--text-secondary)] hover:bg-white/5"
                            >
                                <XMarkIcon className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4 custom-scrollbar">
                            {historyModal.list.length === 0 ? (
                                <div className="py-20 text-center opacity-40">
                                    <DocumentTextIcon className="w-10 h-10 mx-auto mb-4 opacity-20" />
                                    <p className="text-[10px] font-black uppercase tracking-widest">No hay registros previos</p>
                                </div>
                            ) : (
                                historyModal.list.map((item) => (
                                    <div key={item.id || `history-${item.fecha}-${item.platId}`} className="p-5 rounded-3xl border border-[var(--border-color)] bg-[var(--hover-color)]/30 flex items-center justify-between group hover:border-indigo-500/30 transition-all">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <span className="text-[11px] font-black text-[var(--text-primary)] uppercase tracking-tight">{item.plataforma}</span>
                                                <span className="text-[9px] font-bold text-indigo-500 bg-indigo-500/10 px-2 py-0.5 rounded-full uppercase tracking-tighter">
                                                    {item.meses} Mes{item.meses > 1 ? 'es' : ''}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-3 text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-widest">
                                                <span>{new Date(item.fecha).toLocaleDateString()}</span>
                                                <span className="w-1 h-1 rounded-full bg-[var(--border-color)]" />
                                                <span>Vence: {item.vencimiento}</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="block text-sm font-black text-emerald-500 tracking-tight">${item.total}</span>
                                            <p className="text-[8px] font-bold text-[var(--text-secondary)] uppercase tracking-widest leading-none">Total Pagado</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="p-8 border-t border-[var(--border-color)] bg-[var(--hover-color)]/20">
                            <button
                                onClick={() => dispatch({ type: 'CLOSE_HISTORY' })}
                                className="w-full py-4 text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all"
                            >
                                Cerrar Historial
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
}
