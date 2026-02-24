import React, { useRef } from 'react';
import { createPortal } from 'react-dom';
import { PaperAirplaneIcon, ClockIcon, ArrowDownTrayIcon, ShareIcon } from '@heroicons/react/24/outline';
import { useSettings } from '../context/SettingsContext';
import { toPng } from 'html-to-image';
import { db } from '../db/provider';

/**
 * Componente de Factura Estilo Ticket (Recibo de Caja).
 * Usa una estética monoespaciada de alta fidelidad.
 */
export default function InvoiceTicket({ isOpen, onClose, client, subscription, plataforma, isFull = false }) {
    const { settings } = useSettings();
    const ticketRef = useRef(null);

    if (!isOpen) return null;

    const subsList = isFull
        ? Object.entries(client?.subscriptions || {}).map(([id, s]) => ({ id, ...s }))
        : (subscription ? [{ id: 'single', ...subscription, plataforma }] : []);

    const totalCalculado = subsList.reduce((acc, sub) => acc + (Number(sub.monto) * Number(sub.mesesPagados)), 0).toFixed(2);

    const logTransaction = async () => {
        try {
            if (isFull) {
                for (const sub of subsList) {
                    await db.history.add({
                        clientId: client.id,
                        platId: sub.id,
                        plataforma: sub.plataforma || 'Servicio',
                        fecha: new Date().toISOString(),
                        monto: String(sub.monto),
                        meses: Number(sub.mesesPagados),
                        total: Number((Number(sub.monto) * Number(sub.mesesPagados)).toFixed(2)),
                        vencimiento: sub.fechaVencimiento
                    });
                }
            } else {
                await db.history.add({
                    clientId: client.id,
                    platId: subscription.platId || plataforma, // Enlace flexible
                    plataforma: plataforma,
                    fecha: new Date().toISOString(),
                    monto: Number(subscription.monto),
                    meses: Number(subscription.mesesPagados),
                    total: Number(totalCalculado),
                    vencimiento: subscription.fechaVencimiento
                });
            }
            // Registro silencioso
        } catch (err) {
            console.error('Error guardando historial:', err);
        }
    };

    const handlePrint = () => {
        logTransaction();
        window.print();
    };

    const handleDownloadImage = async () => {
        if (!ticketRef.current) return;
        try {
            const dataUrl = await toPng(ticketRef.current, {
                quality: 1.0,
                pixelRatio: 2,
                backgroundColor: '#ffffff'
            });
            const link = document.createElement('a');
            link.download = `Factura-${client.nombre}-${plataforma}.png`;
            link.href = dataUrl;
            link.click();
            logTransaction();
        } catch (err) {
            console.error('Error generando imagen:', err);
        }
    };

    const handleSendWhatsApp = async () => {
        const phone = client.telefono.replace(/\D/g, '');
        let textMessage = "";

        if (isFull) {
            textMessage = `¡Hola ${client.nombre}! Te envío tu comprobante de pago consolidado.\n\n` +
                `Detalle de servicios:\n` +
                subsList.map(s => `- ${s.plataforma || 'Servicio'} (${s.mesesPagados} Mes(es) x $${s.monto})`).join('\n') +
                `\n\nTotal: $${totalCalculado}\n` +
                `¡Gracias por tu preferencia!`;
        } else {
            textMessage = `¡Hola ${client.nombre}! Te envío tu comprobante de pago de ${plataforma}.\n\n` +
                `Detalle: ${subscription.mesesPagados} Mes(es) x $${subscription.monto}\n` +
                `Total: $${totalCalculado}\n` +
                `Vencimiento: ${subscription.fechaVencimiento}\n\n` +
                `¡Gracias por tu preferencia!`;
        }

        if (!ticketRef.current) return;

        try {
            // Generar imagen con alta calidad
            const dataUrl = await toPng(ticketRef.current, { quality: 1.0, pixelRatio: 2, backgroundColor: '#ffffff' });
            const blob = await (await fetch(dataUrl)).blob();
            const file = new File([blob], `Ticket-${client.nombre}.png`, { type: 'image/png' });

            // 1. Copiar al portapapeles siempre (Para que el usuario solo tenga que dar CTRL+V)
            if (navigator.clipboard && window.ClipboardItem) {
                try {
                    const item = new ClipboardItem({ 'image/png': blob });
                    await navigator.clipboard.write([item]);
                    // Portapapeles exitoso
                } catch (clipErr) {
                    console.error('Error al copiar al portapapeles:', clipErr);
                }
            }
        } catch (err) {
            console.error('Error al generar imagen para portapapeles:', err);
        }

        // 2. Redirigir DIRECTAMENTE a WhatsApp (Sin diálogos intermedios)
        const message = encodeURIComponent(textMessage);
        window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
        logTransaction();
    };

    const today = new Date().toLocaleDateString('es-SV', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    return createPortal(
        <div className="fixed inset-0 z-[10000] grid place-items-center h-screen w-screen p-4 pointer-events-none print:p-0 print:static overflow-hidden">
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto print:hidden"
                onClick={onClose}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClose()}
                role="button"
                tabIndex={-1}
                aria-label="Cerrar"
            />

            <div
                className="relative w-full max-w-[380px] animate-insta pointer-events-auto print:max-w-none print:shadow-none print:border-none flex flex-col gap-6"
                style={{ backgroundColor: 'transparent' }}
            >
                {/* El Ticket Físico */}
                <div ref={ticketRef} className="ticket-container border-2 border-black/5 shadow-2xl rounded-sm">
                    <div className="ticket-header">
                        <h1 className="text-xl font-bold tracking-tighter mb-1 uppercase">{settings.appName || 'FIREFLIXX'}</h1>
                        <p className="text-[10px] uppercase tracking-widest opacity-70">Comprobante de Pago</p>
                        <p className="text-[9px] mt-2 italic">San Salvador, El Salvador</p>
                    </div>

                    <div className="space-y-4 text-[11px] leading-relaxed">
                        <div className="flex justify-between">
                            <span>FECHA:</span>
                            <span className="text-right">{today}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>CLIENTE:</span>
                            <span className="text-right uppercase font-bold">{client.nombre}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>TELÉFONO:</span>
                            <span className="text-right">{client.telefono}</span>
                        </div>

                        <div className="ticket-divider" />

                        <div className="space-y-4">
                            {subsList.map((sub) => (
                                <div key={sub.id} className="space-y-1">
                                    <div className="flex justify-between items-end">
                                        <span className="uppercase text-[10px] opacity-70 pr-2">{sub.plataforma || plataforma} ({sub.mesesPagados} MESES X ${sub.monto})</span>
                                        <span className="font-bold">${(Number(sub.monto) * Number(sub.mesesPagados)).toFixed(2)}</span>
                                    </div>
                                    {isFull && (
                                        <div className="flex justify-between text-[8px] opacity-60 italic">
                                            <span>VENCE: {sub.fechaVencimiento}</span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="ticket-divider" />

                        <div className="flex justify-between items-baseline text-lg font-black mt-2 border-b-2 border-black pb-1">
                            <span>TOTAL:</span>
                            <span>${totalCalculado}</span>
                        </div>

                        {!isFull && subscription && (
                            <div className="mt-6 space-y-1 opacity-80 italic text-[10px]">
                                <div className="flex justify-between">
                                    <span>INICIO:</span>
                                    <span>{subscription.fechaInicio}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>VENCIMIENTO:</span>
                                    <span className="font-bold underline">{subscription.fechaVencimiento}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="ticket-footer">
                        <p className="font-bold mb-2 uppercase">¡GRACIAS POR TU PREFERENCIA!</p>
                        <div className="mt-4 flex justify-center gap-1 opacity-20 select-none">
                            {Array.from({ length: 50 }).map((_, i) => (
                                <span key={`b-${i}`} style={{ height: (Math.sin(i) * 10 + 20) + 'px', width: '2px', background: 'black' }} />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Controles Inferiores (Glass Style / Compact Dialog) */}
                <div className="w-fit mx-auto relative rounded-[2rem] border-2 border-[var(--border-color)] animate-insta pointer-events-auto shadow-2xl bg-[var(--bg-color)] p-4 flex gap-2 print:hidden">
                    <button
                        onClick={handleDownloadImage}
                        className="px-6 py-3 bg-[var(--bg-color)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-2xl transition-all hover:bg-[var(--hover-color)] flex items-center justify-center gap-2"
                    >
                        <ArrowDownTrayIcon className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Ticket</span>
                    </button>

                    <button
                        onClick={handleSendWhatsApp}
                        className="px-6 py-3 bg-emerald-500 text-white rounded-2xl transition-all hover:bg-emerald-600 flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                    >
                        <PaperAirplaneIcon className="w-3.5 h-3.5 -rotate-45" />
                        <span className="text-[10px] font-black uppercase tracking-widest">WhatsApp</span>
                    </button>
                </div>
            </div>

            <style>{`
        @media print {
          body * { visibility: hidden; }
          .ticket-container, .ticket-container * { visibility: visible; }
          .ticket-container {
            position: absolute;
            left: 0;
            top: 0;
            margin: 0;
            padding: 20px;
            width: 80mm; /* Ancho estándar de ticket thermal */
            box-shadow: none;
            border: none;
          }
        }
      `}</style>
        </div>,
        document.body
    );
}
