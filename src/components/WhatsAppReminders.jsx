import React, { useState, useEffect } from 'react';
import { db } from '../db/provider';
import { useData } from '../context/DataContext';
import { ChatBubbleLeftRightIcon, XMarkIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { useSettings } from '../context/SettingsContext';

const initialState = {
    reminders: [],
    isOpen: false,
    isVisible: false
};

function remindersReducer(state, action) {
    switch (action.type) {
        case 'UPDATE_REMINDERS':
            const { pending, shouldShow } = action.payload;
            if (pending.length === 0) {
                return { ...state, reminders: [], isOpen: false, isVisible: false };
            }
            return {
                ...state,
                reminders: pending,
                isVisible: state.isVisible || shouldShow
            };
        case 'TOGGLE_OPEN':
            return { ...state, isOpen: !state.isOpen };
        case 'SET_OPEN':
            return { ...state, isOpen: action.payload };
        default:
            return state;
    }
}

export default function WhatsAppReminders() {
    const { clients, platforms, refreshData } = useData();
    const [state, dispatch] = React.useReducer(remindersReducer, initialState);
    const { reminders, isOpen, isVisible } = state;

    const { settings } = useSettings();

    useEffect(() => {
        try {
            const pending = [];
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            clients.forEach(client => {
                if (!client.subscriptions) return;

                Object.entries(client.subscriptions).forEach(([platId, sub]) => {
                    if (!sub.fechaVencimiento) return;

                    const [y, m, d] = sub.fechaVencimiento.split('-').map(Number);
                    const vDate = new Date(y, m - 1, d);
                    const diffTime = vDate - today;
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                    if (diffDays <= 5) {
                        if (sub.avisoVencimiento !== sub.fechaVencimiento) {
                            const platformData = platforms.find(p => p.id === Number(platId));
                            const platName = sub.plataforma || platformData?.name || 'Servicio';

                            pending.push({
                                clientId: client.id,
                                clientName: client.nombre,
                                clientPhone: client.telefono,
                                platId,
                                platName,
                                vencimiento: sub.fechaVencimiento,
                                monto: sub.monto,
                                diasRestantes: diffDays
                            });
                        }
                    }
                });
            });

            dispatch({
                type: 'UPDATE_REMINDERS',
                payload: { pending, shouldShow: pending.length > 0 }
            });

        } catch (error) {
            console.error("Error calculating reminders:", error);
        }
    }, [clients, platforms]);

    const formatWhatsAppNumber = (phone) => {
        // Quita espacios, guiones y asegura formato internacional simple
        let cleaned = phone.replace(/\D/g, '');
        // Asume código de país si no lo tiene, aquí podrías ajustar lógicas específicas.
        return cleaned;
    };

    const handleSendReminder = async (reminder) => {
        // 1. Marcar como leído en la base de datos
        try {
            const client = clients.find(c => c.id === reminder.clientId);
            if (!client) return;

            const updatedSubs = {
                ...client.subscriptions,
                [reminder.platId]: {
                    ...client.subscriptions[reminder.platId],
                    avisoVencimiento: reminder.vencimiento // Marca la fecha en la que vencía como ya avisada
                }
            };

            await db.clients.update(reminder.clientId, { subscriptions: updatedSubs });

            // 2. Preparar el mensaje y el link de WhatsApp
            const greeting = reminder.diasRestantes < 0 ? "tu suscripción ha expirado" : `tu suscripción vence en ${reminder.diasRestantes} días`;
            const greetingWord = reminder.diasRestantes < 0 ? "expirado" : "vence";

            const message = `Hola ${reminder.clientName}, te recordamos que ${greeting} (${reminder.vencimiento}) el servicio de *${reminder.platName}*.\n\nPuedes renovar por *USD $${reminder.monto}*.\n¡Quedamos a tu disposición!`;

            const waNumber = formatWhatsAppNumber(reminder.clientPhone);
            const url = `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;

            // 3. Abrir WhatsApp Web
            window.open(url, '_blank');

            // 4. Actualizar estado global, lo que recargará el componente automáticamente
            await refreshData();

        } catch (err) {
            console.error("Failed to update reminder status:", err);
        }
    };

    if (!isVisible || reminders.length === 0) return null;

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {/* Widget Expandido */}
            {isOpen && (
                <div className="mb-4 bg-[var(--bg-color)] border border-[var(--border-color)] shadow-2xl rounded-2xl w-80 overflow-hidden animate-fade-in origin-bottom-right">
                    <div className="p-4 bg-[var(--hover-color)] border-b border-[var(--border-color)] flex items-center justify-between">
                        <div className="flex items-center gap-2 text-[var(--text-primary)]">
                            <ExclamationTriangleIcon className="w-5 h-5 text-amber-500" />
                            <h4 className="font-black tracking-tight text-sm uppercase">Recordatorios Pendientes</h4>
                        </div>
                        <button onClick={() => dispatch({ type: 'SET_OPEN', payload: false })} className="text-[var(--text-secondary)] hover:text-rose-500 transition-colors">
                            <XMarkIcon className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="max-h-64 overflow-y-auto custom-scrollbar p-2 space-y-2">
                        {reminders.map((r) => (
                            <div key={`${r.clientId}-${r.platId}`} className="p-3 bg-[var(--hover-color)]/30 rounded-xl border border-[var(--border-color)]/50 hover:border-emerald-500/30 transition-all flex flex-col gap-2">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-xs font-black text-[var(--text-primary)] uppercase truncate w-40">{r.clientName}</p>
                                        <p className="text-[10px] text-[var(--text-secondary)] font-bold tracking-widest">{r.platName}</p>
                                    </div>
                                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter ${r.diasRestantes < 0 ? 'bg-rose-500/10 text-rose-500' : 'bg-amber-500/10 text-amber-500'}`}>
                                        {r.diasRestantes < 0 ? 'Expirado' : `${r.diasRestantes} Días`}
                                    </span>
                                </div>
                                <button
                                    onClick={() => handleSendReminder(r)}
                                    className="w-full mt-2 py-2 flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg shadow-lg shadow-emerald-500/20 text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-opacity active:scale-[0.98]"
                                >
                                    <ChatBubbleLeftRightIcon className="w-4 h-4" />
                                    Enviar WhatsApp
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Botón Flotante (Burbuja) */}
            <button
                onClick={() => dispatch({ type: 'TOGGLE_OPEN' })}
                className="w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center text-white shadow-xl shadow-emerald-500/30 hover:scale-110 active:scale-95 transition-all relative"
            >
                <ChatBubbleLeftRightIcon className="w-6 h-6" />
                {reminders.length > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-black ring-2 ring-[var(--bg-color)]">
                        {reminders.length}
                    </span>
                )}
            </button>
        </div>
    );
}
