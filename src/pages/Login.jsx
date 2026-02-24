import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { Lock, LogIn } from 'lucide-react';

const initialState = {
    email: '',
    password: '',
    error: '',
    loading: false,
    mousePos: { x: 0, y: 0 }
};

function loginReducer(state, action) {
    switch (action.type) {
        case 'SET_FIELD': return { ...state, [action.field]: action.value };
        case 'SET_ERROR': return { ...state, error: action.payload, loading: false };
        case 'START_LOGIN': return { ...state, loading: true, error: '' };
        case 'SET_MOUSE': return { ...state, mousePos: action.payload };
        default: return state;
    }
}

export default function Login() {
    const [state, dispatch] = React.useReducer(loginReducer, initialState);
    const { email, password, error, loading, mousePos } = state;
    const { login } = useAuth();
    const { settings } = useSettings();
    const { appName, appLogo } = settings;

    const handleMouseMove = (e) => {
        dispatch({ type: 'SET_MOUSE', payload: { x: e.clientX, y: e.clientY } });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch({ type: 'START_LOGIN' });
        try {
            await login(email, password);
            window.location.href = '/';
        } catch (err) {
            dispatch({ type: 'SET_ERROR', payload: err.message || 'Error al iniciar sesión' });
            setTimeout(() => dispatch({ type: 'SET_FIELD', field: 'error', value: '' }), 4000);
        }
    };

    // ... (estrellas y meteoros se mantienen igual)
    const stars = useMemo(() => Array.from({ length: 100 }).map((_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        size: `${Math.random() * 2.5 + 0.5}px`,
        animationDelay: `${Math.random() * 5}s`,
        opacity: Math.random() * 0.6 + 0.2
    })), []);

    const shootingStars = useMemo(() => Array.from({ length: 5 }).map((_, i) => ({
        id: i,
        top: `${-10 + Math.random() * 40}%`,
        left: `${40 + Math.random() * 60}%`,
        animationDelay: `${i * 15}s`,
        animationDuration: '75s'
    })), []);

    return (
        <div
            className="min-h-screen w-full flex items-center justify-center bg-black p-6 relative overflow-hidden"
            onMouseMove={handleMouseMove}
        >
            {/* 🌌 Starry Night Layer */}
            <div className="absolute inset-0 pointer-events-none z-0">
                {stars.map(star => (
                    <div
                        key={`star-${star.id}`}
                        className="star"
                        style={{
                            left: star.left,
                            top: star.top,
                            width: star.size,
                            height: star.size,
                            animationDelay: star.animationDelay,
                            opacity: star.opacity
                        }}
                    />
                ))}
                {shootingStars.map(shooting => (
                    <div
                        key={`shooting-${shooting.id}`}
                        className="shooting-star"
                        style={{
                            top: shooting.top,
                            left: shooting.left,
                            animationDelay: shooting.animationDelay,
                            animationDuration: shooting.animationDuration
                        }}
                    />
                ))}
            </div>

            {/* 👻 Espectro Interactivo */}
            <div
                className="absolute inset-0 pointer-events-none z-0 mix-blend-screen"
                style={{
                    background: `radial-gradient(800px circle at ${mousePos.x}px ${mousePos.y}px, rgba(125, 211, 252, 0.12), transparent 50%)`
                }}
            />

            <div className={`relative z-10 w-full max-w-md insta-card p-10 md:p-12 space-y-8 animate-fade-in-up transition-all ${error ? 'shake ring-2 ring-rose-500/50' : ''}`}>
                <div className="text-center space-y-4">
                    <div className="flex justify-center mb-6">
                        {appLogo ? (
                            <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-white/10 shadow-2xl shadow-black/50 flex items-center justify-center bg-white/5 mx-auto">
                                <img src={appLogo} alt="Logo" className="w-full h-full object-cover" />
                            </div>
                        ) : (
                            <div className="inline-flex p-5 rounded-full bg-gradient-to-tr from-[#833ab4] via-[#fd1d1d] to-[#f56040] shadow-xl shadow-pink-500/20 items-center justify-center">
                                <Lock className="text-white" size={28} />
                            </div>
                        )}
                    </div>
                    <h1 className="text-3xl font-black text-white tracking-tighter uppercase">{appName || 'Panel Administrativo'}</h1>
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.3em]">{error ? <span className="text-rose-500">{error}</span> : 'Acceso Industrial Protegido'}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label htmlFor="email-field" className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Correo Electrónico</label>
                        <input
                            id="email-field"
                            type="email"
                            value={email}
                            onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'email', value: e.target.value })}
                            className="insta-input !bg-white/5 !border-white/10 text-white text-sm font-bold py-4 px-6 rounded-2xl focus:!bg-white/10 transition-all w-full"
                            placeholder="admin@ejemplo.com"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="password-field" className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Contraseña</label>
                        <input
                            id="password-field"
                            type="password"
                            value={password}
                            onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'password', value: e.target.value })}
                            className="insta-input !bg-white/5 !border-white/10 text-white text-sm font-bold py-4 px-6 rounded-2xl focus:!bg-white/10 transition-all w-full tracking-widest"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="insta-button w-full py-4 flex items-center justify-center gap-4 text-xs font-black uppercase tracking-[0.2em] shadow-xl shadow-pink-500/30 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <LogIn size={18} />}
                        {loading ? 'Verificando...' : 'Entrar al Sistema'}
                    </button>
                </form>
            </div>
        </div>
    );
}
