import React from 'react';
import { createPortal } from 'react-dom';
import { XMarkIcon, PencilSquareIcon, TrashIcon, ComputerDesktopIcon, SparklesIcon } from '@heroicons/react/24/outline';
import ConfirmDialog from '../components/ConfirmDialog';
import { db } from '../db/provider';
import { useData } from '../context/DataContext';

/**
 * Catálogo de Servicios: Minimalismo Vibrante (IG Style).
 * Presentación premium de marcas con bordes redondeados y efectos sutiles.
 */
const initialState = {
  msg: '',
  confirmId: null,
  editPlat: null,
  editName: '',
  preview: ''
};

function platformsReducer(state, action) {
  switch (action.type) {
    case 'SET_MSG':
      return { ...state, msg: action.payload };
    case 'SET_CONFIRM_ID':
      return { ...state, confirmId: action.payload };
    case 'OPEN_EDIT':
      return {
        ...state,
        editPlat: action.payload,
        editName: action.payload.name,
        preview: action.payload.icon
      };
    case 'CLOSE_EDIT':
      return { ...state, editPlat: null, editName: '', preview: '' };
    case 'SET_EDIT_NAME':
      return { ...state, editName: action.payload };
    case 'SET_PREVIEW':
      return { ...state, preview: action.payload };
    default:
      return state;
  }
}

