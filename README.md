# Flixxer — Panel de Gestión de Streaming

Plataforma administrativa para la gestión integral de clientes, venta de suscripciones de streaming (Netflix, Max, Spotify, Disney+, etc.) y control financiero. Desarrollada con React 19, Supabase y un diseño oscuro responsivo.

## Características

- **Dashboard** — Indicadores clave en tiempo real: ventas mensuales, clientes activos, servicios por vencer. Gráficos de ingresos y distribución por plataforma.
- **Gestión de Clientes** — Perfiles con múltiples suscripciones asociadas. Seguimiento de estados: activo, por vencer e inactivo.
- **Recordatorios WhatsApp** — Notificaciones automáticas para clientes con suscripciones próximas a vencer, con mensajes plantilla directos a WhatsApp.
- **Facturación** — Generación de tickets tipo recibo con desglose de pagos y facturas consolidadas por cliente.
- **Historial** — Registro detallado de cada transacción por cliente.
- **Configuración** — Nombre comercial, logotipo y moneda ajustables desde la aplicación.
- **Autenticación** — Inicio de sesión seguro mediante Supabase Auth con tokens JWT.

## Stack Tecnológico

| Tecnología | Uso |
|---|---|
| React 19 + Vite 7 | Frontend SPA |
| Tailwind CSS v4 | Estilos y diseño responsivo |
| Supabase (PostgreSQL) | Base de datos, autenticación y tiempo real |
| Heroicons + Lucide | Iconografía |
| Chart.js + Recharts | Visualización de datos |
| Vercel | Despliegue en producción |

## Seguridad

- Autenticación con Supabase Auth (JWT y sesiones gestionadas por el servidor).
- Row Level Security (RLS) activado en todas las tablas.
- Sin credenciales en el código fuente. Variables de entorno protegidas por `.gitignore`.

## Instalación

```bash
git clone https://github.com/KHOOPPER/Flixxer.git
cd Flixxer
npm install
```

Crear un archivo `.env` en la raíz del proyecto:

```env
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_anon_key_de_supabase
```

Iniciar el servidor de desarrollo:

```bash
npm run dev
```

## Estructura del Proyecto

```
src/
├── components/         Componentes reutilizables
│   ├── Dashboard/      KPIs, gráficos, listas de vencimiento
│   ├── Clients/        Tarjetas y modales de clientes
│   └── Settings/       Componentes de ajustes
├── context/            Contextos globales (Auth, Data, Settings)
├── hooks/              Hooks personalizados
├── reducers/           Reducers para estado complejo
├── pages/              Vistas principales
├── db/                 Configuración de Supabase y APIs
├── layouts/            Sidebar y estructura de navegación
└── styles/             CSS global
```

## Calidad de Código

- React Doctor: 100/100.
- Arquitectura modular con hooks, reducers y componentes extraídos.

---

© 2026 KHOOPPER | Flixxer
