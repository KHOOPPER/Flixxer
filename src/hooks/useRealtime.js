import { useEffect } from 'react';
import { db } from '../db/provider';

/**
 * Hook para suscribirse a cambios en tiempo real de una tabla.
 * @param {string} table - Nombre de la tabla ('clients', 'platforms', etc)
 * @param {function} onUpdate - Callback a ejecutar cuando hay cambios
 */
export function useRealtime(table, onUpdate) {
    useEffect(() => {
        const subscription = db.subscribe(table, (payload) => {
            // Cuando hay un cambio, ejecutamos el callback (generalmente refrescar datos)
            onUpdate();
        });

        return () => {
            if (subscription) {
                subscription.unsubscribe();
            }
        };
    }, [table, onUpdate]);
}
