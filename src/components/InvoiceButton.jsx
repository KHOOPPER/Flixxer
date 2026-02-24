import React, { useState } from 'react';
import { ChatBubbleLeftEllipsisIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import InvoiceTicket from './InvoiceTicket';

/**
 * Botón de Gestión de Factura y Notificación: Minimalismo Vibrante (IG Style).
 * Presentación estilizada para acciones transaccionales.
 */
export default function InvoiceButton({ client, subscription, plataforma, small }) {
  const [showTicket, setShowTicket] = useState(false);
  const { nombre, telefono } = client;
  const { fechaVencimiento } = subscription;

  const handleNotify = (e) => {
    e.stopPropagation();
    const mensaje = [
      `Hola *${nombre}*, 👋`,
      ``,
      `Tu suscripción a *${plataforma}* venció el *${fechaVencimiento}*.`,
      `Por favor responde a este mensaje para renovar tu acceso. 🚀`,
      ``,
      `_Mensaje automático de FireFlixx._`
    ].join('\n');

    const encoded = encodeURIComponent(mensaje);
    const phoneNum = telefono.replace(/\D/g, '');
    window.open(`https://web.whatsapp.com/send?phone=${phoneNum}&text=${encoded}`, '_blank');
  };

  return (
    <>
      <div className="flex gap-2 w-full">
        <button
          onClick={(e) => { e.stopPropagation(); setShowTicket(true); }}
          className={`${small ? 'p-3' : 'px-6 py-3'} flex-1 border border-[var(--border-color)] text-[var(--text-primary)] hover:bg-[var(--hover-color)] rounded-2xl transition-all flex items-center justify-center gap-2 group`}
          title="Ver Comprobante"
        >
          <DocumentTextIcon className={`group-hover:text-pink-500 transition-colors ${small ? 'w-4 h-4' : 'w-[18px] h-[18px]'}`} />
          {!small && <span className="text-[10px] font-black uppercase tracking-widest">Ticket</span>}
        </button>

        <button
          onClick={handleNotify}
          className={`${small ? 'p-3' : 'px-6 py-3'} flex-1 bg-emerald-500 text-white rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 hover:bg-emerald-600`}
          title="Notificar WhatsApp"
        >
          <ChatBubbleLeftEllipsisIcon className={small ? 'w-4 h-4' : 'w-[18px] h-[18px]'} />
          {!small && <span className="text-[10px] font-black uppercase tracking-widest">Aviso</span>}
        </button>
      </div>

      <InvoiceTicket
        isOpen={showTicket}
        onClose={() => setShowTicket(false)}
        client={client}
        subscription={subscription}
        plataforma={plataforma}
      />
    </>
  );
}
