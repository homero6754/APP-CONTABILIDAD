import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Product,
  CartItem,
  SaleRecord,
  ShiftState,
  ParkedTicket,
  TarifaType,
  ShiftType,
  PaymentMethod,
  CashDenominationBreakdown,
} from './types';
import {
  getTodayDateString,
  loadStoredProducts,
  saveStoredProducts,
  loadStoredSales,
  saveStoredSales,
  loadShiftState,
  saveShiftState,
  loadParkedTickets,
  saveParkedTickets,
} from './utils/storage';
import { Navbar } from './components/Navbar';
import { ShiftSummaryStrip } from './components/ShiftSummaryStrip';
import { ProductCard } from './components/ProductCard';
import { CartSidebar } from './components/CartSidebar';
import { LumierPaymentModal } from './components/LumierPaymentModal';
import { ReceiptModal } from './components/ReceiptModal';
import { MonthlyHistoryView } from './components/MonthlyHistoryView';
import { ShiftCashReconciliationModal } from './components/ShiftCashReconciliationModal';
import { AddProductModal } from './components/AddProductModal';
import { ParkedTicketsModal } from './components/ParkedTicketsModal';
import { StandaloneExportModal } from './components/StandaloneExportModal';
import { Search, Percent, Shield, Tag, Sparkles } from 'lucide-react';
import { playChimeSound } from './utils/cashCalculator';

