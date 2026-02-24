import React, { useState } from 'react';
import { CheckIcon } from '@heroicons/react/24/outline';
import { db } from '../db/provider';

/**
 * Registro de Servicios: Minimalismo Vibrante (IG Style).
 * Presentación premium para dar de alta nuevas plataformas en el catálogo.
 */
export default function AddPlatform() {
  const [name, setName] = useState('');
  const [iconUrl, setIconUrl] = useState('');
  const [success, setSuccess] = useState('');

  const PRESETS = [
    { name: 'Netflix', icon: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg' },
    { name: 'Disney+', icon: 'https://upload.wikimedia.org/wikipedia/commons/3/3e/Disney%2B_logo.svg' },
    { name: 'HBO Max', icon: 'https://upload.wikimedia.org/wikipedia/commons/1/17/HBO_Max_Logo.svg' },
    { name: 'Prime Video', icon: 'https://upload.wikimedia.org/wikipedia/commons/f/f1/Prime_Video.png' },
    { name: 'Spotify', icon: 'https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg' },
    { name: 'YouTube', icon: 'https://upload.wikimedia.org/wikipedia/commons/0/09/YouTube_full-color_icon_%282017%29.svg' },
    { name: 'Star+', icon: 'https://upload.wikimedia.org/wikipedia/commons/7/71/Star%2B_logo.svg' },
    { name: 'Apple TV', icon: 'https://upload.wikimedia.org/wikipedia/commons/2/28/Apple_TV_Plus_Logo.svg' },
    { name: 'Crunchyroll', icon: 'https://upload.wikimedia.org/wikipedia/commons/f/f6/Crunchyroll_Logo.svg' },
  ];

  /**
   * Handles the selection of a preset platform.
   * Populates the name and iconUrl fields with the preset's data.
   * @param {object} preset - The selected preset object containing name and icon.
   * @param {string} preset.name - The name of the preset platform.
   * @param {string} preset.icon - The URL of the preset platform's icon.
   */
  const handlePreset = (preset) => {
    setName(preset.name);
    setIconUrl(preset.icon);
  };

  /**
   * Handles the form submission to add a new platform.
   * Prevents default form submission, validates input, and saves the platform to the database.
   * Displays a success message and clears the form upon successful submission.
   * @param {Event} e - The form submission event.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !iconUrl) return;

    try {
      await db.platforms.add({
        name,
        icon: iconUrl
      });

      setSuccess('Plataforma integrada con éxito');
      setName('');
      setIconUrl('');
      window.scrollTo({ top: 0, behavior: 'smooth' });

      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error al guardar plataforma:', err);
      alert('Error al guardar: ' + err.message);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-6 animate-minimal space-y-8">

      {/* Encabezado */}
      <div className="border-b border-[var(--border-color)] pb-4">
        <h2 className="text-2xl font-black text-[var(--text-primary)] tracking-tighter uppercase">NUEVA PLATAFORMA</h2>
        <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-[0.2em] mt-1">Gestión del Catálogo</p>
      </div>

      {/* Bloque Superior: Selección y Preview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">

        {/* Izquierda: Selección Rápida (Compacto) */}
        <div className="insta-card bg-[var(--bg-color)] shadow-sm flex flex-col h-full">
          <div className="px-6 py-4 border-b border-[var(--border-color)] bg-white/5">
            <h3 className="text-xs font-black text-[var(--text-primary)] tracking-widest uppercase">1. Selección Rápida</h3>
          </div>
          <div className="p-6 flex-1 flex items-center justify-center">
            <div className="grid grid-cols-3 gap-3 w-full max-w-[240px]">
              {PRESETS.map((p, i) => (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => handlePreset(p)}
                  className="aspect-square rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center p-3 transition-all duration-300 group/icon ring-1 ring-white/10 hover:ring-pink-500/50 hover:shadow-[0_0_15px_rgba(236,72,153,0.2)]"
                  title={p.name}
                >
                  <img src={p.icon} alt={p.name} className="w-full h-full object-contain filter grayscale opacity-60 group-hover/icon:grayscale-0 group-hover/icon:opacity-100 transition-all duration-300 transform group-hover/icon:scale-110" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Derecha: Preview Visual (Estilo Premium) */}
        <div className="insta-card bg-[var(--bg-color)] shadow-sm flex flex-col h-full relative overflow-hidden group border border-[var(--border-color)]">
          <div className="px-6 py-4 border-b border-[var(--border-color)] bg-white/5 z-10 relative">
            <h3 className="text-xs font-black text-[var(--text-primary)] tracking-widest uppercase">2. Vista Previa</h3>
          </div>

          <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/5 via-purple-500/5 to-transparent opacity-50"></div>

          <div className="p-10 flex-1 flex flex-col items-center justify-center relative z-10 gap-6">
            <div className="w-28 h-28 border border-[var(--border-color)] p-5 flex items-center justify-center bg-white rounded-3xl shadow-xl shadow-black/10 backdrop-blur-md">
              {iconUrl ? (
                <img src={iconUrl} alt="Preview" className="w-full h-full object-contain filter drop-shadow-md" />
              ) : (
                <div className="text-4xl text-gray-200 font-black">?</div>
              )}
            </div>

            <div className="text-center">
              <h2 className="text-2xl font-black uppercase text-[var(--text-primary)] tracking-tighter leading-none mb-2">
                {name || 'PLATAFORMA'}
              </h2>
              <span className="text-[9px] font-bold text-pink-500 uppercase tracking-widest opacity-80">Activa y Visible</span>
            </div>
          </div>
        </div>

      </div>

      {/* Bloque Inferior: Formulario Detalles (Barra Horizontal) */}
      <div className="insta-card bg-[var(--bg-color)] shadow-sm relative overflow-hidden">
        <div className="px-6 py-4 border-b border-[var(--border-color)] bg-white/5">
          <h3 className="text-xs font-black text-[var(--text-primary)] tracking-widest uppercase">3. Detalles Finales</h3>
        </div>

        <form onSubmit={handleSubmit} className="p-6 md:p-8 flex flex-col md:flex-row items-center gap-6">

          <div className="flex-1 w-full space-y-2">
            <label htmlFor="plat-name" className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-widest ml-1">Nombre</label>
            <input
              id="plat-name"
              type="text"
              placeholder="Nombre de la Plataforma"
              className="insta-input rounded-xl py-3 px-5 font-bold w-full"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>

          <div className="flex-[2] w-full space-y-2">
            <label htmlFor="plat-logo" className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-widest ml-1">URL del Logo</label>
            <input
              id="plat-logo"
              type="url"
              placeholder="https://..."
              className="insta-input rounded-xl py-3 px-5 w-full font-mono text-sm"
              value={iconUrl}
              onChange={e => setIconUrl(e.target.value)}
              required
            />
          </div>

          <div className="w-full md:w-auto pt-5">
            <button
              type="submit"
              disabled={!name || !iconUrl}
              className="insta-button w-full md:w-auto px-10 py-4 text-xs font-black uppercase tracking-[0.2em] shadow-lg shadow-pink-500/20 disabled:opacity-20 whitespace-nowrap"
            >
              GUARDAR
            </button>
          </div>

        </form>

        {success && (
          <div className="absolute inset-0 bg-[var(--bg-color)]/95 backdrop-blur-sm flex items-center justify-center z-20">
            <div className="flex items-center gap-4 animate-minimal">
              <div className="w-10 h-10 rounded-full border-2 border-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <CheckIcon className="w-5 h-5 text-emerald-500" />
              </div>
              <div>
                <h3 className="text-sm font-black text-[var(--text-primary)] tracking-tight uppercase">¡Guardado Exitoso!</h3>
                <button onClick={() => setSuccess('')} className="text-[9px] font-bold text-pink-500 uppercase tracking-widest hover:underline mt-1">
                  Añadir otra
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