export default function Platforms() {
  const { platforms, refreshData } = useData();
  const [state, dispatch] = React.useReducer(platformsReducer, initialState);
  const { msg, confirmId, editPlat, editName, preview } = state;

  const showMsg = (text) => {
    dispatch({ type: 'SET_MSG', payload: text });
    setTimeout(() => dispatch({ type: 'SET_MSG', payload: '' }), 3000);
  };

  /**
   * Elimina la plataforma seleccionada tras confirmación.
   */
  const eliminar = async () => {
    try {
      await db.platforms.delete(confirmId);
      await refreshData();
      showMsg('Plataforma eliminada');
      dispatch({ type: 'SET_CONFIRM_ID', payload: null });
    } catch (error) {
      console.error('Error eliminando:', error);
      showMsg('Error al eliminar');
    }
  };

  const abrirEdicion = p => dispatch({ type: 'OPEN_EDIT', payload: p });

  /**
   * Guarda los cambios de edición (nombre e icono).
   * Refleja los cambios globalmente en la base de datos.
   */
  const guardarEdicion = async () => {
    const newName = editName.trim();
    const newIcon = preview;
    const platId = editPlat.id;

    try {
      await db.platforms.update(platId, { name: newName, icon: newIcon });
      await refreshData();
      showMsg('Marca sincronizada globalmente');
      dispatch({ type: 'CLOSE_EDIT' });
    } catch (error) {
      console.error('Error actualizando:', error);
      showMsg('Error al actualizar');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-minimal pb-24 px-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[var(--border-color)] pb-10">
        <div>
          <h2 className="text-4xl font-black text-[var(--text-primary)] tracking-tighter uppercase">PLATAFORMAS</h2>
          <div className="flex items-center gap-2 mt-2">
            <span className="h-1 w-8 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-full"></span>
            <p className="text-[var(--text-secondary)] text-[10px] font-bold uppercase tracking-[0.3em]">Plataformas Disponibles</p>
          </div>
        </div>
        {msg && (
          <div className="text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-4 py-2 rounded-full uppercase tracking-widest border border-emerald-500/20 animate-pulse">
            {msg}
          </div>
        )}
      </div>

      {platforms.length ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
          {platforms.map(p => (
            <div key={p.id} className="insta-card group relative flex flex-col items-center p-8 transition-all hover:shadow-xl hover:-translate-y-1 bg-[var(--bg-color)]">
              {/* Logo Container */}
              <div className="w-24 h-24 mb-6 flex items-center justify-center border border-[var(--border-color)] bg-white p-4 rounded-3xl shadow-sm group-hover:shadow-md transition-all">
                <img src={p.icon} alt={p.name} className="platform-icon filter drop-shadow-sm group-hover:scale-110 transition-transform" />
              </div>

              <span className="text-[10px] font-black text-[var(--text-primary)] uppercase tracking-widest text-center w-full px-2 leading-tight">
                {p.name}
              </span>

              {/* Actions Overlay - Siempre visible para mejor UX táctil/desktop */}
              <div className="absolute top-3 right-3 flex flex-col gap-2">
                <button onClick={() => abrirEdicion(p)} className="p-2 bg-[var(--bg-color)] border border-[var(--border-color)] text-[var(--text-primary)] hover:border-pink-500 hover:text-pink-500 rounded-full transition-all shadow-sm">
                  <PencilSquareIcon className="w-3 h-3" />
                </button>
                <button onClick={() => dispatch({ type: 'SET_CONFIRM_ID', payload: p.id })} className="p-2 bg-[var(--bg-color)] border border-[var(--border-color)] text-rose-500 hover:border-rose-500 rounded-full transition-all shadow-sm">
                  <TrashIcon className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="insta-card py-40 flex flex-col items-center justify-center gap-6 opacity-30 bg-[var(--bg-color)] border-dashed border-2">
          <div className="w-20 h-20 rounded-full border border-[var(--border-color)] flex items-center justify-center">
            <ComputerDesktopIcon className="w-10 h-10 stroke-1" />
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em]">Ecosistema sin servicios</p>
        </div>
      )}

      {/* Modales Premium */}
      <ConfirmDialog open={confirmId !== null} message="¿Eliminar esta marca del catálogo activo?" onConfirm={eliminar} onCancel={() => dispatch({ type: 'SET_CONFIRM_ID', payload: null })} />

      {editPlat && createPortal(
        <div className="fixed inset-0 z-[999] grid place-items-center h-screen w-screen p-4 pointer-events-none">
          <div
            className="absolute inset-0 bg-transparent pointer-events-auto"
            onClick={() => dispatch({ type: 'CLOSE_EDIT' })}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && dispatch({ type: 'CLOSE_EDIT' })}
            role="button"
            tabIndex={-1}
            aria-label="Cerrar"
          />
          <div
            className="w-full max-w-[380px] relative rounded-[2.5rem] border-2 border-[var(--border-color)] animate-insta overflow-hidden pointer-events-auto"
            style={{ backgroundColor: 'var(--bg-color)', maxHeight: '90vh' }}
          >
            <div className="px-8 py-6 border-b border-[var(--border-color)] flex justify-between items-center bg-[var(--hover-color)]/30">
              <div className="flex items-center gap-3">
                <SparklesIcon className="w-[18px] h-[18px] text-pink-500" />
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[var(--text-primary)]">Ajustes de Marca</h3>
              </div>
              <button onClick={() => dispatch({ type: 'CLOSE_EDIT' })} className="text-[var(--text-secondary)] hover:text-pink-500 transition-colors"><XMarkIcon className="w-5 h-5" /></button>
            </div>

            <div className="p-10 space-y-8 no-scrollbar overflow-y-auto">
              <div className="space-y-3">
                <label htmlFor="edit-plat-name" className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.2em] ml-1 text-center block w-full">Nombre Comercial</label>
                <input id="edit-plat-name" className="insta-input rounded-2xl py-4 px-6 font-bold text-center" value={editName} onChange={e => dispatch({ type: 'SET_EDIT_NAME', payload: e.target.value })} />
              </div>
              <div className="space-y-3">
                <label htmlFor="edit-plat-logo" className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.2em] ml-1 text-center block w-full">URL de Identidad (Logo)</label>
                <input id="edit-plat-logo" className="insta-input rounded-2xl py-4 px-6 text-center" value={preview} onChange={e => dispatch({ type: 'SET_PREVIEW', payload: e.target.value })} />
              </div>

              <div className="flex flex-col items-center py-6 border-y border-[var(--border-color)]">
                <p className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-widest mb-4 opacity-50">Visual Assets Preview</p>
                <div className="w-24 h-24 border border-[var(--border-color)] p-5 flex items-center justify-center bg-white rounded-3xl shadow-inner">
                  <img src={preview} className="platform-icon filter drop-shadow-sm" alt="" />
                </div>
              </div>
            </div>

            <div className="p-8 border-t border-[var(--border-color)] flex flex-col gap-3">
              <button
                onClick={guardarEdicion}
                className="w-full insta-button py-4 text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-pink-500/20"
              >
                Persistir Cambios
              </button>
              <button
                onClick={() => dispatch({ type: 'CLOSE_EDIT' })}
                className="w-full py-4 text-[10px] font-black uppercase text-[var(--text-secondary)] tracking-[0.3em] hover:text-[var(--text-primary)] transition-all"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
