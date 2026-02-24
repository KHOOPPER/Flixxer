import React from 'react';
import { SunIcon, MoonIcon, SparklesIcon } from '@heroicons/react/24/outline';

/**
 * Selector de Tema: Permite alternar entre modo claro y oscuro.
 */
const ThemeSelector = ({ currentTheme, onSetTheme }) => {
    return (
        <section className="space-y-10">
            <div className="flex items-center gap-3">
                <SparklesIcon className="w-[18px] h-[18px] text-pink-500" />
                <h3 className="text-sm font-black text-[var(--text-primary)] uppercase tracking-widest">Estética y Color</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <button
                    type="button"
                    onClick={() => onSetTheme('light')}
                    className={`insta-card p-12 flex flex-col items-center gap-6 transition-all group relative !bg-white border border-gray-100 ${currentTheme === 'light' ? 'ring-2 ring-pink-500 shadow-lg shadow-pink-500/10' : 'opacity-60 hover:opacity-100'}`}
                >
                    <div className={`p-6 rounded-full ${currentTheme === 'light' ? 'bg-orange-100 text-orange-500' : 'bg-gray-50 text-gray-400'} transition-colors shadow-inner`}>
                        <SunIcon className="w-10 h-10" strokeWidth={2.5} />
                    </div>
                    <div className="text-center">
                        <span className="block text-base font-black !text-black uppercase tracking-widest leading-none">Modo Día</span>
                        <span className="text-[9px] !text-gray-500 uppercase font-black tracking-widest mt-2 opacity-70 block">Daylight Minimal</span>
                    </div>
                </button>

                <button
                    type="button"
                    onClick={() => onSetTheme('dark')}
                    className={`insta-card p-12 flex flex-col items-center gap-6 transition-all group relative !bg-[#0a0a0a] border border-gray-800 ${currentTheme === 'dark' ? 'ring-2 ring-purple-500 shadow-lg shadow-purple-500/10' : 'opacity-60 hover:opacity-100'}`}
                >
                    <div className={`p-6 rounded-full ${currentTheme === 'dark' ? 'bg-purple-900/50 text-purple-400' : 'bg-gray-900 text-gray-600'} transition-colors shadow-inner`}>
                        <MoonIcon className="w-10 h-10" strokeWidth={2.5} />
                    </div>
                    <div className="text-center">
                        <span className="block text-base font-black !text-white uppercase tracking-widest leading-none">Modo Noche</span>
                        <span className="text-[9px] !text-gray-400 uppercase font-black tracking-widest mt-2 opacity-70 block">Midnight Minimal</span>
                    </div>
                </button>
            </div>
        </section>
    );
};

export default ThemeSelector;
