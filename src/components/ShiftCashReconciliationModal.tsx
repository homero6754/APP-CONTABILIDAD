import React, { useState } from 'react';
import { ShiftType } from '../types';
import { X, Check, Calculator, Copy } from 'lucide-react';
import { playChimeSound } from '../utils/cashCalculator';

interface ShiftCashReconciliationModalProps {
  isOpen: boolean;
  activeShift: ShiftType;
  initialCashFloat: number;
  cashSalesAmount: number;
  cardSalesAmount: number;
  salesCount: number;
  onClose: () => void;
  onConfirmCloseShift: (countedCash: number, difference: number, notes: string) => void;
}

export const ShiftCashReconciliationModal: React.FC<ShiftCashReconciliationModalProps> = ({
  isOpen,
  activeShift,
  initialCashFloat,
  cashSalesAmount,
  cardSalesAmount,
  salesCount,
  onClose,
  onConfirmCloseShift,
}) => {
  const [countedInput, setCountedInput] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  if (!isOpen) return null;

  const theoreticalTotal = initialCashFloat + cashSalesAmount;
  const countedValue = parseFloat(countedInput) || 0;
  const difference = Number((countedValue - theoreticalTotal).toFixed(2));

  const handleCopyTheoretical = () => {
    playChimeSound('click');
    setCountedInput(theoreticalTotal.toFixed(2));
  };

  const handleConfirm = () => {
    playChimeSound('success');
    onConfirmCloseShift(countedValue, difference, notes);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="glass-panel w-full max-w-2xl rounded-3xl border border-white/15 shadow-2xl p-6 sm:p-8 space-y-6 my-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-400/30 flex items-center justify-center text-amber-300">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-black text-xl text-white">
                Arqueo de Caja y Cierre de Turno
              </h3>
              <p className="text-xs text-slate-400 capitalize">
                Auditoría física de caja · {activeShift === 'mañana' ? 'Turno Mañana' : 'Turno Tarde'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center touch-active"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Theoretical Breakdown Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          
          <div className="p-3.5 rounded-2xl bg-slate-900 border border-white/10 text-center">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
              Fondo Inicial
            </span>
            <span className="font-display font-black text-lg text-slate-200 mt-1 block tabular-nums">
              {initialCashFloat.toFixed(2)} €
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900 border border-white/10 text-center">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
              Ventas Turno
            </span>
            <span className="font-display font-black text-lg text-white mt-1 block tabular-nums">
              {salesCount} tickets
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900 border border-emerald-500/30 text-center">
            <span className="text-[10px] text-emerald-400 uppercase font-bold tracking-wider block">
              Cobros Efectivo
            </span>
            <span className="font-display font-black text-lg text-emerald-300 mt-1 block tabular-nums">
              {cashSalesAmount.toFixed(2)} €
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900 border border-cyan-500/30 text-center">
            <span className="text-[10px] text-cyan-400 uppercase font-bold tracking-wider block">
              Cobros Tarjeta (TPV)
            </span>
            <span className="font-display font-black text-lg text-cyan-300 mt-1 block tabular-nums">
              {cardSalesAmount.toFixed(2)} €
            </span>
          </div>

        </div>

        {/* Big Theoretical Total */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-amber-500/40 flex items-center justify-between">
          <div>
            <span className="text-xs uppercase font-extrabold text-amber-400 tracking-wider block">
              Efectivo Teórico Esperado en Cajón:
            </span>
            <span className="text-[11px] text-slate-400">
              Fondo inicial ({initialCashFloat.toFixed(2)}€) + Cobros en efectivo ({cashSalesAmount.toFixed(2)}€)
            </span>
          </div>
          <div className="font-display font-black text-3xl text-amber-300 tabular-nums">
            {theoreticalTotal.toFixed(2)} €
          </div>
        </div>

        {/* Physical Cash Counting Input */}
        <div className="bg-slate-900/60 p-4 sm:p-5 rounded-2xl border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs uppercase font-extrabold text-slate-200 tracking-wider">
              Total Físico Contado en Cajón:
            </label>
            <button
              onClick={handleCopyTheoretical}
              className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold touch-active"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copiar Teórico Exacto</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <input
                type="number"
                step="0.01"
                min="0"
                value={countedInput}
                onChange={(e) => setCountedInput(e.target.value)}
                placeholder="0.00"
                className="w-full px-4 py-3 bg-slate-950 border border-white/15 rounded-2xl text-white font-display font-black text-2xl focus:outline-none focus:border-cyan-400 tabular-nums pl-10"
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-500 text-lg">
                €
              </span>
            </div>
          </div>

          {/* Difference & Status Box */}
          <div
            className={`p-3.5 rounded-2xl border flex items-center justify-between text-xs font-bold transition-colors ${
              Math.abs(difference) <= 0.01
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                : difference > 0
                ? 'bg-cyan-950/40 border-cyan-500/40 text-cyan-300'
                : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
            }`}
          >
            <span>Diferencia de Arqueo (Descuadre):</span>
            <span className="font-display font-black text-base tabular-nums">
              {Math.abs(difference) <= 0.01
                ? '0.00 € (Cuadrado Perfecto)'
                : difference > 0
                ? `+${difference.toFixed(2)} € (Sobrante)`
                : `${difference.toFixed(2)} € (Faltante)`}
            </span>
          </div>

          {/* Optional notes */}
          <div>
            <label className="text-[11px] font-semibold text-slate-400 block mb-1">
              Observaciones de Cierre (Opcional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ej: Turno finalizado sin incidencias, cambio repuesto."
              className="w-full px-3 py-2 bg-slate-950 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold touch-active transition-colors"
          >
            Volver sin Cerrar
          </button>
          
          <button
            onClick={handleConfirm}
            className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-display font-black text-sm shadow-lg shadow-amber-500/25 flex items-center gap-2 touch-active transition-all"
          >
            <Check className="w-4 h-4" />
            <span>Cerrar Turno & Guardar Informe Z</span>
          </button>
        </div>

      </div>
    </div>
  );
};
