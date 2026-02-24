import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Componente que reinicia el scroll al tope de la página en cada cambio de ruta.
 */
export default function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
}
