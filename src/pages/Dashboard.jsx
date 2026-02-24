import React, { useEffect, useState, useRef, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import 'chart.js/auto';

import KPIGrid from '../components/Dashboard/KPIGrid';
import RevenueChart from '../components/Dashboard/RevenueChart';
import PlatformDistribution from '../components/Dashboard/PlatformDistribution';
import ExpirationLists from '../components/Dashboard/ExpirationLists';
import TopServices from '../components/Dashboard/TopServices';

import { useData } from '../context/DataContext';
import { useDashboardData } from '../hooks/useDashboardData';
import { CalendarIcon } from '@heroicons/react/24/outline';

const BRAND_COLORS = {
  'netflix': '#E50914',
  'disney+': '#113CCF',
  'hbo max': '#9D50FF',
  'spotify': '#1DB954',
  'youtube': '#FF0000',
  'prime video': '#00A8E1',
  'star+': '#1F1F1F',
  'apple tv': '#2C2C2C',
  'crunchyroll': '#F47521',
  'paramount+': '#0064FF',
  'max': '#002BE7'
};

const FALLBACK_PALETTE = [
  '#FF0055', '#00E5FF', '#AA00FF', '#FFD600', '#00FF99',
  '#FF6D00', '#2979FF', '#FF1744', '#00C853', '#651FFF'
];

const getPlatformColor = (name, index) => {
  const key = name?.toLowerCase().trim();
  return BRAND_COLORS[key] || FALLBACK_PALETTE[index % FALLBACK_PALETTE.length];
};



/**
 * Dashboard Principal: Estilo Minimalista Vibrante (IG Style).
 * Incorpora bordes redondeados, gradientes Instagram y transiciones suaves.
 */
export default function Dashboard() {
  const { clients, platforms } = useData();
  const navigate = useNavigate();
  const [textColor, setTextColor] = useState('rgba(0,0,0,0.5)');

  const {
    monthlyRevenue, upcoming, expired, platformCounts,
    labels, revMap, topServices, totalClients
  } = useDashboardData(clients, platforms);

  const now = new Date();

  useEffect(() => {
    const updateColors = () => {
      const style = getComputedStyle(document.documentElement);
      setTextColor(style.getPropertyValue('--text-primary').trim() || '#000000');
    };
    updateColors();
    const observer = new MutationObserver(updateColors);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  const chartData = {
    labels,
    datasets: [{
      label: 'Ingresos',
      data: labels.map(l => revMap[l]),
      backgroundColor: (context) => {
        if (!context.chart.chartArea) return;
        const ctx = context.chart.ctx;
        const gradient = ctx.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, '#833ab4');
        gradient.addColorStop(0.5, '#fd1d1d');
        gradient.addColorStop(1, '#f56040');
        return gradient;
      },
      borderRadius: 10,
      barThickness: 'flex',
      maxBarThickness: 35,
    }]
  };

  const pieData = {
    labels: Object.keys(platformCounts),
    datasets: [{
      data: Object.values(platformCounts),
      backgroundColor: Object.keys(platformCounts).map((name, i) => getPlatformColor(name, i)),
      borderWidth: 0,
      hoverOffset: 20
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.8)',
        padding: 12,
        cornerRadius: 12,
        displayColors: false
      }
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: textColor, font: { size: 10, weight: '600' } } },
      y: { grid: { color: 'var(--border-color)', drawBorder: false }, ticks: { color: textColor, font: { size: 10 }, callback: (val) => `$${val}` } }
    }
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: textColor,
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 20,
          font: { size: 10, weight: 'bold', family: 'Inter' }
        }
      }
    }
  };



  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-24 px-4 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-[var(--text-primary)] tracking-tighter uppercase">DASHBOARD</h2>
          <div className="flex items-center gap-2 mt-2">
            <span className="h-1 w-8 bg-gradient-to-r from-[#833ab4] to-[#fd1d1d] rounded-full"></span>
            <p className="text-[var(--text-secondary)] text-[10px] font-bold uppercase tracking-[0.3em]">Dashboard de facturación</p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.2em] bg-[var(--hover-color)] px-5 py-3 rounded-full border border-[var(--border-color)]">
          <CalendarIcon className="w-3.5 h-3.5 text-pink-500" />
          <span>{now.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
        </div>
      </div>

      {/* KPIs */}
      <KPIGrid stats={{ monthlyRevenue: monthlyRevenue.toFixed(2), activeClients: totalClients, activeSubs: expired.length + upcoming.length, toExpire: upcoming.length }} />

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <RevenueChart data={chartData} options={options} />
        <PlatformDistribution data={pieData} options={pieOptions} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
        <TopServices topServices={topServices} platforms={platforms} />

        {/* Recordatorios y Vencimientos */}
        <ExpirationLists
          expired={expired.map(u => ({ ...u, vence: new Date(u.fecha).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }).toUpperCase(), daysDiff: Math.ceil((new Date(u.fecha) - now) / (1000 * 60 * 60 * 24)) }))}
          upcoming={upcoming.map(u => ({ ...u, vence: new Date(u.fecha).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }).toUpperCase(), daysDiff: Math.ceil((new Date(u.fecha) - now) / (1000 * 60 * 60 * 24)) }))}
        />
      </div>
    </div>
  );
}
