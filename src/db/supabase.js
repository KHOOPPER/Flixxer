import { createClient } from '@supabase/supabase-js';

// Configuración de Supabase: SEGURIDAD REFORZADA 🔐
// Limpiar comillas, espacios y caracteres invisibles que Vercel puede inyectar
const cleanEnv = (val) => val ? String(val).replace(/['"]/g, '').trim() : '';

const SUPABASE_URL = cleanEnv(import.meta.env.VITE_SUPABASE_URL);
const SUPABASE_KEY = cleanEnv(import.meta.env.VITE_SUPABASE_ANON_KEY);

// Inicialización directa
let supabaseInstance = null;

if (SUPABASE_URL && SUPABASE_KEY) {
    try {
        supabaseInstance = createClient(SUPABASE_URL, SUPABASE_KEY);
    } catch (error) {
        console.error('Error al inicializar Supabase:', error.message);
    }
}

// Si no se pudo crear, usar objeto de respaldo para evitar crashes
if (!supabaseInstance) {
    supabaseInstance = {
        auth: {
            onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } } }),
            getSession: async () => ({ data: { session: null }, error: null }),
            signInWithPassword: async () => ({
                data: { session: null },
                error: { message: 'Servicio no disponible. Verifica la configuración.' }
            }),
            signOut: async () => ({ error: null })
        },
        from: () => {
            const chain = () => chain;
            chain.select = chain; chain.insert = chain; chain.update = chain;
            chain.delete = chain; chain.eq = chain; chain.order = chain;
            chain.single = async () => ({ data: null, error: null });
            chain.then = (resolve) => resolve({ data: null, error: null });
            return chain;
        },
        channel: () => ({ on: () => ({ subscribe: () => ({}) }) })
    };
}

export const supabase = supabaseInstance;
export const isSupabaseEnabled = () => !!import.meta.env.VITE_SUPABASE_URL;

/**
 * API Unificada para Clientes
 */
export const clientsDB = {
    async getAll() {
        const { data, error } = await supabase
            .from('clients')
            .select('*')
            .order('created_at', { ascending: false });
        if (error) throw error;
        return data || [];
    },

    async getById(id) {
        const { data, error } = await supabase
            .from('clients')
            .select('*')
            .eq('id', id)
            .single();
        if (error) throw error;
        return data;
    },

    async add(client) {
        const { data, error } = await supabase
            .from('clients')
            .insert([client])
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    async update(id, changes) {
        const { data, error } = await supabase
            .from('clients')
            .update(changes)
            .eq('id', id)
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    async delete(id) {
        const { error } = await supabase
            .from('clients')
            .delete()
            .eq('id', id);
        if (error) throw error;
    }
};

/**
 * API Unificada para Plataformas
 */
export const platformsDB = {
    async getAll() {
        const { data, error } = await supabase
            .from('platforms')
            .select('*')
            .order('created_at', { ascending: false });
        if (error) throw error;
        return data || [];
    },

    async add(platform) {
        const { data, error } = await supabase
            .from('platforms')
            .insert([platform])
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    async update(id, changes) {
        const { data, error } = await supabase
            .from('platforms')
            .update(changes)
            .eq('id', id)
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    async delete(id) {
        const { error } = await supabase
            .from('platforms')
            .delete()
            .eq('id', id);
        if (error) throw error;
    }
};

/**
 * API Unificada para Historial
 */
export const historyDB = {
    async getAll() {
        const { data, error } = await supabase
            .from('history')
            .select('*')
            .order('fecha', { ascending: false });
        if (error) throw error;
        return data || [];
    },

    async getByClientId(clientId) {
        const { data, error } = await supabase
            .from('history')
            .select('*')
            .eq('client_id', clientId)
            .order('fecha', { ascending: false });
        if (error) throw error;
        return data || [];
    },

    async add(record) {
        const { data, error } = await supabase
            .from('history')
            .insert([record])
            .select()
            .single();
        if (error) throw error;
        return data;
    }
};

/**
 * API Unificada para Settings
 */
export const settingsDB = {
    async get() {
        const { data, error } = await supabase
            .from('settings')
            .select('*')
            .eq('id', 'app_settings')
            .single();
        if (error) throw error;
        return data?.data || {};
    },

    async update(newSettings) {
        const { data, error } = await supabase
            .from('settings')
            .update({ data: newSettings, updated_at: new Date().toISOString() })
            .eq('id', 'app_settings')
            .select()
            .single();
        if (error) throw error;
        return data?.data || {};
    }
};

/**
 * Real-time Subscription Helper
 */
export const subscribeToTable = (table, callback) => {
    if (!isSupabaseEnabled()) return { unsubscribe: () => { } };
    return supabase
        .channel(`public:${table}`)
        .on('postgres_changes', { event: '*', schema: 'public', table: table }, (payload) => {
            callback(payload);
        })
        .subscribe();
};