export default function App() {
  // Persistence state
  const todayDateStr = useMemo(() => getTodayDateString(), []);
  const [products, setProducts] = useState<Product[]>(() => loadStoredProducts());
  const [sales, setSales] = useState<SaleRecord[]>(() => loadStoredSales());
  const [shiftState, setShiftState] = useState<ShiftState>(() => loadShiftState());
  const [parkedTickets, setParkedTickets] = useState<ParkedTicket[]>(() => loadParkedTickets());

  // POS active state
  const [cart, setCart] = useState<CartItem[]>([]);
  const [currentTarifa, setCurrentTarifa] = useState<TarifaType>('pvp');
  const [discountPercent, setDiscountPercent] = useState<number>(10);
  const [activeCategory, setActiveCategory] = useState<string>('Todos');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeView, setActiveView] = useState<'pos' | 'history'>('pos');

  // Modals
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isArqueoOpen, setIsArqueoOpen] = useState(false);
  const [isParkedOpen, setIsParkedOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [lastCompletedSale, setLastCompletedSale] = useState<SaleRecord | null>(null);

  // Sync products to storage
  useEffect(() => {
    saveStoredProducts(products);
  }, [products]);

  // Sync sales to storage
  useEffect(() => {
    saveStoredSales(sales);
  }, [sales]);

  // Sync shift to storage
  useEffect(() => {
    saveShiftState(shiftState);
  }, [shiftState]);

  // Sync parked tickets to storage
  useEffect(() => {
    saveParkedTickets(parkedTickets);
  }, [parkedTickets]);

  // Keyboard shortcut listener (F10 to checkout, Escape to close modals)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F10') {
        e.preventDefault();
        if (cart.length > 0 && !isPaymentOpen) {
          setIsPaymentOpen(true);
        }
      } else if (e.key === 'Escape') {
        setIsPaymentOpen(false);
        setIsAddProductOpen(false);
        setIsArqueoOpen(false);
        setIsParkedOpen(false);
        setIsExportOpen(false);
        setLastCompletedSale(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cart.length, isPaymentOpen]);

  // Filter products by category and search
  const filteredProducts = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    return products.filter((prod) => {
      const matchCat = activeCategory === 'Todos' || prod.category === activeCategory;
      const matchSearch =
        !query ||
        prod.name.toLowerCase().includes(query) ||
        prod.flavor.toLowerCase().includes(query) ||
        prod.format.toLowerCase().includes(query) ||
        prod.barcode.includes(query);
      return matchCat && matchSearch;
    });
  }, [products, activeCategory, searchQuery]);

  // Shift Metrics for Today
  const todayShiftSales = useMemo(() => {
    return sales.filter(
      (s) => s.date === todayDateStr && s.shift === shiftState.shift
    );
  }, [sales, todayDateStr, shiftState.shift]);

  const shiftTotalCard = useMemo(() => {
    return todayShiftSales
      .filter((s) => s.paymentMethod === 'tarjeta')
      .reduce((sum, s) => sum + s.total, 0);
  }, [todayShiftSales]);

  const shiftTotalCash = useMemo(() => {
    return todayShiftSales
      .filter((s) => s.paymentMethod === 'efectivo')
      .reduce((sum, s) => sum + s.total, 0);
  }, [todayShiftSales]);

  // Cart Management
  const handleAddToCart = useCallback((product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [
        ...prev,
        {
          product,
          quantity: 1,
          selectedTarifa: currentTarifa,
          customDiscountPercent: discountPercent,
        },
      ];
    });
  }, [currentTarifa, discountPercent]);

  const handleUpdateQty = useCallback((productId: string, delta: number) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  }, []);

  const handleRemoveCartItem = useCallback((productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  }, []);

  const handleClearCart = useCallback(() => {
    setCart([]);
  }, []);

  // Calculate cart total to pay
  const totalToPay = useMemo(() => {
    return cart.reduce((sum, item) => {
      let price = item.product.pvp;
      if (currentTarifa === 'profesional') {
        price = item.product.precioProConIva;
      } else if (currentTarifa === 'descuento') {
        price = Number((item.product.pvp * (1 - discountPercent / 100)).toFixed(2));
      }
      return sum + price * item.quantity;
    }, 0);
  }, [cart, currentTarifa, discountPercent]);

  // Shift Change
  const handleShiftChange = (shift: ShiftType) => {
    playChimeSound('click');
    setShiftState((prev) => ({
      ...prev,
      shift,
    }));
  };

  // Park Ticket
  const handleParkTicket = () => {
    if (cart.length === 0) return;
    playChimeSound('click');
    const newParked: ParkedTicket = {
      id: 'parked-' + Date.now(),
      timestamp: Date.now(),
      customerNote: `Cliente #${parkedTickets.length + 1}`,
      items: [...cart],
      tarifa: currentTarifa,
      discountPercent,
    };
    setParkedTickets((prev) => [...prev, newParked]);
    setCart([]);
  };

  const handleResumeTicket = (ticket: ParkedTicket) => {
    setCart(ticket.items);
    setCurrentTarifa(ticket.tarifa);
    setDiscountPercent(ticket.discountPercent);
    setParkedTickets((prev) => prev.filter((t) => t.id !== ticket.id));
    setIsParkedOpen(false);
  };

  const handleDeleteParkedTicket = (ticketId: string) => {
    setParkedTickets((prev) => prev.filter((t) => t.id !== ticketId));
  };

  // Complete Sale (Lumier Cash or Card)
  const handleCompleteSale = ({
    paymentMethod,
    cashGiven,
    cashChange,
    cashBreakdown,
  }: {
    paymentMethod: PaymentMethod;
    cashGiven?: number;
    cashChange?: number;
    cashBreakdown?: CashDenominationBreakdown;
  }) => {
    const subtotal = Number((totalToPay / 1.21).toFixed(2));
    const iva = Number((totalToPay - subtotal).toFixed(2));
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    const ticketSeq = sales.length + 1001;

    const newSale: SaleRecord = {
      id: 'sale-' + Date.now(),
      ticketNumber: `TK-${todayDateStr.replace(/-/g, '')}-${ticketSeq}`,
      timestamp: Date.now(),
      date: todayDateStr,
      timeStr,
      shift: shiftState.shift,
      items: [...cart],
      tarifa: currentTarifa,
      discountPercent,
      subtotalSinIva: subtotal,
      iva,
      total: totalToPay,
      paymentMethod,
      cashGiven,
      cashChange,
      cashBreakdown,
    };

    // Update sales history
    setSales((prev) => [...prev, newSale]);

    // Decrement stock in catalog
    setProducts((prev) => {
      return prev.map((p) => {
        const cartItem = cart.find((ci) => ci.product.id === p.id);
        if (cartItem) {
          return { ...p, stock: Math.max(0, p.stock - cartItem.quantity) };
        }
        return p;
      });
    });

    // Close payment modal, clear cart, show receipt
    setIsPaymentOpen(false);
    setCart([]);
    setLastCompletedSale(newSale);
  };

  // Add Product to Catalog
  const handleAddProduct = (newProduct: Product) => {
    setProducts((prev) => [newProduct, ...prev]);
  };

  // Shift Close and Reconciliation
  const handleConfirmCloseShift = (
    countedCash: number,
    difference: number,
    notes: string
  ) => {
    setShiftState((prev) => ({
      ...prev,
      isClosed: true,
      closedAt: Date.now(),
      closedCashCounted: countedCash,
      notes,
    }));
    setIsArqueoOpen(false);
    setActiveView('history');
  };

  const categories = [
    'Todos',
    'Creatinas',
    'Proteínas',
    'Pre-Entreno',
    'Aminoácidos',
    'Salud',
    'Alimentación',
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#070b13] text-slate-100 selection:bg-cyan-500 selection:text-slate-950">
      
      {/* Top Bar Navigation */}
      <Navbar
        currentDate={todayDateStr}
        activeShift={shiftState.shift}
        onShiftChange={handleShiftChange}
        activeView={activeView}
        onViewChange={setActiveView}
        onOpenArqueo={() => setIsArqueoOpen(true)}
        parkedCount={parkedTickets.length}
        onOpenParked={() => setIsParkedOpen(true)}
        onOpenExportModal={() => setIsExportOpen(true)}
      />

      {/* Shift Live Counters & Shortcuts */}
      <ShiftSummaryStrip
        activeShift={shiftState.shift}
        salesCount={todayShiftSales.length}
        totalCard={shiftTotalCard}
        totalCash={shiftTotalCash}
        initialCashFloat={shiftState.initialCashFloat}
        onOpenNewProduct={() => setIsAddProductOpen(true)}
        onOpenArqueo={() => setIsArqueoOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-[1750px] w-full mx-auto p-4 sm:p-6">
        
        {activeView === 'pos' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Catalog & Filter System (8 cols) */}
            <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-4">
              
              {/* TARIFF SELECTOR BAR (Interactive & Tactile) */}
              <div className="glass-panel p-3 sm:p-4 rounded-3xl flex flex-wrap items-center justify-between gap-3 shadow-xl border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 text-xs uppercase font-extrabold tracking-wider text-slate-300">
                    <Tag className="w-4 h-4 text-cyan-400" />
                    <span>Tarifa Venta:</span>
                  </div>

                  <div className="flex p-1 bg-slate-900 border border-white/10 rounded-2xl">
                    
                    {/* PVP Button */}
                    <button
                      onClick={() => {
                        playChimeSound('click');
                        setCurrentTarifa('pvp');
                      }}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all touch-active ${
                        currentTarifa === 'pvp'
                          ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/25'
                          : 'text-slate-300 hover:text-white'
                      }`}
                    >
                      PVP General
                    </button>

                    {/* Profesional Button (+21% IVA Included & Highlighted) */}
                    <button
                      onClick={() => {
                        playChimeSound('click');
                        setCurrentTarifa('profesional');
                      }}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all touch-active flex items-center gap-2 ${
                        currentTarifa === 'profesional'
                          ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/25'
                          : 'text-slate-300 hover:text-white'
                      }`}
                    >
                      <Shield className="w-3.5 h-3.5" />
                      <span>Tarifa Profesional</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950/60 text-emerald-300 font-bold border border-emerald-400/30">
                        +21% IVA Inc.
                      </span>
                    </button>

                    {/* Descuento % Button */}
                    <button
                      onClick={() => {
                        playChimeSound('click');
                        setCurrentTarifa('descuento');
                      }}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all touch-active flex items-center gap-1.5 ${
                        currentTarifa === 'descuento'
                          ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/25'
                          : 'text-slate-300 hover:text-white'
                      }`}
                    >
                      <Percent className="w-3.5 h-3.5" />
                      <span>Descuento %</span>
                    </button>

                  </div>
                </div>

                {/* Sub-controls when Descuento is active */}
                {currentTarifa === 'descuento' && (
                  <div className="flex items-center gap-2 animate-fadeIn">
                    <span className="text-xs text-amber-400 font-bold">Rebaja:</span>
                    <div className="flex items-center gap-1 bg-slate-900 border border-white/10 p-1 rounded-xl">
                      {[5, 10, 15, 20].map((pct) => (
                        <button
                          key={pct}
                          onClick={() => {
                            playChimeSound('click');
                            setDiscountPercent(pct);
                          }}
                          className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors ${
                            discountPercent === pct
                              ? 'bg-amber-500 text-slate-950 shadow-sm'
                              : 'text-slate-300 hover:bg-white/10'
                          }`}
                        >
                          {pct}%
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min="0"
                        max="80"
                        value={discountPercent}
                        onChange={(e) => setDiscountPercent(Math.max(0, Math.min(80, Number(e.target.value) || 0)))}
                        className="w-14 px-2 py-1 bg-slate-900 border border-amber-500/40 rounded-lg text-center text-xs font-black text-amber-300 focus:outline-none"
                      />
                      <span className="text-xs text-amber-400 font-bold">%</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Search Bar & Category Filter Tabs */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar suplemento (ej. Creatina Clonapure), sabor o código..."
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border border-white/10 rounded-2xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors shadow-inner"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Category Tabs */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        playChimeSound('click');
                        setActiveCategory(cat);
                      }}
                      className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors touch-active ${
                        activeCategory === cat
                          ? 'bg-white text-slate-950 font-bold shadow-md'
                          : 'bg-slate-900/80 text-slate-400 hover:text-white border border-white/5'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Product Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3.5 overflow-y-auto max-h-[calc(100vh-290px)] pr-1">
                {filteredProducts.length === 0 ? (
                  <div className="col-span-full py-16 text-center text-slate-500 text-sm">
                    No se encontraron productos coincidentes en el catálogo.
                  </div>
                ) : (
                  filteredProducts.map((prod) => (
                    <ProductCard
                      key={prod.id}
                      product={prod}
                      currentTarifa={currentTarifa}
                      discountPercent={discountPercent}
                      onAddToCart={handleAddToCart}
                    />
                  ))
                )}
              </div>

            </div>

            {/* Tactile Cart Sidebar (4 cols) */}
            <div className="lg:col-span-5 xl:col-span-4">
              <CartSidebar
                cart={cart}
                currentTarifa={currentTarifa}
                discountPercent={discountPercent}
                onUpdateQty={handleUpdateQty}
                onRemoveItem={handleRemoveCartItem}
                onClearCart={handleClearCart}
                onParkTicket={handleParkTicket}
                onOpenCheckout={() => setIsPaymentOpen(true)}
              />
            </div>

          </div>
        ) : (
          /* Monthly History View */
          <MonthlyHistoryView
            sales={sales}
            todayDateStr={todayDateStr}
          />
        )}

      </main>

      {/* ALL MODALS */}

      {/* Lumier Tactile Cash & Card Payment Modal */}
      <LumierPaymentModal
        isOpen={isPaymentOpen}
        totalToPay={totalToPay}
        initialCashFloat={shiftState.initialCashFloat}
        currentShiftCashSales={shiftTotalCash}
        onClose={() => setIsPaymentOpen(false)}
        onCompleteSale={handleCompleteSale}
      />

      {/* 80mm POS Thermal Receipt Modal */}
      <ReceiptModal
        sale={lastCompletedSale}
        onClose={() => setLastCompletedSale(null)}
      />

      {/* Add New Product Modal */}
      <AddProductModal
        isOpen={isAddProductOpen}
        onClose={() => setIsAddProductOpen(false)}
        onAddProduct={handleAddProduct}
      />

      {/* Shift Cash Reconciliation & Closure Modal */}
      <ShiftCashReconciliationModal
        isOpen={isArqueoOpen}
        activeShift={shiftState.shift}
        initialCashFloat={shiftState.initialCashFloat}
        cashSalesAmount={shiftTotalCash}
        cardSalesAmount={shiftTotalCard}
        salesCount={todayShiftSales.length}
        onClose={() => setIsArqueoOpen(false)}
        onConfirmCloseShift={handleConfirmCloseShift}
      />

      {/* Parked Tickets Modal */}
      <ParkedTicketsModal
        isOpen={isParkedOpen}
        parkedTickets={parkedTickets}
        onClose={() => setIsParkedOpen(false)}
        onResumeTicket={handleResumeTicket}
        onDeleteTicket={handleDeleteParkedTicket}
      />

      {/* Standalone HTML Export Modal */}
      <StandaloneExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
      />

    </div>
  );
}
