import React, { useState } from 'react';
import { Product, TarifaType } from '../types';
import { Plus, Dumbbell } from 'lucide-react';
import { playChimeSound } from '../utils/cashCalculator';

interface ProductCardProps {
  product: Product;
  currentTarifa: TarifaType;
  discountPercent: number;
  onAddToCart: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  currentTarifa,
  discountPercent,
  onAddToCart,
}) => {
  const [imgError, setImgError] = useState(false);

  // Calculate price dynamically based on active Tarifa
  let effectivePrice = product.pvp;
  if (currentTarifa === 'profesional') {
    effectivePrice = product.precioProConIva;
  } else if (currentTarifa === 'descuento') {
    effectivePrice = Number((product.pvp * (1 - discountPercent / 100)).toFixed(2));
  }

  const handleCardClick = () => {
    playChimeSound('click');
    onAddToCart(product);
  };

  return (
    <div
      onClick={handleCardClick}
      className="glass-card rounded-2xl p-3 flex flex-col justify-between hover:border-cyan-400/50 hover:bg-[#1a253e]/80 transition-all cursor-pointer touch-active group shadow-xl relative overflow-hidden"
    >
      {/* Stock & Category header */}
      <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
        <span className="font-semibold text-cyan-400/90">{product.format}</span>
        <span className="text-slate-400 truncate max-w-[110px]">{product.flavor}</span>
      </div>

      {/* Product Image Slot with Fallback Container */}
      <div className="relative w-full aspect-square mb-2.5 rounded-xl overflow-hidden bg-slate-900/80 border border-white/5 flex items-center justify-center">
        {!imgError && product.image ? (
          <img
            src={product.image}
            alt={product.name}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-3 text-center bg-gradient-to-br from-slate-900 to-slate-800 text-slate-400">
            <Dumbbell className="w-8 h-8 text-cyan-400/60 mb-1" />
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-300">
              {product.category}
            </span>
          </div>
        )}

        {/* Low Stock Warning if <= 5 */}
        {product.stock <= 5 && (
          <span className="absolute top-2 left-2 bg-rose-500/90 text-white font-bold text-[9px] px-1.5 py-0.5 rounded shadow">
            Quedan {product.stock}
          </span>
        )}
      </div>

      {/* Product Name */}
      <div className="min-h-[38px]">
        <h3 className="font-display font-bold text-xs sm:text-sm text-white group-hover:text-cyan-300 transition-colors line-clamp-2 leading-snug">
          {product.name}
        </h3>
      </div>

      {/* Pricing & Add Button Footer */}
      <div className="pt-2.5 border-t border-white/5 flex items-end justify-between mt-2">
        <div className="flex-1">
          {currentTarifa === 'descuento' && (
            <div className="text-[11px] text-slate-500 line-through">
              {product.pvp.toFixed(2)} €
            </div>
          )}

          <div className="font-display font-black text-lg sm:text-xl text-white tabular-nums tracking-tight">
            {effectivePrice.toFixed(2)} €
          </div>

          {currentTarifa === 'profesional' && (
            <span className="text-[9px] text-emerald-400 font-semibold block leading-tight">
              Base {product.precioProSinIva.toFixed(2)}€ + 21% IVA
            </span>
          )}

          {currentTarifa === 'descuento' && (
            <span className="text-[9px] text-amber-400 font-bold block leading-tight">
              -{discountPercent}% aplicado
            </span>
          )}
        </div>

        {/* Large Tactile Quick-Add Button */}
        <button
          type="button"
          aria-label={`Añadir ${product.name} al carrito`}
          className="w-9 h-9 rounded-xl bg-cyan-500/15 group-hover:bg-cyan-500 text-cyan-300 group-hover:text-slate-950 flex items-center justify-center font-bold text-lg transition-colors shadow-sm ml-2 shrink-0"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
