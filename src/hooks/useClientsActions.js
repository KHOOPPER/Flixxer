import { db } from '../db/provider';

export function useClientsActions(clients, setClients, platforms, dispatch) {
    const ask = (message, onConfirm) =>
        dispatch({ type: 'ASK_CONFIRM', payload: { msg: message, fn: onConfirm } });

    const closeConfirm = () => dispatch({ type: 'CLOSE_CONFIRM' });
    const closeEdit = () => dispatch({ type: 'CLOSE_EDIT' });
    const closeRenew = () => dispatch({ type: 'CLOSE_RENEW' });
    const closeAddPlat = () => dispatch({ type: 'CLOSE_ADD_PLAT' });

    const removeClient = id =>
        ask('¿Eliminar este perfil de cliente permanentemente?', async () => {
            await db.clients.delete(id);
            setClients(clients.filter(c => c.id !== id));
            closeConfirm();
        });

    const removeSub = (clientId, platId) =>
        ask('¿Dar de baja esta suscripción?', async () => {
            const client = clients.find(c => c.id === clientId);
            const subs = { ...client.subscriptions };
            delete subs[platId];
            await db.clients.update(clientId, { subscriptions: subs });
            setClients(clients.map(c => c.id === clientId ? { ...c, subscriptions: subs } : c));
            closeConfirm();
        });

    const openEdit = (clientId, platId) => {
        const client = clients.find(c => c.id === clientId);
        const sub = client.subscriptions[platId];
        dispatch({
            type: 'OPEN_EDIT',
            payload: { clientId, platId, monto: sub.monto, fechaInicio: sub.fechaInicio, mesesPagados: sub.mesesPagados }
        });
    };

    const handleDeleteSub = (clientId, platId) => {
        closeEdit();
        setTimeout(() => removeSub(clientId, platId), 200);
    };

    const saveEdit = async (edit) => {
        const { clientId, platId, monto, fechaInicio, mesesPagados } = edit;
        const vence = new Date(fechaInicio);
        vence.setMonth(vence.getMonth() + +mesesPagados);
        const fechaVencimiento = vence.toISOString().split('T')[0];

        const client = clients.find(c => c.id === clientId);
        const updatedSubs = {
            ...client.subscriptions,
            [platId]: { ...client.subscriptions[platId], monto, fechaInicio, mesesPagados, fechaVencimiento }
        };

        await db.clients.update(clientId, { subscriptions: updatedSubs });
        setClients(clients.map(c => c.id === clientId ? { ...c, subscriptions: updatedSubs } : c));
        closeEdit();
    };

    const saveRenew = async (renew) => {
        const { clientId, platId, monto, mesesPagados, oldSub, platName } = renew;
        await db.history.add({
            clientId, platId, plataforma: platName, fecha: oldSub.fechaInicio,
            monto: Number(oldSub.monto), meses: Number(oldSub.mesesPagados),
            total: Number(oldSub.monto), vencimiento: oldSub.fechaVencimiento
        });

        const hoy = new Date().toISOString().split('T')[0];
        const [y, m, d] = oldSub.fechaVencimiento.split('-').map(Number);
        const vDate = new Date(y, m - 1, d);
        const baseDate = vDate < new Date() ? new Date() : vDate;
        baseDate.setMonth(baseDate.getMonth() + Number(mesesPagados));

        const updatedSubs = {
            ...clients.find(c => c.id === clientId).subscriptions,
            [platId]: {
                ...oldSub, monto: String(monto), fechaInicio: hoy,
                mesesPagados: String(mesesPagados), fechaVencimiento: baseDate.toISOString().split('T')[0]
            }
        };

        await db.clients.update(clientId, { subscriptions: updatedSubs });
        setClients(clients.map(c => c.id === clientId ? { ...c, subscriptions: updatedSubs } : c));
        closeRenew();
    };

    const saveAddPlat = async (addPlat) => {
        const { clientId, platId, monto, mesesPagados, fechaInicio } = addPlat;
        const p = platforms.find(pl => pl.id === Number(platId));
        const vence = new Date(fechaInicio);
        vence.setMonth(vence.getMonth() + Number(mesesPagados));

        const client = clients.find(c => c.id === clientId);
        const updatedSubs = {
            ...(client.subscriptions || {}),
            [platId]: {
                monto: String(monto), fechaInicio, mesesPagados: String(mesesPagados),
                fechaVencimiento: vence.toISOString().split('T')[0], plataforma: p.name, icon: p.icon
            }
        };

        await db.clients.update(clientId, { subscriptions: updatedSubs });
        setClients(clients.map(c => c.id === clientId ? { ...c, subscriptions: updatedSubs } : c));
        closeAddPlat();
    };

    return {
        removeClient, removeSub, openEdit, handleDeleteSub,
        saveEdit, saveRenew, saveAddPlat,
        closeEdit, closeRenew, closeAddPlat, closeConfirm
    };
}
