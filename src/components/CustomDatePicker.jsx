import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeftIcon, ChevronRightIcon, XMarkIcon, CalendarIcon } from '@heroicons/react/24/outline';

/**
 * CustomDatePicker: Minimalismo Vibrante (IG Style).
 * Un calendario personalizado que sustituye al nativo para mantener la estética premium.
 */
export default function CustomDatePicker({ value, onChange, isOpen, onClose, label = "Seleccionar Fecha" }) {
    const [viewDate, setViewDate] = useState(value ? new Date(value + 'T00:00:00') : new Date());

    if (!isOpen) return null;

    const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const days = daysInMonth(year, month);
    const offset = firstDayOfMonth(year, month);

    const monthNames = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    const handlePrevMonth = (e) => {
        e.stopPropagation();
        setViewDate(new Date(year, month - 1, 1));
    };

    const handleNextMonth = (e) => {
        e.stopPropagation();
        setViewDate(new Date(year, month + 1, 1));
    };

    const handleSelectDay = (day) => {
        const selectedDate = new Date(year, month, day);
        const dateStr = selectedDate.toISOString().split('T')[0];
        onChange(dateStr);
        onClose();
    };

    const isToday = (day) => {
        const today = new Date();
        return today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;
    };

    const isSelected = (day) => {
        if (!value) return false;
        const current = new Date(value + 'T00:00:00');
        return current.getDate() === day && current.getMonth() === month && current.getFullYear() === year;
    };

    const dayElements = [];
    for (let paddingPos = 0; paddingPos < offset; paddingPos++) {
        dayElements.push(<div key={`gap-cell-${year}-${month}-${paddingPos}`} className="h-10 w-10" />);
    }
    for (let d = 1; d <= days; d++) {
        dayElements.push(
            <button
                key={`day-${year}-${month}-${d}`}
                onClick={() => handleSelectDay(d)}
                className={`h-10 w-10 flex items-center justify-center rounded-xl text-[10px] font-black transition-all
          ${isSelected(d)
                        ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg shadow-pink-500/20 scale-110'
                        : isToday(d)
                            ? 'border-2 border-pink-500 text-pink-500'
                            : 'text-[var(--text-primary)] hover:bg-[var(--hover-color)]'
                    }`}
            >
                {d}
            </button>
        );
    }

    return createPortal(
        <div className="fixed inset-0 z-[1000] grid place-items-center h-screen w-screen p-4 pointer-events-none">
            <div
                className="fixed inset-0 bg-transparent pointer-events-auto"
                onClick={onClose}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClose()}
                role="button"
                tabIndex={-1}
                aria-label="Cerrar"
            />

            <div
                className="w-full max-w-[340px] relative rounded-[2.5rem] border-2 border-[var(--border-color)] animate-insta overflow-hidden pointer-events-auto shadow-2xl"
                style={{ backgroundColor: 'var(--bg-color)' }}
            >
                {/* Header */}
                <div className="px-8 py-6 border-b border-[var(--border-color)] flex justify-between items-center bg-[var(--hover-color)]/30">
                    <div className="flex items-center gap-3">
                        <CalendarIcon className="w-[18px] h-[18px] text-pink-500" />
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-primary)]">
                            {label}
                        </h3>
                    </div>
                    <button onClick={onClose} className="text-[var(--text-secondary)] hover:text-pink-500 transition-colors">
                        <XMarkIcon className="w-5 h-5" />
                    </button>
                </div>

                {/* Calendar Body */}
                <div className="p-6">
                    {/* Month Navigation */}
                    <div className="flex items-center justify-between mb-6 px-2">
                        <button
                            onClick={handlePrevMonth}
                            className="p-2 hover:bg-[var(--hover-color)] rounded-full text-[var(--text-secondary)] transition-colors"
                        >
                            <ChevronLeftIcon className="w-5 h-5" />
                        </button>
                        <div className="text-center">
                            <span className="text-xs font-black uppercase tracking-widest text-[var(--text-primary)]">
                                {monthNames[month]}
                            </span>
                            <span className="block text-[10px] font-bold text-[var(--text-secondary)] mt-0.5">
                                {year}
                            </span>
                        </div>
                        <button
                            onClick={handleNextMonth}
                            className="p-2 hover:bg-[var(--hover-color)] rounded-full text-[var(--text-secondary)] transition-colors"
                        >
                            <ChevronRightIcon className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Weekdays */}
                    <div className="grid grid-cols-7 gap-1 mb-2">
                        {['DO', 'LU', 'MA', 'MI', 'JU', 'VI', 'SA'].map(day => (
                            <div key={day} className="h-8 flex items-center justify-center text-[9px] font-black text-[var(--text-secondary)] opacity-50">
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Days Grid */}
                    <div className="grid grid-cols-7 gap-1">
                        {dayElements}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-[var(--border-color)] flex justify-center">
                    <button
                        onClick={onClose}
                        className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}
