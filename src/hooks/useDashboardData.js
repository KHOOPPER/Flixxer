import { useMemo } from 'react';

/**
 * Normaliza las suscripciones de un cliente.
 * @param {Object} client - Objeto cliente de la DB
 * @returns {Array} Lista normalizada de suscripciones
 */
const getSubscriptions = (client) => {
    if (!client.subscriptions) return [];
    let subs = client.subscriptions;

    if (typeof subs === 'string') {
        try { subs = JSON.parse(subs); } catch (e) { return []; }
    }

    if (Array.isArray(subs)) return subs;
    if (typeof subs === 'object') return Object.values(subs);

    return [];
};

export function useDashboardData(clients, platforms) {
    return useMemo(() => {
        const now = new Date();
        const in15 = new Date();
        in15.setDate(now.getDate() + 15);

        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        let monthlyRevenue = 0;

        const upcoming = [];
        const expired = [];
        const platformCounts = {};
        const platformRevenue = {};
        const revMap = {};

        // Inicializar revMap para los últimos 6 meses
        const labels = [];
        for (let i = 5; i >= 0; i--) {
            const d = new Date();
            d.setMonth(now.getMonth() - i);
            const lbl = d.toLocaleString('es-ES', { month: 'short' });
            labels.push(lbl);
            revMap[lbl] = 0;
        }

        clients.forEach(c => {
            const subs = getSubscriptions(c);
            subs.forEach(sub => {
                const monto = parseFloat(sub.monto) || 0;
                const name = sub.plataforma || 'Otro';

                // Ingresos Mensuales
                if (sub.fechaInicio) {
                    const d = new Date(sub.fechaInicio);
                    if (!isNaN(d.getTime())) {
                        if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
                            monthlyRevenue += monto;
                        }
                        const lbl = d.toLocaleString('es-ES', { month: 'short' });
                        if (revMap.hasOwnProperty(lbl)) {
                            revMap[lbl] += monto;
                        }
                    }
                }

                // Vencimientos
                if (sub.fechaVencimiento) {
                    const [y, m, d] = sub.fechaVencimiento.split('-').map(Number);
                    const vencDate = new Date(y, m - 1, d);
                    const nowZero = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                    const in15Zero = new Date(in15.getFullYear(), in15.getMonth(), in15.getDate());

                    const item = { client: c.nombre, plataforma: name, fecha: sub.fechaVencimiento };

                    if (vencDate < nowZero) {
                        expired.push(item);
                    } else if (vencDate >= nowZero && vencDate <= in15Zero) {
                        upcoming.push(item);
                    }
                }

                // Distribución y Top Servicios
                platformCounts[name] = (platformCounts[name] || 0) + 1;
                platformRevenue[name] = (platformRevenue[name] || 0) + monto;
            });
        });

        expired.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
        upcoming.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

        const topServices = Object.entries(platformRevenue)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 3);

        return {
            monthlyRevenue,
            upcoming,
            expired,
            platformCounts,
            labels,
            revMap,
            topServices,
            totalClients: clients.length,
            totalPlatforms: platforms.length
        };
    }, [clients, platforms]);
}
