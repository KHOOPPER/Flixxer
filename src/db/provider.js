import {
    clientsDB as supabaseClients,
    platformsDB as supabasePlatforms,
    historyDB as supabaseHistory,
    settingsDB as supabaseSettings,
    subscribeToTable
} from './supabase.js';

/**
 * API Unificada: MODO CLOUD ONLY ☁️
 * Redirige todas las llamadas directamente a Supabase.
 */
export const db = {
    // Helper para React hooks
    subscribe: subscribeToTable,

    clients: {
        async toArray() {
            return await supabaseClients.getAll();
        },

        async add(client) {
            return await supabaseClients.add(client);
        },

        async update(id, changes) {
            return await supabaseClients.update(id, changes);
        },

        async delete(id) {
            return await supabaseClients.delete(id);
        }
    },

    platforms: {
        async toArray() {
            return await supabasePlatforms.getAll();
        },

        async add(platform) {
            return await supabasePlatforms.add(platform);
        },

        async update(id, changes) {
            return await supabasePlatforms.update(id, changes);
        },

        async delete(id) {
            return await supabasePlatforms.delete(id);
        }
    },

    history: {
        toArray: async () => {
            return await supabaseHistory.getAll();
        },

        where: (field) => ({
            equals: (value) => ({
                reverse: () => ({
                    toArray: async () => {
                        if (field === 'clientId') {
                            const res = await supabaseHistory.getByClientId(value);
                            return res.reverse();
                        }
                        throw new Error(`Campo ${field} no soportado en modo Cloud`);
                    }
                }),
                toArray: async () => {
                    if (field === 'clientId') {
                        return await supabaseHistory.getByClientId(value);
                    }
                    throw new Error(`Campo ${field} no soportado en modo Cloud`);
                }
            })
        }),

        add: async (record) => {
            return await supabaseHistory.add({
                client_id: record.clientId,
                plat_id: record.platId,
                plataforma: record.plataforma,
                fecha: record.fecha,
                monto: record.monto,
                meses: record.meses,
                total: record.total,
                vencimiento: record.vencimiento
            });
        }
    },

    settings: {
        async get() {
            const data = await supabaseSettings.get();
            return { id: 'current', ...data };
        },

        async put(settings) {
            const { id, ...data } = settings;
            await supabaseSettings.update(data);
            return settings;
        }
    }
};
