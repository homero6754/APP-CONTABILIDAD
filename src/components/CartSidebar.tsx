import React from 'react';
import { CartItem, TarifaType } from '../types';
import { Trash2, Plus, Minus, ArrowRight, PauseCircle, ShoppingBag } from 'lucide-react';
import { playChimeSound } from '../utils/cashCalculator';

interface CartSidebarProps {
  cart: CartItem[];
  currentTarifa: TarifaType;
  discountPercent: number;
  onUpdateQty: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onParkTicket: () => void;
  onOpenCheckout: () => void;
}

export const CartSidebar: React.FC<CartSidebarProps> = ({
  cart,
  currentTarifa,
  discountPercent,
  onUpdateQty,
  onRemoveItem,
  onClearCart,
  onParkTicket,
  onOpenCheckout,
}) => {
  // Helper to compute unit price based on active tariff
  const getItemPrice = (item: CartItem) => {
    if (currentTarifa === 'profesional') {
      return item.product.precioProConIva;
    } else if (currentTarifa === 'descuento') {
      return Number((item.product.pvp * (1 - discountPercent / 100)).toFixed(2));
    }
    return item.product.pvp;
  };

  const totalGross = cart.reduce((sum, item) => sum + getItemPrice(item) * item.quantity, 0);
  const originalPvpTotal = cart.reduce((sum, item) => sum + item.product.pvp * item.quantity, 0);
  const subtotalSinIva = Number((totalGross / 1.21).toFixed(2));
  const ivaTotal = Number((totalGross - subtotalSinIva).toFixed(2));
  const discountTotal = Number((originalPvpTotal - totalGross).toFixed(2));
  const totalItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckoutClick = () => {
    if (cart.length === 0) return;
    playChimeSound('click');
    onOpenCheckout();
  };

  return (
    <aside className="glass-panel rounded-3xl flex flex-col h-[calc(100vh-160px)] sticky top-20 shadow-2xl border border-white/10 overflow-hidden">
      
      {/* Header */}
      <div className="p-4 border-b border-white/10 bg-slate-900/60 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400"></div>
          <h2 className="font-display font-bold text-base text-white">Ticket de Venta</h2>
          <span className="text-xs text-slate-400 font-mono-tabular">({totalItemCount} uds)</span>
        </div>
        
        {cart.length > 0 && (
          <button
            onClick={onParkTicket}
            className="px-2.5 py-1 text-xs text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 rounded-xl border border-amber-400/30 transition-colors flex items-center gap-1.5 touch-active"
            title="Aparcar ticket para atender a otro cliente"
          >
            <PauseCircle className="w-3.5 h-3.5" />
            <span>Aparcar</span>
          </button>
        )}
      </div>

      {/* Cart Items List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {cart.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500">
            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center mb-3 text-slate-500">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <p className="font-display font-semibold text-slate-300 text-sm">
              Ticket vacío
            </p>
            <p className="text-xs text-slate-500 mt-1 max-w-[200px]">
              Toca cualquier suplemento del catálogo para añadirlo.
            </p>
          </div>
        ) : (
          cart.map((item) => {
            const unitPrice = getItemPrice(item);
            const lineTotal = unitPrice * item.quantity;

            return (
              <div
                key={item.product.id}
                className="bg-slate-900/80 p-3 rounded-2xl border border-white/5 flex items-center justify-between gap-3 shadow-md"
              >
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-xs text-white truncate">
                    {item.product.name}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1.5">
                    <span>{item.product.format}</span>
                    <span>·</span>
                    <span className="text-slate-400 truncate">{item.product.flavor}</span>
                    <span>·</span>
                    <span className="text-cyan-300 font-mono-tabular font-medium">
                      {unitPrice.toFixed(2)}€/u
                    </span>
                  </div>
                </div>

                {/* Tactile Quantity Steppers */}
                <div className="flex items-center gap-1.5 bg-slate-950/70 p-1 rounded-xl border border-white/5">
                  <button
                    onClick={() => {
                      playChimeSound('click');
                      onUpdateQty(item.product.id, -1);
                    }}
                    className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center font-bold text-sm touch-active"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-6 text-center font-mono-tabular font-bold text-xs text-white">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => {
                      playChimeSound('click');
                      onUpdateQty(item.product.id, 1);
                    }}
                    className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center font-bold text-sm touch-active"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Line total & remove button */}
                <div className="text-right flex flex-col items-end">
                  <div className="font-mono-tabular font-bold text-xs text-white">
                    {lineTotal.toFixed(2)} €
                  </div>
                  <button
                    onClick={() => onRemoveItem(item.product.id)}
                    className="text-slate-500 hover:text-rose-400 p-1 transition-colors mt-0.5"
                    title="Eliminar línea"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Cart Totals & Checkout Trigger */}
      <div className="p-4 bg-slate-900/95 border-t border-white/10 space-y-2">
        
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Base Imponible (Sin IVA):</span>
          <span className="font-mono-tabular font-medium text-slate-200">
            {subtotalSinIva.toFixed(2)} €
          </span>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>IVA General (21%):</span>
          <span className="font-mono-tabular font-medium text-slate-200">
            {ivaTotal.toFixed(2)} €
          </span>
        </div>

        {discountTotal > 0.05 && (
          <div className="flex items-center justify-between text-xs text-amber-400 font-semibold">
            <span>Ahorro / Descuento aplicado:</span>
            <span className="font-mono-tabular font-bold">
              -{discountTotal.toFixed(2)} €
            </span>
          </div>
        )}

        <div className="pt-2 border-t border-white/10 flex items-baseline justify-between">
          <div>
            <div className="font-display font-bold text-xs uppercase tracking-wider text-slate-400">
              Total a Cobrar
            </div>
            <div className="text-[10px] text-cyan-400 font-medium">
              IVA 21% Incluido
            </div>
          </div>
          <div className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight tabular-nums">
            {totalGross.toFixed(2)} €
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-3 gap-2 pt-2">
          <button
            onClick={onClearCart}
            disabled={cart.length === 0}
            className="py-3 px-2 rounded-xl bg-slate-800 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 border border-white/10 hover:border-rose-500/40 text-xs font-bold transition-all disabled:opacity-40 disabled:pointer-events-none touch-active"
          >
            Vaciar
          </button>
          
          <button
            onClick={handleCheckoutClick}
            disabled={cart.length === 0}
            className="col-span-2 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-400 via-cyan-500 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-display font-black text-base shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-40 disabled:pointer-events-none touch-active"
          >
            <span>COBRAR</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

      </div>

    </aside>
  );
};
