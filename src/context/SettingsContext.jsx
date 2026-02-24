import React, { createContext, useState, useEffect, useContext } from 'react';
import { db } from '../db/provider';

const SettingsContext = createContext();

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider = ({ children }) => {
    const [settings, setSettings] = useState({
        appName: 'FireFlixx',
        appLogo: null,
        theme: localStorage.getItem('theme') || 'dark',
        appAccent: '#0095f6',
        sidebarCollapsed: false
    });

    // Función para actualizar Manifest y Favicon dinámicamente
    const updateManifest = (appName, appLogo, themeColor) => {
        const logoUrl = appLogo || '/vite.svg';
        const safeColor = themeColor === 'light' ? '#ffffff' : '#000000';

        // 1. Actualizar Favicon y Apple Touch Icon
        const updateLink = (rel, href) => {
            let link = document.querySelector(`link[rel~='${rel}']`);
            if (!link) {
                link = document.createElement('link');
                link.rel = rel;
                document.head.appendChild(link);
            }
            link.href = href;
        };
        updateLink('icon', logoUrl);
        updateLink('apple-touch-icon', logoUrl);

        // 2. Actualizar Meta Theme Color (Barra de navegador móvil)
        let metaTheme = document.querySelector("meta[name='theme-color']");
        if (!metaTheme) {
            metaTheme = document.createElement('meta');
            metaTheme.name = 'theme-color';
            document.head.appendChild(metaTheme);
        }
        metaTheme.content = safeColor;

        // 3. Actualizar Título
        document.title = `${appName} | Panel Administrativo`;

        // 4. Generar Manifiesto Dinámico
        const manifest = {
            name: appName,
            short_name: appName,
            start_url: window.location.origin,
            display: "standalone",
            background_color: safeColor,
            theme_color: safeColor,
            icons: [
                {
                    src: logoUrl,
                    sizes: "192x192",
                    type: "image/png",
                    purpose: "any maskable"
                },
                {
                    src: logoUrl,
                    sizes: "512x512",
                    type: "image/png",
                    purpose: "any maskable"
                }
            ]
        };

        const stringManifest = JSON.stringify(manifest);
        const blob = new Blob([stringManifest], { type: 'application/json' });
        const manifestURL = URL.createObjectURL(blob);

        let manifestLink = document.querySelector('#dynamic-manifest');
        if (!manifestLink) {
            manifestLink = document.createElement('link');
            manifestLink.id = 'dynamic-manifest';
            manifestLink.rel = 'manifest';
            document.head.appendChild(manifestLink);
        }
        manifestLink.href = manifestURL;
    };


    // Cargar settings iniciales de DB
    useEffect(() => {
        let mounted = true;
        const loadSettings = async () => {
            try {
                const saved = await db.settings.get('current');
                if (mounted && saved) {
                    setSettings(prev => ({ ...prev, ...saved }));

                    // Aplicar tema inmediatamente
                    if (saved.theme) {
                        document.documentElement.setAttribute('data-theme', saved.theme);
                        localStorage.setItem('theme', saved.theme);
                    }

                    // Aplicar Branding Dinámico
                    updateManifest(saved.appName || 'FireFlixx', saved.appLogo, saved.theme);
                }
            } catch (error) {
                console.error("Error cargando configuración:", error);
            }
        };
        loadSettings();
        return () => { mounted = false; };
    }, []);

    const updateSettings = async (newSettings) => {
        // 1. Actualizar estado local inmediatamente (Optimistic UI)
        setSettings(prev => {
            const updated = { ...prev, ...newSettings };
            // Aplicar efectos secundarios visuales
            if (newSettings.theme) {
                document.documentElement.setAttribute('data-theme', newSettings.theme);
                localStorage.setItem('theme', newSettings.theme);
            }

            // Actualizar Manifest si cambia branding
            if (newSettings.appName || newSettings.appLogo || newSettings.theme) {
                const finalName = newSettings.appName || updated.appName;
                const finalLogo = newSettings.appLogo || updated.appLogo;
                const finalTheme = newSettings.theme || updated.theme;
                updateManifest(finalName, finalLogo, finalTheme);
            }

            return updated;
        });

        // 2. Persistir en Supabase
        try {
            // Combinar estado actual con nuevos cambios para asegurar integridad
            const currentSettings = await db.settings.get('current');
            const merged = { ...currentSettings, ...newSettings, id: 'current' };
            await db.settings.put(merged);
        } catch (error) {
            console.error("Error guardando configuración:", error);
            // Opcional: Revertir estado si falla
        }
    };

    const toggleSidebar = () => {
        setSettings(prev => {
            const newState = { ...prev, sidebarCollapsed: !prev.sidebarCollapsed };
            updateSettings({ sidebarCollapsed: newState.sidebarCollapsed }); // Persistir cambio
            return newState;
        });
    };

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => setMobileMenuOpen(prev => !prev);
    const closeMobileMenu = () => setMobileMenuOpen(false);

    return (
        <SettingsContext.Provider value={{ settings, updateSettings, toggleSidebar, mobileMenuOpen, toggleMobileMenu, closeMobileMenu }}>
            {children}
        </SettingsContext.Provider>
    );
};
