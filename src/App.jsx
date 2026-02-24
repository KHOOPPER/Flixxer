import { Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { SettingsProvider } from './context/SettingsContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import ScrollToTop from './components/ScrollToTop';
import DashboardLayout from './layouts/DashboardLayout';
import { DataProvider } from './context/DataContext';

// Carga Perezosa de Páginas (Code Splitting)
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Clients = lazy(() => import('./pages/Clients'));
const AddClient = lazy(() => import('./pages/AddClient'));
const Platforms = lazy(() => import('./pages/Platforms'));
const AddPlatform = lazy(() => import('./pages/AddPlatform'));
const Settings = lazy(() => import('./pages/Settings'));
const Login = lazy(() => import('./pages/Login'));

/**
 * Loader minimalista para transiciones entre rutas
 */
const PageLoader = () => (
  <div className="flex h-[60vh] w-full items-center justify-center">
    <div className="w-8 h-8 border-2 border-pink-500/20 border-t-pink-500 rounded-full animate-spin"></div>
  </div>
);

function AppContent() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <DataProvider>
      <DashboardLayout>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/clients/add" element={<AddClient />} />
            <Route path="/platforms" element={<Platforms />} />
            <Route path="/platforms/add" element={<AddPlatform />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </DashboardLayout>
    </DataProvider>
  );
}

/**
 * Componente Raíz de la Aplicación.
 * Configura proveedores de contexto (Auth, Settings) y enrutamiento principal.
 */
export default function App() {
  // Capturar evento de instalación globalmente
  if (typeof window !== 'undefined') {

  }

  return (
    <AuthProvider>
      <SettingsProvider>
        <ScrollToTop />
        <Suspense fallback={<PageLoader />}>
          <AppContent />
        </Suspense>
      </SettingsProvider>
    </AuthProvider>
  );
}
