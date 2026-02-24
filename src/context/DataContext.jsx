import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { db } from '../db/provider';
import { useRealtime } from '../hooks/useRealtime';

const DataContext = createContext();

export function useData() {
    return useContext(DataContext);
}

export function DataProvider({ children }) {
    const [clients, setClients] = useState([]);
    const [platforms, setPlatforms] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const loadData = useCallback(async () => {
        try {
            const c = await db.clients.toArray();
            const p = await db.platforms.toArray();
            setClients(c);
            setPlatforms(p);
        } catch (error) {
            console.error("Error cargando datos:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    // Sincronización Global en Tiempo Real
    useRealtime('clients', loadData);
    useRealtime('platforms', loadData);

    return (
        <DataContext.Provider value={{ clients, setClients, platforms, setPlatforms, isLoading, refreshData: loadData }}>
            {children}
        </DataContext.Provider>
    );
}
