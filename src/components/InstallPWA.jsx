import React, { useState, useEffect } from 'react';
import { useSettings } from '../context/SettingsContext';
import { ArrowDownTrayIcon, XMarkIcon, SparklesIcon } from '@heroicons/react/24/outline';

export default function InstallPWA() {
    const { settings } = useSettings();
    const appName = settings.appName || 'Flixxer';
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [isVisible, setIsVisible] = useState(false);
    const [isManual, setIsManual] = useState(false);

    useEffect(() => {
        // Detectar si ya está instalado
        if (window.matchMedia('(display-mode: standalone)').matches) {
            return;
        }

        const handler = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setIsVisible(true);
            setIsManual(false);
        };

        window.addEventListener('beforeinstallprompt', handler);

        // Para navegadores que no soportan el prompt automático (Firefox, Opera Mini, etc)
        // Mostramos un aviso manual después de 3 segundos si no se activó el prompt automático
        const timer = setTimeout(() => {
            if (!deferredPrompt && !window.matchMedia('(display-mode: standalone)').matches) {
                // Solo mostrar manual si es móvil o tablet (aproximación por touch)
                if ('ontouchstart' in window) {
                    setIsVisible(true);
                    setIsManual(true);
                }
            }
        }, 4000);

        window.addEventListener('appinstalled', () => {
            setIsVisible(false);
            setDeferredPrompt(null);
            alert(`¡${appName} instalado con éxito! 🎉 Revisa tu pantalla de inicio o cajón de aplicaciones.`);
        });

        return () => {
            window.removeEventListener('beforeinstallprompt', handler);
            clearTimeout(timer);
        };
    }, [deferredPrompt]);

    const handleInstallClick = async () => {
        if (isManual) {
            alert('Para instalar: Pulsa el menú de tu navegador (tres puntos o rayas) y elige "Añadir a la pantalla de inicio" o "Instalar App".');
            setIsVisible(false);
            return;
        }

        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') setDeferredPrompt(null);
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[100] w-[95%] max-w-sm animate-fade-in-up">
            <div className="bg-white rounded-[2.5rem] p-7 shadow-2xl shadow-black/30 relative overflow-hidden ring-1 ring-black/5">
                <button
                    onClick={() => setIsVisible(false)}
                    className="absolute top-6 right-6 text-gray-400 hover:text-black transition-colors p-2"
                >
                    <XMarkIcon className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-5">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#833ab4] via-[#fd1d1d] to-[#f56040] flex items-center justify-center shadow-lg shadow-pink-500/30 shrink-0 overflow-hidden">
                        {settings.appLogo ? (
                            <img src={settings.appLogo} alt="App Logo" className="w-full h-full object-cover" />
                        ) : (
                            <ArrowDownTrayIcon className="text-white w-7 h-7" strokeWidth={2.5} />
                        )}
                    </div>

                    <div className="flex-1 pr-6">
                        <div className="flex items-center gap-2">
                            <h4 className="text-black font-black text-sm uppercase tracking-tight">
                                {isManual ? `Instalar ${appName}` : 'Instalar App'}
                            </h4>
                            <SparklesIcon className="w-3.5 h-3.5 text-orange-500" />
                        </div>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1 leading-relaxed">
                            {isManual
                                ? `Usa el menú de tu navegador para añadir ${appName} a tu inicio.`
                                : 'Acceso directo rápido y experiencia completa a pantalla completa.'}
                        </p>
                    </div>
                </div>

                <button
                    onClick={handleInstallClick}
                    className="insta-button w-full mt-8 py-5 flex items-center justify-center gap-3 text-[11px] font-black uppercase tracking-[0.2em] shadow-xl shadow-pink-500/20 active:scale-95 transition-all"
                >
                    {isManual ? 'Ver Instrucciones' : 'Añadir a Inicio'}
                </button>
            </div>
        </div>
    );
}
