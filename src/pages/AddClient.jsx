import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { UserPlusIcon, ArrowDownOnSquareIcon, CheckIcon, XMarkIcon, CalendarIcon } from '@heroicons/react/24/outline';
import CustomDatePicker from '../components/CustomDatePicker';
import { db } from '../db/provider';
import { useData } from '../context/DataContext';

/**
 * Registro de Clientes: Estilo Minimalista Vibrante (IG Style).
 * Presentación limpia con tarjetas redondeadas, gradientes y flujo intuitivo.
 */
const initialState = {
  nombre: '',
  phone: '+503 ',
  subscriptions: {},
  openFormFor: null,
  message: '',
  tempMonto: '',
  tempMeses: '1',
  tempFecha: new Date().toISOString().split('T')[0],
  isDatePickerOpen: false
};

function addClientReducer(state, action) {
  switch (action.type) {
    case 'SET_FIELD': return { ...state, [action.field]: action.value };
    case 'SET_STATE': return { ...state, ...action.payload };
    case 'RESET_FORM': return { ...initialState, message: action.payload || '' };
    default: return state;
  }
}

export default function AddClient() {
  const navigate = useNavigate();
  const [state, dispatch] = React.useReducer(addClientReducer, initialState);
  const { nombre, phone, subscriptions, openFormFor, message, tempMonto, tempMeses, tempFecha, isDatePickerOpen } = state;
  const { platforms: plataformas } = useData();

  /**
   * Maneja el cambio en el campo de teléfono, asegurando que mantenga el prefijo '+503 '.
   * @param {Object} e - Evento de cambio del input.
   */
  const handlePhoneChange = (e) => {
    const val = e.target.value;
    if (val.startsWith('+503 ')) dispatch({ type: 'SET_FIELD', field: 'phone', value: val });
    else if (val === '+503') dispatch({ type: 'SET_FIELD', field: 'phone', value: '+503 ' });
  };

  /**
   * Maneja el envío del formulario de suscripción individual para una plataforma.
   * Calcula la fecha de vencimiento y actualiza el estado de las suscripciones.
   * @param {Object} e - Evento de envío del formulario.
   */
  const handleSubSubmit = (e) => {
    e.preventDefault();
    if (!tempMonto || !tempFecha) return;

    const plat = plataformas.find(p => p.id === openFormFor);
    const d = new Date(tempFecha);
    d.setMonth(d.getMonth() + parseInt(tempMeses, 10));
    const fechaVencimiento = d.toISOString().split('T')[0];

    dispatch({
      type: 'SET_STATE',
      payload: {
        subscriptions: {
          ...subscriptions,
          [openFormFor]: {
            plataforma: plat.name,
            icon: plat.icon,
            monto: tempMonto,
            fechaInicio: tempFecha,
            mesesPagados: tempMeses,
            fechaVencimiento
          }
        },
        openFormFor: null,
        tempMonto: '',
        tempMeses: '1'
      }
    });
  };

  /**
   * Maneja el envío del formulario principal para guardar un nuevo cliente.
   * Valida los datos, guarda en la base de datos y resetea el formulario.
   * @param {Object} e - Evento de envío del formulario.
   */
  const handleSubmit = async e => {
    e.preventDefault();
    if (!nombre.trim() || phone.trim().length <= 5) {
      dispatch({ type: 'SET_FIELD', field: 'message', value: '⚠️ Completa los datos básicos.' });
      return;
    }
    if (Object.keys(subscriptions).length === 0) {
      dispatch({ type: 'SET_FIELD', field: 'message', value: '⚠️ Agrega al menos una plataforma.' });
      return;
    }

    try {
      const nuevo = {
        nombre,
        telefono: phone,
        subscriptions,
        created_at: new Date().toISOString()
      };

      await db.clients.add(nuevo);

      dispatch({ type: 'RESET_FORM', payload: '✅ Cliente registrado con éxito' });
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => {
        dispatch({ type: 'SET_FIELD', field: 'message', value: '' });
        if (window.innerWidth <= 768) {
          navigate('/');
        }
      }, 1500);
    } catch (err) {
      console.error('Error al guardar cliente:', err);
      dispatch({ type: 'SET_FIELD', field: 'message', value: '❌ Error al guardar datos.' });
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 animate-minimal">
      <div className="insta-card bg-[var(--bg-color)] shadow-sm">
        {/* Cabecera Tipo Instagram con Gradiente */}
        <div className="px-8 py-6 border-b border-[var(--border-color)] flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-500 to-orange-400 flex items-center justify-center shadow-lg shadow-pink-500/20 flex-shrink-0">
              <UserPlusIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-4xl font-black text-[var(--text-primary)] tracking-tighter uppercase">AGREGAR CLIENTE</h2>
              <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-[0.2em] mt-0.5">Sincronización de Servicios</p>
            </div>
          </div>
          <span className="text-[10px] font-black text-pink-500 bg-pink-500/10 px-3 py-1.5 rounded-full uppercase tracking-wide border border-pink-500/20 flex-shrink-0 whitespace-nowrap">Paso 1 / 2</span>
        </div>

        {message && (
          <div className="mx-8 mt-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-center text-xs font-black text-emerald-600 uppercase tracking-widest animate-minimal">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-12">
          {/* Identidad */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-3">
              <label htmlFor="nombre-completo" className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.2em] ml-1">Nombre Completo</label>
              <div className="relative group/field">
                <input
                  id="nombre-completo"
                  type="text"
                  placeholder="Ej. Juan Pérez"
                  className="insta-input rounded-2xl py-4 px-6 font-bold"
                  value={nombre}
                  onChange={e => dispatch({ type: 'SET_FIELD', field: 'nombre', value: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-3">
              <label htmlFor="whatsapp-contacto" className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.2em] ml-1">WhatsApp / Contacto</label>
              <div className="relative group/field font-black text-pink-500">
                <input
                  id="whatsapp-contacto"
                  type="text"
                  className="insta-input rounded-2xl py-4 px-6"
                  value={phone}
                  onChange={handlePhoneChange}
                />
              </div>
            </div>
          </div>

          {/* Selección de Servicios Grid */}
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-4">
              <h3 className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.3em] ml-1">Catálogo de Servicios</h3>
              <span className="text-[9px] font-black text-pink-500 uppercase">{Object.keys(subscriptions).length} Seleccionados</span>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-5">
              {plataformas.map(p => {
                const isSelected = !!subscriptions[p.id];
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => dispatch({ type: 'SET_FIELD', field: 'openFormFor', value: p.id })}
                    className={`aspect-square rounded-3xl border flex flex-col items-center justify-center gap-3 transition-all p-4 relative overflow-hidden group
                      ${isSelected ? 'bg-[var(--hover-color)] ring-2 ring-pink-500 border-transparent shadow-lg shadow-pink-500/10' : 'bg-[var(--bg-color)] border-[var(--border-color)] hover:border-pink-500/30'}
                    `}
                  >
                    <div className="w-12 h-12 flex items-center justify-center">
                      <img src={p.icon} alt={p.name} className="platform-icon object-center filter drop-shadow-sm group-hover:scale-110 transition-transform flex-shrink-0" />
                    </div>
                    <span className={`text-[9px] font-black uppercase w-full text-center tracking-tighter transition-colors leading-tight ${isSelected ? 'text-pink-600' : 'text-[var(--text-secondary)]'}`}>
                      {p.name}
                    </span>
                    {isSelected && (
                      <div className="absolute top-2 right-2 bg-pink-500 text-white rounded-full p-0.5">
                        <CheckIcon className="w-2.5 h-2.5" strokeWidth={3} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Acción Principal */}
          <div className="pt-10 border-t border-[var(--border-color)] flex justify-center">
            <button
              type="submit"
              className="insta-button px-14 py-4 flex items-center gap-3 text-sm tracking-[0.2em]"
            >
              <ArrowDownOnSquareIcon className="w-[22px] h-[22px]" />
              GUARDAR
            </button>
          </div>
        </form>
      </div>

      {/* Modal de Configuración Vibrant - Centrado Absoluto via Portal */}
      {openFormFor && createPortal(
        <div className="fixed inset-0 z-[999] grid place-items-center h-screen w-screen p-6 pointer-events-none">
          <div
            className="absolute inset-0 bg-transparent pointer-events-auto"
            onClick={() => dispatch({ type: 'SET_FIELD', field: 'openFormFor', value: null })}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && dispatch({ type: 'SET_FIELD', field: 'openFormFor', value: null })}
            role="button"
            tabIndex={-1}
            aria-label="Cerrar"
          />
          <div
            className="w-full max-w-sm overflow-hidden relative shadow-2xl pointer-events-auto animate-insta rounded-[2.5rem] border-2 border-[var(--border-color)]"
            style={{ backgroundColor: 'var(--bg-color)' }}
          >
            <div className="px-8 py-6 border-b border-[var(--border-color)] flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 flex items-center justify-center">
                  <img src={plataformas.find(p => p.id === openFormFor)?.icon} className="platform-icon" alt="" />
                </div>
                <h4 className="text-xs font-black uppercase tracking-tight">{plataformas.find(p => p.id === openFormFor)?.name}</h4>
              </div>
              <button type="button" onClick={() => dispatch({ type: 'SET_FIELD', field: 'openFormFor', value: null })}><XMarkIcon className="w-5 h-5 text-[var(--text-secondary)] hover:text-pink-500 transition-colors" /></button>
            </div>

            <form onSubmit={handleSubSubmit} className="p-8 space-y-6">
              <div className="space-y-2">
                <label htmlFor="temp-monto" className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest text-center block w-full mb-1">Precio</label>
                <div className="relative group/amount">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--text-primary)] opacity-30 font-light text-xl pointer-events-none">$</span>
                  <input
                    id="temp-monto"
                    type="number"
                    step="0.01"
                    className="insta-input pl-12 rounded-xl text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    required
                    value={tempMonto}
                    onChange={e => dispatch({ type: 'SET_FIELD', field: 'tempMonto', value: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="temp-meses" className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest text-center block w-full">Meses Adquiridos</label>
                <input
                  id="temp-meses"
                  type="number"
                  className="insta-input rounded-xl text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  required
                  value={tempMeses}
                  onChange={e => dispatch({ type: 'SET_FIELD', field: 'tempMeses', value: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="temp-fecha" className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest text-center block w-full">Fecha de Activación</label>
                <button
                  id="temp-fecha"
                  type="button"
                  onClick={() => dispatch({ type: 'SET_FIELD', field: 'isDatePickerOpen', value: true })}
                  className="insta-input rounded-xl text-center w-full flex items-center justify-center gap-2 hover:border-pink-500/50 transition-all cursor-pointer"
                >
                  <CalendarIcon className="w-3.5 h-3.5 text-pink-500" />
                  <span className="font-bold">{tempFecha.split('-').reverse().join('/')}</span>
                </button>
              </div>

              <CustomDatePicker
                isOpen={isDatePickerOpen}
                onClose={() => dispatch({ type: 'SET_FIELD', field: 'isDatePickerOpen', value: false })}
                value={tempFecha}
                onChange={(val) => dispatch({ type: 'SET_FIELD', field: 'tempFecha', value: val })}
                label="Fecha de Inicio"
              />

              <div className="p-8 flex flex-col gap-3 border-t border-[var(--border-color)]">
                <button
                  type="submit"
                  className="w-full insta-button py-4 text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-pink-500/20"
                >
                  Vincular Servicio
                </button>
                <button
                  type="button"
                  onClick={() => dispatch({ type: 'SET_FIELD', field: 'openFormFor', value: null })}
                  className="w-full py-4 text-[10px] font-black uppercase text-[var(--text-secondary)] tracking-[0.3em] hover:text-[var(--text-primary)] transition-all"
                >
                  Cerrar
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
