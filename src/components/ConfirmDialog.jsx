import React from 'react';
import { createPortal } from 'react-dom';
import { XMarkIcon, ExclamationTriangleIcon, TrashIcon } from '@heroicons/react/24/outline';

/**
 * Diálogo de Confirmación: Minimalismo Vibrante (IG Style).
 * Presentación premium con bordes suaves, sombras profundas y contraste optimizado.
 */
export default function ConfirmDialog({ open, header, message, confirmLabel = 'Confirmar', cancelLabel = 'Cerrar', onConfirm, onCancel, deleteAction }) {
  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[999] grid place-items-center h-screen w-screen p-4 pointer-events-none">
      {/* Overlay Totalmente Invisible y bloqueador */}
      <div
        className="fixed inset-0 bg-transparent pointer-events-auto"
        onClick={onCancel}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onCancel()}
        role="button"
        tabIndex={-1}
        aria-label="Cerrar"
      />

      {/* Burbuja - Diseño Original Centrado Absoluto sobre TODO el Viewport */}
      <div
        className="w-full max-w-[380px] relative rounded-[2.5rem] border-2 border-[var(--border-color)] animate-insta overflow-hidden pointer-events-auto"
        style={{
          backgroundColor: 'var(--bg-color)',
          maxHeight: '90vh'
        }}
      >
        <div className="px-8 py-6 border-b border-[var(--border-color)] flex justify-between items-center bg-[var(--hover-color)]/30">
          <div className="flex items-center gap-3">
            <ExclamationTriangleIcon className="w-[18px] h-[18px] text-pink-500" />
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[var(--text-primary)]">
              {header || 'REQUERIDO'}
            </h3>
          </div>
          <button onClick={onCancel} className="text-[var(--text-secondary)] hover:text-pink-500 transition-colors">
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="p-10 text-[var(--text-primary)] text-sm leading-relaxed text-center flex flex-col items-center justify-center">
          <div className="font-bold text-[var(--text-primary)] opacity-90 text-center w-full">{message}</div>
          <div className="mt-6 h-1 w-12 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full"></div>
        </div>

        <div className="p-8 border-t border-[var(--border-color)] flex flex-col gap-3">
          <div className="flex items-center gap-3 w-full">
            <button
              className="flex-1 insta-button py-4 text-[10px] uppercase font-black tracking-[0.2em] shadow-lg shadow-pink-500/20"
              onClick={onConfirm}
            >
              {confirmLabel}
            </button>
            {deleteAction && (
              <button
                className="h-[46px] w-[52px] rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 hover:bg-rose-500 hover:text-white transition-all shadow-sm flex-shrink-0"
                onClick={deleteAction}
                title="Eliminar"
              >
                <TrashIcon className="w-5 h-5" />
              </button>
            )}
          </div>
          <button
            className="w-full py-4 text-[10px] uppercase font-black tracking-[0.3em] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all"
            onClick={onCancel}
          >
            {cancelLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
