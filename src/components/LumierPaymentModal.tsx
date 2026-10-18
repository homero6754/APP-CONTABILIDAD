import React, { useState, useEffect } from 'react';
import { PaymentMethod, CashDenominationBreakdown } from '../types';
import { calculateChangeBreakdown, playChimeSound } from '../utils/cashCalculator';
import { X, Check, Banknote, CreditCard, Sparkles, Delete } from 'lucide-react';

interface LumierPaymentModalProps {
  isOpen: boolean;
  totalToPay: number;
  initialCashFloat: number;
  currentShiftCashSales: number;
  onClose: () => void;
  onCompleteSale: (details: {
    paymentMethod: PaymentMethod;
    cashGiven?: number;
    cashChange?: number;
    cashBreakdown?: CashDenominationBreakdown;
  }) => void;
}

export const LumierPaymentModal: React.FC<LumierPaymentModalProps> = ({
  isOpen,
  totalToPay,
  initialCashFloat,
  currentShiftCashSales,
  onClose,
  onCompleteSale,
}) => {
  const [method, setMethod] = useState<PaymentMethod>('efectivo');
  const [cashGiven, setCashGiven] = useState<number>(0);

  // Reset or preset whenever opened
  useEffect(() => {
    if (isOpen) {
      setMethod('efectivo');
      setCashGiven(0);
    }
  }, [isOpen, totalToPay]);

  if (!isOpen) return null;

  const change = Number((cashGiven - totalToPay).toFixed(2));
  const hasCoveredTotal = cashGiven >= totalToPay - 0.001;
  const changeBreakdown = hasCoveredTotal && change > 0 ? calculateChangeBreakdown(change) : [];

  // Real-time cash drawer calculation
  const physicalDrawerBalance = initialCashFloat + currentShiftCashSales + (method === 'efectivo' && hasCoveredTotal ? totalToPay : 0);

  const handleAddBill = (val: number) => {
    playChimeSound('click');
    setCashGiven((prev) => Number((prev + val).toFixed(2)));
  };

  const handleAddCoin = (val: number) => {
    playChimeSound('click');
    setCashGiven((prev) => Number((prev + val).toFixed(2)));
  };

  const handleExact = () => {
    playChimeSound('click');
    setCashGiven(Number(totalToPay.toFixed(2)));
  };

  const handleClear = () => {
    playChimeSound('click');
    setCashGiven(0);
  };

  const handleNumpadInput = (char: string) => {
    playChimeSound('click');
    const str = cashGiven === 0 ? '' : cashGiven.toString();
    if (char === '.') {
      if (str.includes('.')) return;
      setCashGiven(Number((str + '.0') || 0));
    } else {
      const nextStr = str + char;
      const parsed = parseFloat(nextStr);
      if (!isNaN(parsed) && parsed < 10000) {
        setCashGiven(parsed);
      }
    }
  };

  const handleConfirm = () => {
    if (method === 'efectivo' && !hasCoveredTotal) return;

    playChimeSound('openDrawer');

    // Create breakdown record
    const breakdownRecord: CashDenominationBreakdown = {};
    changeBreakdown.forEach((item) => {
      breakdownRecord[item.denomination.label] = item.count;
    });

    onCompleteSale({
      paymentMethod: method,
      cashGiven: method === 'efectivo' ? cashGiven : undefined,
      cashChange: method === 'efectivo' ? Math.max(0, change) : undefined,
      cashBreakdown: method === 'efectivo' ? breakdownRecord : undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="glass-panel w-full max-w-4xl rounded-3xl border border-white/15 shadow-2xl overflow-hidden flex flex-col my-auto">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 bg-slate-900/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/15 border border-cyan-400/30 flex items-center justify-center text-cyan-300">
              <Banknote className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-black text-xl text-white tracking-wide">
                Cobro y Desglose de Caja Estilo Lumier
              </h3>
              <p className="text-xs text-slate-400">
                Interfaz táctil optimizada con cálculo automático de billetes y monedas a devolver
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center touch-active transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Payment Method Switcher */}
        <div className="p-3 sm:p-4 bg-slate-900/50 border-b border-white/5 flex gap-2">
          <button
            onClick={() => setMethod('efectivo')}
            className={`flex-1 py-3 px-4 rounded-2xl font-display font-bold text-sm sm:text-base transition-all flex items-center justify-center gap-2.5 touch-active ${
              method === 'efectivo'
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/25'
                : 'bg-slate-800/80 text-slate-400 hover:text-white'
            }`}
          >
            <Banknote className="w-5 h-5" />
            <span>Cobro en Efectivo (Táctil)</span>
          </button>
          
          <button
            onClick={() => setMethod('tarjeta')}
            className={`flex-1 py-3 px-4 rounded-2xl font-display font-bold text-sm sm:text-base transition-all flex items-center justify-center gap-2.5 touch-active ${
              method === 'tarjeta'
                ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/25'
                : 'bg-slate-800/80 text-slate-400 hover:text-white'
            }`}
          >
            <CreditCard className="w-5 h-5" />
            <span>Tarjeta / Datáfono TPV</span>
          </button>
        </div>

        {/* Content Area */}
        {method === 'efectivo' ? (
          <div className="p-4 sm:p-6 space-y-5 overflow-y-auto max-h-[75vh]">
            
            {/* Top Scoreboard: Total, Entregado & Cambio */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              
              <div className="bg-slate-900/90 p-4 rounded-2xl border border-white/10 text-center">
                <span className="text-[11px] uppercase font-bold text-slate-400 tracking-wider block">
                  Total a Cobrar
                </span>
                <span className="font-display font-black text-2xl sm:text-3xl text-white mt-1 block tabular-nums">
                  {totalToPay.toFixed(2)} €
                </span>
                <span className="text-[10px] text-cyan-400 font-medium">IVA 21% incluido</span>
              </div>

              <div className="bg-slate-900/90 p-4 rounded-2xl border border-cyan-500/40 text-center">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] uppercase font-bold text-cyan-400 tracking-wider">
                    Entregado por Cliente
                  </span>
                  <button
                    onClick={handleClear}
                    className="text-[10px] text-slate-400 hover:text-rose-400 flex items-center gap-1 font-semibold"
                  >
                    <Delete className="w-3 h-3" />
                    Borrar
                  </button>
                </div>
                <div className="font-display font-black text-2xl sm:text-3xl text-cyan-300 mt-1 tabular-nums">
                  {cashGiven.toFixed(2)} €
                </div>
                <button
                  onClick={handleExact}
                  className="mt-1 text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold hover:bg-cyan-500/30 transition-colors"
                >
                  ⚡ Importe Exacto
                </button>
              </div>

              <div
                className={`p-4 rounded-2xl border text-center transition-colors ${
                  hasCoveredTotal
                    ? 'bg-emerald-950/40 border-emerald-500/60 shadow-lg shadow-emerald-500/10'
                    : 'bg-amber-950/30 border-amber-500/40'
                }`}
              >
                <span
                  className={`text-[11px] uppercase font-black tracking-wider block ${
                    hasCoveredTotal ? 'text-emerald-400' : 'text-amber-400'
                  }`}
                >
                  CAMBIO A DEVOLVER
                </span>
                
                {hasCoveredTotal ? (
                  <span className="font-display font-black text-2xl sm:text-4xl text-emerald-300 mt-1 block tabular-nums">
                    {change.toFixed(2)} €
                  </span>
                ) : (
                  <div className="mt-1">
                    <span className="font-display font-bold text-xl sm:text-2xl text-amber-400 block tabular-nums">
                      Faltan {(totalToPay - cashGiven).toFixed(2)} €
                    </span>
                  </div>
                )}

                <span className="text-[10px] text-slate-400">
                  {hasCoveredTotal
                    ? change === 0
                      ? 'Pago exacto'
                      : 'Listo para entregar'
                    : 'Importe insuficiente'}
                </span>
              </div>

            </div>

            {/* LUMIER TACTILE BILLS ROW */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs uppercase font-extrabold text-slate-200 tracking-wider flex items-center gap-1.5">
                  <Banknote className="w-4 h-4 text-emerald-400" />
                  <span>Billetes de Euro (Toque táctil directo):</span>
                </span>
                <span className="text-[11px] text-slate-400">Suma automática</span>
              </div>
              
              <div className="grid grid-cols-5 gap-2.5">
                {[
                  { val: 100, label: '100 €', name: 'Verde', bg: 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300 hover:bg-emerald-900/90' },
                  { val: 50, label: '50 €', name: 'Naranja', bg: 'bg-amber-950/80 border-amber-500/50 text-amber-300 hover:bg-amber-900/90' },
                  { val: 20, label: '20 €', name: 'Azul', bg: 'bg-blue-950/80 border-blue-500/50 text-blue-300 hover:bg-blue-900/90' },
                  { val: 10, label: '10 €', name: 'Rojo', bg: 'bg-rose-950/80 border-rose-500/50 text-rose-300 hover:bg-rose-900/90' },
                  { val: 5, label: '5 €', name: 'Gris', bg: 'bg-slate-800 border-slate-500/50 text-slate-200 hover:bg-slate-700' },
                ].map((b) => (
                  <button
                    key={b.val}
                    type="button"
                    onClick={() => handleAddBill(b.val)}
                    className={`py-3.5 px-2 rounded-2xl border-2 font-display font-black text-lg sm:text-xl flex flex-col items-center justify-center shadow-lg transition-transform touch-active ${b.bg}`}
                  >
                    <span>{b.label}</span>
                    <span className="text-[9px] uppercase tracking-widest text-slate-400 font-sans font-semibold">
                      Billete
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* LUMIER TACTILE COINS ROW */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs uppercase font-extrabold text-slate-200 tracking-wider">
                  Monedas de Euro:
                </span>
              </div>

              <div className="grid grid-cols-5 gap-2.5">
                {[
                  { val: 2.00, label: '2.00 €', bg: 'bg-yellow-950/70 border-yellow-400/60 text-yellow-200' },
                  { val: 1.00, label: '1.00 €', bg: 'bg-slate-800 border-amber-400/50 text-slate-100' },
                  { val: 0.50, label: '0.50 €', bg: 'bg-amber-950/70 border-amber-500/50 text-amber-200' },
                  { val: 0.20, label: '0.20 €', bg: 'bg-amber-950/50 border-amber-600/40 text-amber-300' },
                  { val: 0.10, label: '0.10 €', bg: 'bg-amber-950/50 border-amber-700/40 text-amber-300' },
                ].map((c) => (
                  <button
                    key={c.val}
                    type="button"
                    onClick={() => handleAddCoin(c.val)}
                    className={`py-2.5 rounded-full border-2 font-display font-black text-sm sm:text-base flex items-center justify-center shadow transition-transform touch-active hover:brightness-110 ${c.bg}`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* VISUAL EXACT CHANGE BREAKDOWN (ESTILO LUMIER) */}
            <div className="bg-slate-900/90 p-4 rounded-2xl border border-emerald-500/30">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-xs uppercase font-extrabold text-emerald-400 tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Desglose Físico Exacto a Entregar al Cliente:</span>
                </span>
                <span className="text-[11px] text-slate-400">
                  {hasCoveredTotal ? (change > 0 ? `${changeBreakdown.length} denominaciones` : 'Sin cambio') : 'Pendiente'}
                </span>
              </div>

              <div className="flex flex-wrap gap-2.5 min-h-[50px] items-center">
                {hasCoveredTotal ? (
                  change > 0 ? (
                    changeBreakdown.map((item) => (
                      <div
                        key={item.denomination.id}
                        className={`px-3.5 py-2 rounded-2xl border ${item.denomination.colorBg} ${item.denomination.colorBorder} ${item.denomination.colorText} flex items-center gap-2.5 shadow-md`}
                      >
                        <span className="font-display font-black text-base text-white">
                          {item.count} ×
                        </span>
                        <div className="flex flex-col">
                          <span className="font-display font-extrabold text-xs">
                            {item.denomination.label}
                          </span>
                          <span className="text-[9px] uppercase tracking-wider text-slate-400">
                            {item.denomination.type === 'bill' ? 'Billete' : 'Moneda'}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-emerald-400 text-xs font-bold flex items-center gap-2">
                      <Check className="w-4 h-4" />
                      <span>Pago exacto. No es necesario entregar cambio al cliente.</span>
                    </div>
                  )
                ) : (
                  <div className="text-slate-500 text-xs italic">
                    Toque los billetes o monedas arriba hasta cubrir el total a pagar ({totalToPay.toFixed(2)} €).
                  </div>
                )}
              </div>
            </div>

            {/* REAL-TIME CASH DRAWER STATUS */}
            <div className="flex items-center justify-between text-xs text-slate-400 px-3 py-2 bg-slate-900/60 rounded-2xl border border-white/5">
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></span>
                <span>Dinero físico acumulado en el cajón portamonedas:</span>
              </span>
              <span className="font-mono-tabular font-extrabold text-amber-300 text-sm">
                {physicalDrawerBalance.toFixed(2)} €
              </span>
            </div>

          </div>
        ) : (
          /* CARD / TPV GATEWAY VIEW */
          <div className="p-8 sm:p-12 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-24 h-24 rounded-3xl bg-cyan-500/15 border-2 border-cyan-400/40 flex items-center justify-center text-cyan-300 shadow-xl shadow-cyan-500/10">
              <CreditCard className="w-12 h-12" />
            </div>
            <div>
              <h4 className="font-display font-black text-2xl text-white">
                Datáfono / Pasarela TPV Contactless
              </h4>
              <p className="text-xs text-slate-400 mt-1.5 max-w-sm mx-auto">
                Acerque la tarjeta física o teléfono del cliente al datáfono del mostrador para autorizar la transacción.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900 border border-white/10 text-center w-full max-w-xs shadow-inner">
              <span className="text-xs text-slate-400 block font-semibold">Total a Debitar:</span>
              <span className="font-display font-black text-4xl text-cyan-400 tabular-nums">
                {totalToPay.toFixed(2)} €
              </span>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 bg-slate-900/90 border-t border-white/10 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold touch-active transition-colors"
          >
            Cancelar
          </button>

          <button
            onClick={handleConfirm}
            disabled={method === 'efectivo' && !hasCoveredTotal}
            className={`flex-1 py-3.5 px-6 rounded-2xl font-display font-black text-base shadow-xl flex items-center justify-center gap-2 transition-all touch-active ${
              method === 'efectivo'
                ? hasCoveredTotal
                  ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/30'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-cyan-500/30'
            }`}
          >
            <span>{method === 'efectivo' ? 'CONFIRMAR Y ABRIR CAJÓN' : 'AUTORIZAR Y REGISTRAR TPV'}</span>
            <Check className="w-5 h-5" />
          </button>
        </div>

      </div>
    </div>
  );
};
