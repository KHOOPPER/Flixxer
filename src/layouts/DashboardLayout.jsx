import React from 'react';
import Sidebar from './Sidebar';


import { useSettings } from '../context/SettingsContext';
import WhatsAppReminders from '../components/WhatsAppReminders';

/**
 * Layout principal del Dashboard.
 */
export default function DashboardLayout({ children }) {
  const { settings, toggleMobileMenu } = useSettings();

  return (
    <div className="h-screen flex overflow-hidden text-gray-100 font-sans selection:bg-indigo-500/30 bg-black">
      {/* Sidebar: Responsive (Drawer on Mobile, Fixed on Desktop) */}
      <Sidebar />

      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out bg-[var(--bg-color)]
          ${settings.sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-72'} h-screen overflow-hidden relative w-full`}
      >
        {/* Cabecera Móvil (Con botón de menú) */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-[var(--border-color)] bg-[var(--bg-color)] sticky top-0 z-40">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-pink-500/20 overflow-hidden">
              {settings.appLogo ? (
                <img src={settings.appLogo} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                <span className="text-white font-black text-sm uppercase">{settings.appName ? settings.appName.charAt(0) : 'F'}</span>
              )}
            </div>
            <span className="font-black text-lg text-[var(--text-primary)] tracking-tighter uppercase">{settings.appName}</span>
          </div>
          <button
            onClick={toggleMobileMenu}
            className="p-2 text-[var(--text-secondary)] hover:text-pink-500 transition-colors"
          >
            {/* Hamburger Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
          </button>
        </div>

        {/* Contenido Principal */}
        <main className="flex-1 overflow-y-auto custom-scrollbar p-4 lg:p-10">
          <div className="max-w-[1920px] mx-auto space-y-8 animate-fade-in pb-20 lg:pb-0">
            {children}
          </div>
        </main>


      </div>
      {/* WhatsApp Reminders Global Widget */}
      <WhatsAppReminders />
    </div>
  );
}
