import React from 'react';
import { ComputerDesktopIcon } from '@heroicons/react/24/outline';

/**
 * Formulario de Identidad: Permite cambiar el nombre y el logo de la aplicación.
 */
const BrandingForm = ({ appName, setAppName, appLogo, setAppLogo }) => {
    return (
        <section className="space-y-10">
            <div className="flex items-center gap-3">
                <ComputerDesktopIcon className="w-[18px] h-[18px] text-indigo-500" />
                <h3 className="text-sm font-black text-[var(--text-primary)] uppercase tracking-widest">Identidad Global</h3>
            </div>

            <div className="insta-card p-10 md:p-14 space-y-12 bg-[var(--bg-color)] shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-3">
                        <label htmlFor="settings-app-name" className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest ml-1">Nombre Comercial</label>
                        <input
                            id="settings-app-name"
                            type="text"
                            value={appName}
                            onChange={(e) => setAppName(e.target.value)}
                            className="insta-input text-xl font-black tracking-tighter py-4 px-6 rounded-2xl"
                            placeholder="FireFlixx"
                        />
                    </div>

                    <div className="space-y-3">
                        <label htmlFor="settings-app-logo" className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest ml-1">Logotipo (URL)</label>
                        <input
                            id="settings-app-logo"
                            type="text"
                            value={appLogo}
                            onChange={(e) => setAppLogo(e.target.value)}
                            className="insta-input text-base font-bold py-4 px-6 rounded-2xl"
                            placeholder="https://..."
                        />
                    </div>
                </div>

                <div className="flex flex-col items-center pt-10 border-t border-[var(--border-color)]">
                    <p className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-[0.3em] mb-6">Previsualización de Perfil</p>
                    <div className="w-40 h-40 rounded-full bg-gradient-to-tr from-[#833ab4] via-[#fd1d1d] to-[#f56040] p-1 shadow-2xl shadow-pink-500/20">
                        <div className="w-full h-full rounded-full bg-[var(--bg-color)] flex items-center justify-center overflow-hidden">
                            {appLogo ? (
                                <img src={appLogo} alt="Logo" className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-5xl font-black text-[var(--text-primary)] tracking-tighter">{appName?.charAt(0).toUpperCase()}</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BrandingForm;
