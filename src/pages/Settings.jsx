import React, { useState } from 'react';
import { useSettings } from '../context/SettingsContext';
import { ComputerDesktopIcon, ArrowDownOnSquareIcon, MoonIcon, SunIcon, SparklesIcon, ArrowLeftOnRectangleIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import ThemeSelector from '../components/Settings/ThemeSelector';
import BrandingForm from '../components/Settings/BrandingForm';
import PWAInstall from '../components/Settings/PWAInstall';
import { db } from '../db/provider';

/**
 * Ajustes de Sistema: Minimalismo Vibrante (IG Style).
 * Presentación premium para la selección de temas y branding.
 */
export default function Settings() {
    const { settings, updateSettings } = useSettings();
    const { logout } = useAuth();
    const [appName, setAppName] = useState(settings.appName);
    const [appLogo, setAppLogo] = useState(settings.appLogo || '');
    const [msg, setMsg] = useState('');

    const handleSave = (e) => {
        e.preventDefault();
        updateSettings({
            appName: appName.trim() || 'FireFlixx',
            appLogo: appLogo,
        });
        setMsg('Configuración guardada correctamente');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setTimeout(() => setMsg(''), 3000);
    };

    /**
     * Establece el tema visual de la aplicación (claro u oscuro).
     * @param {string} theme - El nombre del tema a aplicar ('light' o 'dark').
     */
    const setTheme = (theme) => {
        updateSettings({ theme });
    };

    /**
     * Alterna entre el tema claro y oscuro.
     * Guarda la preferencia en el contexto global.
     */
    const toggleTheme = () => {
        const newTheme = settings.theme === 'dark' ? 'light' : 'dark';
        updateSettings({ theme: newTheme });
    };

    /**
     * Exporta una copia de seguridad de los datos de la aplicación (clientes, plataformas, ajustes, historial)
     * en formato JSON y la descarga como un archivo.
     */
    const handleExportBackup = async () => {
        try {
            const clients = await db.clients.toArray();
            const platforms = await db.platforms.toArray();
            const settings = await db.settings.get('current') || {};
            const history = await db.history.toArray();

            const data = {
                clientes: clients,
                platforms: platforms,
                flixxer_settings: settings,
                history: history,
                exportDate: new Date().toISOString(),
                version: '3.0-cloud-only'
            };

            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `flixxer_cloud_backup_${new Date().toISOString().split('T')[0]}.json`;
            link.click();
            URL.revokeObjectURL(url);
            alert('☁️ Copia de seguridad Cloud exportada con éxito.');
        } catch (err) {
            console.error('Error al exportar:', err);
            alert('❌ Error al generar backup de la nube.');
        }
    };

    /**
     * Importa datos de una copia de seguridad JSON, sobrescribiendo los datos existentes en la base de datos.
     * Requiere confirmación del usuario antes de proceder.
     * @param {Event} e - El evento de cambio del input de archivo.
     */
    const handleImportBackup = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                const data = JSON.parse(event.target.result);

                if (confirm('⚠️ ¿Sobrescribir datos en la NUBE? Esta acción no se puede deshacer.')) {
                    // Importación secuencial (Supabase no soporta transacciones complejas via cliente JS fácilmente, 
                    // así que lo hacemos uno por uno para asegurar consistencia básica)

                    // 1. Clientes
                    if (data.clientes?.length) {
                        // Nota: En un entorno real idealmente borraríamos todo antes, 
                        // pero por seguridad en cloud solo agregaremos/actualizaremos lo que venga en el backup
                        for (const c of data.clientes) {
                            delete c.id; // Dejar que Supabase genere nuevos IDs
                            await db.clients.add(c);
                        }
                    }

                    // 2. Plataformas
                    if (data.platforms?.length) {
                        for (const p of data.platforms) {
                            delete p.id;
                            await db.platforms.add(p);
                        }
                    }

                    // 3. Settings
                    if (data.flixxer_settings) {
                        await db.settings.put({ id: 'current', ...data.flixxer_settings });
                    }

                    // 4. Historial
                    if (data.history?.length) {
                        for (const h of data.history) {
                            delete h.id;
                            await db.history.add(h);
                        }
                    }

                    alert('✅ Datos importados a la nube. Recargando...');
                    window.location.reload();
                }
            } catch (err) {
                console.error('Error al importar:', err);
                alert('❌ Error al importar backup.');
            }
        };
        reader.readAsText(file);
    };

    /**
     * Cierra la sesión del usuario actual.
     */
    const handleLogout = () => {
        if (window.confirm('¿Cerrar sesión?')) {
            logout();
            window.location.href = '/login';
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-12 animate-minimal pb-24 px-4">
            {/* Cabecera */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[var(--border-color)] pb-10">
                <div>
                    <h2 className="text-4xl font-black text-[var(--text-primary)] tracking-tighter">PREFERENCIAS</h2>
                    <div className="flex items-center gap-2 mt-2">
                        <span className="h-1 w-8 bg-gradient-to-r from-orange-400 to-pink-500 rounded-full"></span>
                        <p className="text-[var(--text-secondary)] text-[10px] font-bold uppercase tracking-[0.3em]">Personalización del Sistema</p>
                    </div>
                </div>
                {msg && (
                    <div className="text-[10px] font-black text-pink-500 bg-pink-500/10 px-4 py-2 rounded-full uppercase tracking-widest animate-pulse border border-pink-500/20">
                        {msg}
                    </div>
                )}
            </div>

            <form onSubmit={handleSave} className="space-y-16">
                <ThemeSelector currentTheme={settings.theme} onSetTheme={setTheme} />
                <BrandingForm appName={appName} setAppName={setAppName} appLogo={appLogo} setAppLogo={setAppLogo} />
                <PWAInstall appName={appName} />

                {/* Acción Principal */}
                <div className="flex flex-col md:flex-row justify-end items-center gap-6 pt-10 border-t border-[var(--border-color)]">
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full md:w-auto px-12 py-5 flex items-center justify-center gap-4 text-xs font-black uppercase tracking-[0.2em] text-[var(--text-primary)] bg-white/5 hover:bg-white/10 border border-[var(--border-color)] rounded-2xl transition-all active:scale-95"
                    >
                        <ArrowLeftOnRectangleIcon className="w-5 h-5" />
                        Cerrar Sesión
                    </button>

                    <button
                        type="submit"
                        className="insta-button w-full md:w-auto px-16 py-5 flex items-center justify-center gap-4 text-sm font-black uppercase tracking-[0.2em] shadow-xl shadow-pink-500/30"
                    >
                        <ArrowDownOnSquareIcon className="w-6 h-6" />
                        Aplicar Configuración
                    </button>
                </div>
            </form>
        </div>
    );
}
