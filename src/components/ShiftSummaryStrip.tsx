import React from 'react';
import { ShiftType } from '../types';
import { Plus, Calculator, Wallet, CreditCard, ShoppingBag, Coins } from 'lucide-react';

interface ShiftSummaryStripProps {
  activeShift: ShiftType;
  salesCount: number;
  totalCard: number;
  totalCash: number;
  initialCashFloat: number;
  onOpenNewProduct: () => void;
  onOpenArqueo: () => void;
}

export const ShiftSummaryStrip: React.FC<ShiftSummaryStripProps> = ({
  activeShift,
  salesCount,
  totalCard,
  totalCash,
  initialCashFloat,
  onOpenNewProduct,
  onOpenArqueo,
}) => {
  const currentCashInDrawer = initialCashFloat + totalCash;

  return (
    <section className="border-b border-white/5 bg-[#0b101c]/90 px-4 sm:px-6 py-2">
      <div className="max-w-[1750px] mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
        
        {/* Real-time shift indicators */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-medium">Turno Activo:</span>
            <span className={`font-display font-extrabold uppercase tracking-wider ${
              activeShift === 'mañana' ? 'text-amber-400' : 'text-blue-400'
            }`}>
              {activeShift === 'mañana' ? '☀️ Turno Mañana (09:00 - 14:30)' : '🌙 Turno Tarde (16:30 - 21:00)'}
            </span>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-900/60 px-2.5 py-1 rounded-lg border border-white/5">
            <ShoppingBag className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-400">Ventas Turno:</span>
            <span className="font-mono-tabular font-bold text-white text-sm">{salesCount}</span>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-900/60 px-2.5 py-1 rounded-lg border border-cyan-500/20">
            <CreditCard className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-400">Total TPV (Tarjeta):</span>
            <span className="font-mono-tabular font-bold text-cyan-300 text-sm">
              {totalCard.toFixed(2)} €
            </span>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-900/60 px-2.5 py-1 rounded-lg border border-emerald-500/20">
            <Coins className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-slate-400">Total Efectivo Cobrado:</span>
            <span className="font-mono-tabular font-bold text-emerald-400 text-sm">
              {totalCash.toFixed(2)} €
            </span>
          </div>

          <div className="hidden lg:flex items-center gap-1.5 bg-slate-900/60 px-2.5 py-1 rounded-lg border border-amber-500/20">
            <Wallet className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-slate-400">Fondo ({initialCashFloat.toFixed(0)}€) + Cajón Físico:</span>
            <span className="font-mono-tabular font-bold text-amber-300 text-sm">
              {currentCashInDrawer.toFixed(2)} €
            </span>
          </div>

        </div>

        {/* Action Shortcuts */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenNewProduct}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-white/10 hover:border-cyan-400/40 text-xs font-semibold flex items-center gap-1.5 transition-all touch-active"
          >
            <Plus className="w-3.5 h-3.5 text-cyan-400" />
            <span>Añadir Suplemento</span>
          </button>
          
          <button
            onClick={onOpenArqueo}
            className="px-3.5 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-1.5 transition-all touch-active shadow-sm"
          >
            <Calculator className="w-3.5 h-3.5 text-amber-400" />
            <span>Arqueo de Turno</span>
          </button>
        </div>

      </div>
    </section>
  );
};
