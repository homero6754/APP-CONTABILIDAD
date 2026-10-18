import React from 'react';
import { SaleRecord } from '../types';
import { Printer, CheckCircle2, X } from 'lucide-react';

interface ReceiptModalProps {
  sale: SaleRecord | null;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ sale, onClose }) => {
  if (!sale) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="glass-panel w-full max-w-md rounded-3xl border border-white/15 shadow-2xl p-6 flex flex-col items-center space-y-4 my-auto">
        
        {/* Success Banner */}
        <div className="flex items-center gap-2 text-emerald-400 font-display font-bold text-sm">
          <CheckCircle2 className="w-5 h-5" />
          <span>¡Venta Completada con Éxito!</span>
        </div>

        {/* 80mm POS Thermal Receipt Printable Container */}
        <div
          id="printable-receipt"
          className="w-full bg-white text-slate-900 p-5 rounded-2xl font-mono text-xs leading-relaxed shadow-xl border border-slate-200"
        >
          {/* Brand & Store Data */}
          <div className="text-center pb-3 border-b border-dashed border-slate-400">
            <div className="font-extrabold text-base tracking-widest text-black">
              IO.GENIX NUTRITION
            </div>
            <div className="font-semibold text-[11px] text-slate-800">
              DISTRIBUIDORA OFICIAL TPV
            </div>
            <div className="text-[10px] text-slate-600 mt-0.5">
              CIF: B-87654321 · C/ Deporte 42
            </div>
            <div className="text-[10px] text-slate-600">
              Tel: 912 345 678 · info@iogenix.es
            </div>
          </div>

          {/* Ticket Metadata */}
          <div className="py-2.5 border-b border-dashed border-slate-400 space-y-1 text-[11px]">
            <div className="flex justify-between">
              <span className="text-slate-600">Nº Ticket:</span>
              <strong className="text-black">{sale.ticketNumber}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Fecha / Hora:</span>
              <span>{sale.date} {sale.timeStr}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Turno de Caja:</span>
              <span className="capitalize">{sale.shift === 'mañana' ? 'Turno Mañana' : 'Turno Tarde'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Tarifa Aplicada:</span>
              <span className="font-bold uppercase text-slate-800">{sale.tarifa}</span>
            </div>
          </div>

          {/* Items itemized */}
          <div className="py-2.5 border-b border-dashed border-slate-400 space-y-1.5">
            <div className="flex justify-between text-[10px] text-slate-500 font-bold uppercase">
              <span>Cant. / Concepto</span>
              <span>Total</span>
            </div>
            {sale.items.map((item, idx) => (
              <div key={idx} className="flex justify-between text-[11px] items-baseline">
                <div className="pr-2">
                  <div className="font-semibold text-black">
                    {item.quantity}x {item.product.name}
                  </div>
                  <div className="text-[10px] text-slate-600">
                    {item.product.format} · {item.product.flavor}
                  </div>
                </div>
                <div className="font-bold tabular-nums text-black shrink-0">
                  {((sale.tarifa === 'profesional' ? item.product.precioProConIva : item.product.pvp) * item.quantity).toFixed(2)} €
                </div>
              </div>
            ))}
          </div>

          {/* Tax breakdown */}
          <div className="py-2.5 border-b border-dashed border-slate-400 space-y-1 text-[11px]">
            <div className="flex justify-between text-slate-700">
              <span>Base Imponible:</span>
              <span className="tabular-nums">{sale.subtotalSinIva.toFixed(2)} €</span>
            </div>
            <div className="flex justify-between text-slate-700">
              <span>IVA General (21%):</span>
              <span className="tabular-nums">{sale.iva.toFixed(2)} €</span>
            </div>
            <div className="flex justify-between text-base font-black pt-1.5 border-t border-slate-300 text-black">
              <span>TOTAL:</span>
              <span className="tabular-nums">{sale.total.toFixed(2)} €</span>
            </div>
          </div>

          {/* Payment & Cash Return Details */}
          <div className="py-2.5 border-b border-dashed border-slate-400 space-y-1 text-[11px]">
            <div className="flex justify-between">
              <span className="text-slate-600">Método de Pago:</span>
              <strong className="uppercase text-black">
                {sale.paymentMethod === 'efectivo' ? '💵 EFECTIVO' : '💳 TARJETA / TPV'}
              </strong>
            </div>

            {sale.paymentMethod === 'efectivo' && (
              <>
                <div className="flex justify-between text-slate-700">
                  <span>Importe Entregado:</span>
                  <span className="tabular-nums">{(sale.cashGiven || sale.total).toFixed(2)} €</span>
                </div>
                <div className="flex justify-between font-bold text-black">
                  <span>Cambio Devuelto:</span>
                  <span className="tabular-nums text-emerald-700 font-extrabold">
                    {(sale.cashChange || 0).toFixed(2)} €
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Footer note */}
          <div className="pt-3 text-center text-[10px] text-slate-600 leading-tight">
            ¡GRACIAS POR TU CONFIANZA EN IO.GENIX!<br />
            Para cambios o garantías conserve este resguardo.<br />
            www.iogenix.es
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full grid grid-cols-2 gap-2.5 pt-2">
          <button
            onClick={handlePrint}
            className="py-3 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-2 touch-active transition-colors"
          >
            <Printer className="w-4 h-4 text-cyan-400" />
            <span>Imprimir Ticket</span>
          </button>
          
          <button
            onClick={onClose}
            className="py-3 px-4 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-display font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 touch-active transition-all"
          >
            <span>Nueva Venta</span>
            <X className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
