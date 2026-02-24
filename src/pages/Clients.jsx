import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { MagnifyingGlassIcon, UserIcon } from '@heroicons/react/24/outline';
import { db } from '../db/provider';
import { useData } from '../context/DataContext';

import InvoiceTicket from '../components/InvoiceTicket';
import CustomDatePicker from '../components/CustomDatePicker';
import ClientCard from '../components/Clients/ClientCard';
import ClientsModals from '../components/Clients/ClientsModals';
import { initialState, clientsReducer } from '../reducers/clientsReducer';
import { useClientsActions } from '../hooks/useClientsActions';

/**
 * Directorio de Clientes: Minimalismo Vibrante (IG Style).
 * Rediseño centrado en la jerarquía visual, bordes redondeados y acentos de color.
 */
export default function Clients() {
  const { clients, setClients, platforms } = useData();
  const location = useLocation();
  const [state, dispatch] = React.useReducer(clientsReducer, initialState);
  const { searchTerm, historyModal, edit, renew, addPlat, ticket, isDatePickerOpen } = state;

  const actions = useClientsActions(clients, setClients, platforms, dispatch);

  useEffect(() => {
    if (location.state?.search) {
      dispatch({ type: 'SET_SEARCH', payload: location.state.search });
    }
  }, [location.state]);

  const openHistory = async (clientId, clientName) => {
    const list = await db.history.where('clientId').equals(clientId).reverse().toArray();
    dispatch({ type: 'OPEN_HISTORY', payload: { list, name: clientName } });
  };

  const openTicket = (client, subscription, plataforma) => {
    dispatch({ type: 'OPEN_TICKET', payload: { client, subscription, plataforma, isFull: false } });
  };

  const openFullTicket = (client) => {
    dispatch({ type: 'OPEN_TICKET', payload: { client, subscription: null, plataforma: 'Servicios Múltiples', isFull: true } });
  };

  const filteredClients = clients.filter(c =>
    c.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.telefono.includes(searchTerm)
  );

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 animate-minimal">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
        <div>
          <h2 className="text-4xl font-black text-[var(--text-primary)] tracking-tighter">CLIENTES</h2>
          <div className="flex items-center gap-2 mt-2">
            <span className="h-1 w-10 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full"></span>
            <p className="text-[var(--text-secondary)] text-[10px] font-bold uppercase tracking-[0.3em]">INFORMACIÓN DE CLIENTES Y PAGOS</p>
          </div>
        </div>

        <div className="relative group max-w-md w-full">
          <MagnifyingGlassIcon className="absolute left-1/2 -ml-[130px] top-1/2 -translate-y-1/2 text-[var(--text-secondary)] group-focus-within:text-pink-500 transition-colors pointer-events-none mq-hide-search-icon w-[18px] h-[18px]" />
          <input
            type="text"
            placeholder="Buscar por nombre o celular..."
            className="w-full insta-input py-4 rounded-full border-[var(--border-color)] bg-[var(--hover-color)] focus:bg-[var(--bg-color)] shadow-sm text-center"
            value={searchTerm}
            onChange={e => dispatch({ type: 'SET_SEARCH', payload: e.target.value })}
          />
        </div>
      </div>

      {clients.length === 0 ? (
        <div className="insta-card py-32 flex flex-col items-center justify-center opacity-40">
          <div className="w-20 h-20 rounded-full border-2 border-dashed border-[var(--border-color)] flex items-center justify-center mb-6">
            <UserIcon className="w-10 h-10 stroke-1" />
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em]">No hay clientes registrados aún</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredClients.map(c => (
            <ClientCard
              key={c.id}
              client={c}
              platforms={platforms}
              onHistory={openHistory}
              onDelete={actions.removeClient}
              onEdit={actions.openEdit}
              onRenew={actions.openRenew}
              onAddPlat={actions.openAddPlat}
              onTicket={openTicket}
              onFullTicket={openFullTicket}
            />
          ))}
        </div>
      )}

      <InvoiceTicket
        isOpen={ticket.open}
        onClose={() => dispatch({ type: 'CLOSE_TICKET' })}
        client={ticket.client}
        subscription={ticket.subscription}
        plataforma={ticket.plataforma}
        isFull={ticket.isFull}
      />

      <ClientsModals
        state={state}
        dispatch={dispatch}
        platforms={platforms}
        saveEdit={() => actions.saveEdit(edit)}
        saveRenew={() => actions.saveRenew(renew)}
        saveAddPlat={() => actions.saveAddPlat(addPlat)}
        closeEdit={actions.closeEdit}
        closeRenew={actions.closeRenew}
        closeAddPlat={actions.closeAddPlat}
        handleDeleteSub={actions.handleDeleteSub}
        closeConfirm={actions.closeConfirm}
      />

      <CustomDatePicker
        isOpen={isDatePickerOpen}
        onClose={() => dispatch({ type: 'SET_DATE_PICKER_OPEN', payload: false })}
        value={addPlat.open ? addPlat.fechaInicio : edit.fechaInicio}
        onChange={(val) => {
          if (addPlat.open) dispatch({ type: 'SET_ADD_PLAT', payload: { fechaInicio: val } });
          else dispatch({ type: 'SET_EDIT', payload: { fechaInicio: val } });
        }}
        label="Seleccionar Fecha"
      />
    </div>
  );
}
