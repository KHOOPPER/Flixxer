import React from 'react';
import { NavLink } from 'react-router-dom';
import { Squares2X2Icon, UsersIcon, UserPlusIcon, ComputerDesktopIcon, SquaresPlusIcon, Cog6ToothIcon, ChevronLeftIcon, ChevronRightIcon, ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline';
import { useSettings } from '../context/SettingsContext';
import { useAuth } from '../context/AuthContext';

/**
 * Sidebar: Estilo Minimalista Vibrante (IG Style).
 * Navegación limpia con jerarquía marcada y transiciones de color.
 */
export default function Sidebar() {
  const { settings, toggleSidebar, mobileMenuOpen, closeMobileMenu } = useSettings();
  const { logout } = useAuth();
  const { sidebarCollapsed, appName, appLogo } = settings;

  const linkClass = ({ isActive }) =>
    `flex items-center gap-4 px-6 py-4 transition-all duration-300 group relative ${isActive
      ? 'text-[var(--text-primary)] font-black'
      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-color)]'
    } ${sidebarCollapsed ? 'justify-center px-0' : ''}`;

  const handleLinkClick = () => {
    if (mobileMenuOpen) closeMobileMenu();
  };

  return (
    <>
      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/80 z-[55] lg:hidden backdrop-blur-sm transition-opacity"
          onClick={closeMobileMenu}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && closeMobileMenu()}
          role="button"
          tabIndex={-1}
          aria-label="Cerrar menú"
        />
      )}

      <aside
        className={`fixed left-0 top-0 h-screen bg-[var(--bg-color)] border-r border-[var(--border-color)] flex flex-col z-[60] transition-transform duration-300 lg:translate-x-0
          ${mobileMenuOpen ? 'translate-x-0 w-72' : '-translate-x-full lg:w-72'}
          ${sidebarCollapsed ? 'lg:w-20' : 'lg:w-72'}
        `}
      >
        <div className={`p-10 flex items-center ${sidebarCollapsed ? 'justify-center p-0 pt-10' : 'justify-between'} mb-8`}>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-pink-500/20 overflow-hidden">
              {appLogo ? (
                <img src={appLogo} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                <span className="text-white font-black text-xl uppercase">{appName.charAt(0)}</span>
              )}
            </div>
            {!sidebarCollapsed && (
              <span className="font-black text-xl tracking-tighter text-[var(--text-primary)] uppercase">
                {appName}
              </span>
            )}
          </div>

          {!sidebarCollapsed && (
            <button
              onClick={toggleSidebar}
              className="p-2 text-[var(--text-secondary)] hover:text-pink-500 transition-colors"
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </button>
          )}

          {sidebarCollapsed && (
            <button
              onClick={toggleSidebar}
              className="absolute -right-3 top-12 bg-[var(--bg-color)] border border-[var(--border-color)] p-1 rounded-full text-[var(--text-primary)]"
            >
              <ChevronRightIcon className="w-3 h-3" />
            </button>
          )}
        </div>

        <nav className="flex flex-col gap-1 flex-1 overflow-y-auto custom-scrollbar">
          <NavLink to="/" className={linkClass} onClick={handleLinkClick}>
            <Squares2X2Icon className="shrink-0 group-hover:text-pink-500 transition-colors w-[22px] h-[22px]" />
            {!sidebarCollapsed && <span className="text-sm tracking-tight uppercase font-black">Dashboard</span>}
            <div className="absolute left-0 w-1 h-6 bg-pink-500 scale-y-0 group-[.active]:scale-y-100 transition-transform rounded-r-full" />
          </NavLink>

          {!sidebarCollapsed && <p className="px-10 mt-10 mb-4 text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-[0.4em] opacity-60">Gestión de Clientes y Pagos</p>}

          <NavLink to="/clients" className={linkClass} onClick={handleLinkClick}>
            <UsersIcon className="shrink-0 group-hover:text-purple-500 transition-colors w-[22px] h-[22px]" />
            {!sidebarCollapsed && <span className="text-sm tracking-tight uppercase font-black">Clientes</span>}
            <div className="absolute left-0 w-1 h-6 bg-purple-500 scale-y-0 group-[.active]:scale-y-100 transition-transform rounded-r-full" />
          </NavLink>

          <NavLink to="/clients/add" className={linkClass} onClick={handleLinkClick}>
            <UserPlusIcon className="shrink-0 group-hover:text-emerald-500 transition-colors w-[22px] h-[22px]" />
            {!sidebarCollapsed && <span className="text-sm tracking-tight uppercase font-black">Agregar Cliente</span>}
            <div className="absolute left-0 w-1 h-6 bg-emerald-500 scale-y-0 group-[.active]:scale-y-100 transition-transform rounded-r-full" />
          </NavLink>

          {!sidebarCollapsed && <p className="px-10 mt-10 mb-4 text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-[0.4em] opacity-60">Servicios</p>}

          <NavLink to="/platforms" className={linkClass} onClick={handleLinkClick}>
            <ComputerDesktopIcon className="shrink-0 group-hover:text-orange-500 transition-colors w-[22px] h-[22px]" />
            {!sidebarCollapsed && <span className="text-sm tracking-tight uppercase font-black">Plataformas</span>}
            <div className="absolute left-0 w-1 h-6 bg-orange-500 scale-y-0 group-[.active]:scale-y-100 transition-transform rounded-r-full" />
          </NavLink>

          <NavLink to="/platforms/add" className={linkClass} onClick={handleLinkClick}>
            <SquaresPlusIcon className="shrink-0 group-hover:text-pink-500 transition-colors w-[22px] h-[22px]" />
            {!sidebarCollapsed && <span className="text-sm tracking-tight uppercase font-black">Nueva Plataforma</span>}
            <div className="absolute left-0 w-1 h-6 bg-pink-500 scale-y-0 group-[.active]:scale-y-100 transition-transform rounded-r-full" />
          </NavLink>
        </nav>

        <div className="p-8 mt-auto border-t border-[var(--border-color)] space-y-2">
          <NavLink to="/settings" className={linkClass} onClick={handleLinkClick}>
            <Cog6ToothIcon className="shrink-0 group-hover:rotate-90 transition-all duration-500 w-[22px] h-[22px]" />
            {!sidebarCollapsed && <span className="text-sm tracking-tight uppercase font-black">Ajustes</span>}
          </NavLink>

          <button
            onClick={logout}
            className={`${linkClass({ isActive: false })} w-full !text-[var(--text-primary)] hover:!bg-white/5`}
          >
            <ArrowLeftOnRectangleIcon className="shrink-0 w-[22px] h-[22px]" />
            {!sidebarCollapsed && <span className="text-sm tracking-tight uppercase font-black">Cerrar Sesión</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
