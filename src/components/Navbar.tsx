import React from 'react';
import { ShiftType } from '../types';
import { Sun, Moon, Clock, Download, PauseCircle, ShieldCheck } from 'lucide-react';
import { formatSpanishDate } from '../utils/storage';

interface NavbarProps {
  currentDate: string;
  activeShift: ShiftType;
  onShiftChange: (shift: ShiftType) => void;
  activeView: 'pos' | 'history';
  onViewChange: (view: 'pos' | 'history') => void;
  onOpenArqueo: () => void;
  parkedCount: number;
  onOpenParked: () => void;
  onOpenExportModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentDate,
  activeShift,
  onShiftChange,
  activeView,
  onViewChange,
  onOpenArqueo,
  parkedCount,
  onOpenParked,
  onOpenExportModal,
}) => {
  return (
    <header className="border-b border-white/10 bg-[#080d18]/95 sticky top-0 z-40 backdrop-blur-md px-4 sm:px-6 py-2.5">
      <div className="max-w-[1750px] mx-auto flex items-center justify-between gap-4">
        
        {/* ZONE 1: BRAND TITLE & CREDENTIALS */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 via-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 text-slate-950 font-display font-extrabold text-xl tracking-tighter">
            IO
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-black text-xl tracking-wider text-white">IO.GENIX</span>
              <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/25 font-bold">
                TPV PRO
              </span>
            </div>
            <div className="text-[11px] text-slate-400">
              Distribuidora Oficial de Nutrición Deportiva
            </div>
          </div>
        </div>

        {/* ZONE 2: PRIMARY NAVIGATION VIEWS */}
        <nav className="flex items-center gap-1 p-1 bg-slate-900/90 border border-white/10 rounded-xl">
          <button
            onClick={() => onViewChange('pos')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeView === 'pos'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/25'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            Terminal TPV
          </button>
          <button
            onClick={() => onViewChange('history')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeView === 'history'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/25'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            Histórico Mensual
          </button>
          <button
            onClick={onOpenArqueo}
            className="px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:text-amber-300 hover:bg-amber-500/10 transition-all flex items-center gap-1.5"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>Arqueo y Cierre</span>
          </button>
        </nav>

        {/* ZONE 3: DATE, SHIFT SELECTOR & CONTROLS */}
        <div className="flex items-center gap-3">
          
          {/* Automated Fixed Date Indicator */}
          <div className="hidden xl:flex flex-col text-right pr-3 border-r border-white/10">
            <span className="text-xs font-bold text-slate-200">
              {formatSpanishDate(currentDate)}
            </span>
            <span className="text-[10px] text-slate-400 flex items-center justify-end gap-1">
              <Clock className="w-3 h-3 text-cyan-400" />
              Fecha detectada del sistema
            </span>
          </div>

          {/* Turno Elegante Selector (Mañana / Tarde) */}
          <div className="flex items-center bg-slate-900 border border-white/10 p-1 rounded-xl">
            <button
              onClick={() => onShiftChange('mañana')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeShift === 'mañana'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Turno Mañana (09:00 - 14:30)"
            >
              <Sun className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Mañana</span>
            </button>
            <button
              onClick={() => onShiftChange('tarde')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeShift === 'tarde'
                  ? 'bg-blue-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Turno Tarde (16:30 - 21:00)"
            >
              <Moon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Tarde</span>
            </button>
          </div>

          {/* Parked Tickets Button */}
          <button
            onClick={onOpenParked}
            className="relative p-2 rounded-xl bg-slate-900 border border-white/10 hover:border-amber-400/40 text-amber-400 hover:text-amber-300 transition-colors"
            title="Tickets en espera / aparcados"
          >
            <PauseCircle className="w-5 h-5" />
            {parkedCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-amber-500 text-slate-950 text-[10px] font-black rounded-full flex items-center justify-center shadow-lg">
                {parkedCount}
              </span>
            )}
          </button>

          {/* Download Standalone HTML Single File */}
          <button
            onClick={onOpenExportModal}
            className="px-3 py-2 rounded-xl bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 hover:from-emerald-500/30 hover:to-cyan-500/30 border border-emerald-500/30 text-emerald-300 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
            title="Descargar o Ver Código en 1 solo archivo HTML autónomo"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden md:inline">Exportar HTML Único</span>
          </button>

        </div>

      </div>
    </header>
  );
};
