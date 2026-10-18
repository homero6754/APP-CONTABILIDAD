import React, { useState } from 'react';
import { Product } from '../types';
import { X, Plus, Sparkles, Barcode } from 'lucide-react';
import { playChimeSound } from '../utils/cashCalculator';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProduct: (product: Product) => void;
}

export const AddProductModal: React.FC<AddProductModalProps> = ({
  isOpen,
  onClose,
  onAddProduct,
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<Product['category']>('Creatinas');
  const [format, setFormat] = useState('500g');
  const [flavor, setFlavor] = useState('Neutro');
  const [stock, setStock] = useState('25');
  const [pvp, setPvp] = useState('36.90');
  const [precioProSinIva, setPrecioProSinIva] = useState('22.00');
  const [barcode, setBarcode] = useState('84365780' + Math.floor(10000 + Math.random() * 90000));
  const [selectedImage, setSelectedImage] = useState('/src/assets/images/iogenix_creatine_clonapure_1792288218078.jpg');

  if (!isOpen) return null;

  const proSinIvaNum = parseFloat(precioProSinIva) || 0;
  const proConIvaNum = Number((proSinIvaNum * 1.21).toFixed(2));

  const handleProSinIvaChange = (val: string) => {
    setPrecioProSinIva(val);
  };

  const handleProConIvaChange = (val: string) => {
    const conIva = parseFloat(val) || 0;
    const sinIva = Number((conIva / 1.21).toFixed(2));
    setPrecioProSinIva(sinIva.toString());
  };

  const handleGenerateBarcode = () => {
    playChimeSound('click');
    setBarcode('8436578' + Math.floor(100000 + Math.random() * 900000));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    playChimeSound('success');
    const newProduct: Product = {
      id: 'prod-' + Date.now(),
      name: name.trim(),
      category,
      format: format.trim() || '500g',
      flavor: flavor.trim() || 'Neutro',
      stock: parseInt(stock, 10) || 0,
      pvp: parseFloat(pvp) || 0,
      precioProSinIva: proSinIvaNum,
      precioProConIva: proConIvaNum,
      barcode: barcode.trim(),
      image: selectedImage,
    };

    onAddProduct(newProduct);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="glass-panel w-full max-w-xl rounded-3xl border border-white/15 shadow-2xl p-6 sm:p-8 space-y-5 my-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/15 border border-cyan-400/30 flex items-center justify-center text-cyan-300">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-black text-xl text-white">
                Añadir Nuevo Suplemento
              </h3>
              <p className="text-xs text-slate-400">
                Registro en catálogo IO.GENIX con tarifas PVP y Profesional con IVA
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Nombre del Suplemento
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Creatina Clonapure® 200 Mesh"
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-900 border border-white/10 text-white font-medium focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Categoría
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Product['category'])}
                className="w-full px-4 py-2.5 rounded-2xl bg-slate-900 border border-white/10 text-white font-medium focus:outline-none focus:border-cyan-400"
              >
                <option value="Creatinas">Creatinas & Fuerza</option>
                <option value="Proteínas">Proteínas CFM / Isolate</option>
                <option value="Pre-Entreno">Pre-Entreno & Energía</option>
                <option value="Aminoácidos">Aminoácidos & BCAA</option>
                <option value="Salud">Salud & Vitaminas</option>
                <option value="Alimentación">Alimentación & Harinas</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Formato / Presentación
              </label>
              <input
                type="text"
                required
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                placeholder="Ej: 250g, 500g, 2kg, 120 cáps"
                className="w-full px-4 py-2.5 rounded-2xl bg-slate-900 border border-white/10 text-white font-medium focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Sabor
              </label>
              <input
                type="text"
                value={flavor}
                onChange={(e) => setFlavor(e.target.value)}
                placeholder="Ej: Neutro, Chocolate Belga"
                className="w-full px-4 py-2.5 rounded-2xl bg-slate-900 border border-white/10 text-white font-medium focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Stock Inicial en Tienda
              </label>
              <input
                type="number"
                min="0"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-slate-900 border border-white/10 text-white font-medium focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          {/* Pricing Section with Highlighted 21% IVA */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 space-y-3">
            <span className="text-[11px] uppercase tracking-wider font-extrabold text-cyan-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Configuración de Tarifas y Precios</span>
            </span>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  PVP Público (€ con 21% IVA)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={pvp}
                    onChange={(e) => setPvp(e.target.value)}
                    placeholder="36.90"
                    className="w-full px-4 py-2.5 rounded-2xl bg-slate-950 border border-cyan-500/40 text-cyan-300 font-display font-black text-lg focus:outline-none"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-cyan-400 font-bold">
                    €
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  Precio Profesional Sin IVA (€)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={precioProSinIva}
                    onChange={(e) => handleProSinIvaChange(e.target.value)}
                    placeholder="22.00"
                    className="w-full px-4 py-2.5 rounded-2xl bg-slate-950 border border-emerald-500/40 text-emerald-300 font-display font-black text-lg focus:outline-none"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-emerald-400 font-bold">
                    €
                  </span>
                </div>
              </div>
            </div>

            {/* Reciprocal highlighted Professional Price with 21% IVA */}
            <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-between text-xs">
              <div>
                <span className="font-extrabold text-emerald-400 block">
                  Precio Profesional con 21% IVA Incluido:
                </span>
                <span className="text-[10px] text-slate-400">
                  Cálculo automático: {proSinIvaNum.toFixed(2)}€ base + {(proSinIvaNum * 0.21).toFixed(2)}€ IVA
                </span>
              </div>
              <div className="font-display font-black text-xl text-emerald-300 tabular-nums">
                {proConIvaNum.toFixed(2)} €
              </div>
            </div>
          </div>

          {/* Barcode & Image Selector */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-slate-300 font-semibold">Código de Barras</label>
                <button
                  type="button"
                  onClick={handleGenerateBarcode}
                  className="text-[10px] text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1"
                >
                  <Barcode className="w-3 h-3" />
                  Auto
                </button>
              </div>
              <input
                type="text"
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
                className="w-full px-4 py-2 rounded-2xl bg-slate-900 border border-white/10 text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Imagen de Suplemento</label>
              <select
                value={selectedImage}
                onChange={(e) => setSelectedImage(e.target.value)}
                className="w-full px-3 py-2 rounded-2xl bg-slate-900 border border-white/10 text-white text-xs"
              >
                <option value="/src/assets/images/iogenix_creatine_clonapure_1792288218078.jpg">Creatine Clonapure Jar</option>
                <option value="/src/assets/images/iogenix_whey_isolate_1792288218829.jpg">Whey Isolate CFM</option>
                <option value="/src/assets/images/iogenix_preworkout_thunder_1792288218778.jpg">Pre-Workout Thunder Shot</option>
                <option value="/src/assets/images/iogenix_bcaa_glutamine_1792288219694.jpg">BCAA + Glutamina Kyowa</option>
              </select>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3 rounded-2xl bg-slate-800 text-slate-300 font-semibold touch-active"
            >
              Cancelar
            </button>
            
            <button
              type="submit"
              className="px-6 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-display font-black text-sm shadow-lg shadow-cyan-500/25 touch-active transition-all"
            >
              Guardar en Catálogo
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
