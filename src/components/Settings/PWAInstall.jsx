import React from 'react';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';

/**
 * Sección de Instalación PWA.
 */
const PWAInstall = ({ appName }) => {
    const handleInstallClick = async () => {
        const promptEvent = window.deferredPrompt;
        if (promptEvent) {
            promptEvent.prompt();
            const { outcome } = await promptEvent.userChoice;
            if (outcome === 'accepted') {
                window.deferredPrompt = null;
            }
        } else {
            alert('⚠️ Tu navegador no reporta que la App sea instalable.\n\nUsa el menú del navegador -> "Instalar App".');
        }
    };

    return (
        <section className="space-y-10">
            <div className="flex items-center gap-3">
                <ArrowDownTrayIcon className="w-[18px] h-[18px] text-orange-500" />
                <h3 className="text-sm font-black text-[var(--text-primary)] uppercase tracking-widest">Aplicación</h3>
            </div>

            <div className="insta-card p-10 bg-[var(--bg-color)] shadow-sm border border-[var(--border-color)] flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                    <h4 className="text-sm font-black text-[var(--text-primary)] uppercase tracking-tight mb-2">Instalar {appName}</h4>
                    <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest leading-relaxed">
                        Añade la App a tu pantalla de inicio para una experiencia completa a pantalla completa.
                    </p>
                </div>
                <button
                    type="button"
                    onClick={handleInstallClick}
                    className="shrink-0 px-8 py-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-orange-500/20 active:scale-95 transition-all hover:opacity-90"
                >
                    Instalar App
                </button>
            </div>
        </section>
    );
};

export default PWAInstall;
