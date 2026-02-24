import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../db/supabase';

const AuthContext = createContext();

const initialState = {
    isAuthenticated: false,
    loading: true
};

function authReducer(state, action) {
    switch (action.type) {
        case 'SET_AUTH':
            return { isAuthenticated: action.payload, loading: false };
        default:
            return state;
    }
}

export function AuthProvider({ children }) {
    const [state, dispatch] = React.useReducer(authReducer, initialState);
    const { isAuthenticated, loading } = state;

    useEffect(() => {
        // 1. Obtener sesión inicial
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            dispatch({ type: 'SET_AUTH', payload: !!session });
        };

        checkSession();

        // 2. Suscribirse a cambios de autenticación (Login/Logout/Refresh)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            dispatch({ type: 'SET_AUTH', payload: !!session });
        });

        return () => subscription.unsubscribe();
    }, []);

    const login = async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) throw error;
        return data;
    };

    const logout = async () => {
        await supabase.auth.signOut();
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
