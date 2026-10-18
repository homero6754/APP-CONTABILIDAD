/**
 * Standalone Single-File HTML Generator
 * Produces an ultra-clean, completely autonomous HTML file with embedded
 * Tailwind CSS CDN, fonts, pure JavaScript, and localStorage persistence.
 */

export function generateStandaloneHtml(): string {
  return `<!DOCTYPE html>
<html lang="es" class="dark">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <title>IO.GENIX TPV Pro & Control de Caja</title>
  <meta name="description" content="TPV de caja táctil, tarifas PVP/Pro, desglose estilo Lumier y arqueo de turnos para distribuidora IO.GENIX" />
  
  <!-- Google Fonts: Outfit & Plus Jakarta Sans & JetBrains Mono -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600;700&display=swap" rel="stylesheet">
  
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          fontFamily: {
            sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
            display: ['Outfit', 'sans-serif'],
            mono: ['JetBrains Mono', 'monospace'],
          },
          colors: {
            brand: {
              cyan: '#00e5ff',
              gold: '#f59e0b',
              dark: '#080c14',
              surface: '#0f172a',
              card: '#161f33',
              border: 'rgba(255, 255, 255, 0.08)',
            }
          }
        }
      }
    }
  </script>

  <style>
    body {
      font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
      background-color: #080c14;
      color: #f1f5f9;
      user-select: none;
      -webkit-user-select: none;
      -webkit-tap-highlight-color: transparent;
    }
    .font-display { font-family: 'Outfit', sans-serif; }
    .font-mono-tabular { font-family: 'JetBrains Mono', monospace; font-variant-numeric: tabular-nums; }
    
    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-track { background: rgba(15, 23, 42, 0.6); }
    ::-webkit-scrollbar-thumb { background: rgba(100, 116, 139, 0.4); border-radius: 9999px; }
    ::-webkit-scrollbar-thumb:hover { background: rgba(148, 163, 184, 0.6); }

    .glass-panel {
      background: rgba(15, 23, 42, 0.85);
      backdrop-filter: blur(14px);
      -webkit-backdrop-filter: blur(14px);
      border: 1px solid rgba(255, 255, 255, 0.08);
    }
    .glass-card {
      background: rgba(22, 31, 51, 0.7);
      backdrop-filter: blur(8px);
      border: 1px solid rgba(255, 255, 255, 0.06);
    }
    .touch-btn:active {
      transform: scale(0.96);
    }

    @media print {
      body * { visibility: hidden; }
      #printable-receipt, #printable-receipt * { visibility: visible; }
      #printable-receipt {
        position: absolute;
        left: 0;
        top: 0;
        width: 78mm;
        margin: 0;
        padding: 8px;
        background: #ffffff !important;
        color: #000000 !important;
        font-family: 'JetBrains Mono', monospace, Courier, sans-serif;
        font-size: 11px;
      }
      @page { size: 80mm auto; margin: 2mm; }
    }
  </style>
</head>
<body class="min-h-screen flex flex-col bg-[#080c14] text-slate-100">

  <!-- TOP BAR NAVIGATION -->
  <header class="border-b border-white/10 bg-[#0b1120]/90 sticky top-0 z-40 backdrop-blur-md px-4 sm:px-6 py-3">
    <div class="max-w-[1700px] mx-auto flex items-center justify-between gap-4">
      
      <!-- ZONE 1: BRAND -->
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 font-display font-extrabold text-slate-950 text-xl tracking-tighter">
          IO
        </div>
        <div>
          <div class="flex items-center gap-2">
            <span class="font-display font-black text-xl tracking-wider text-white">IO.GENIX</span>
            <span class="text-xs uppercase tracking-widest px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-semibold">TPV Pro</span>
          </div>
          <div class="text-[11px] text-slate-400">Distribuidora Oficial de Suplementación Deportiva</div>
        </div>
      </div>

      <!-- ZONE 2: NAV TABS -->
      <nav class="hidden md:flex items-center gap-1.5 p-1 bg-slate-900/90 border border-white/5 rounded-xl">
        <button id="nav-btn-pos" onclick="app.switchView('pos')" class="px-4 py-2 rounded-lg text-sm font-semibold transition-all bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/25">
          Terminal TPV
        </button>
        <button id="nav-btn-history" onclick="app.switchView('history')" class="px-4 py-2 rounded-lg text-sm font-medium transition-all text-slate-300 hover:text-white hover:bg-white/5">
          Histórico Mensual
        </button>
        <button id="nav-btn-arqueo" onclick="app.openArqueoModal()" class="px-4 py-2 rounded-lg text-sm font-medium transition-all text-slate-300 hover:text-white hover:bg-white/5">
          Arqueo de Turno
        </button>
      </nav>

      <!-- ZONE 3: ACTIONS & SHIFT CONTROL -->
      <div class="flex items-center gap-3">
        <!-- Date display -->
        <div class="hidden lg:flex flex-col text-right pr-2 border-r border-white/10">
          <span id="header-date" class="text-xs font-semibold text-slate-200">Hoy</span>
          <span class="text-[10px] text-slate-400 font-mono">Detección Automática</span>
        </div>

        <!-- Shift toggle button -->
        <div class="flex items-center bg-slate-900 border border-white/10 p-1 rounded-xl">
          <button id="btn-shift-manana" onclick="app.setShift('mañana')" class="px-3 py-1.5 rounded-lg text-xs font-bold transition-all bg-amber-500 text-slate-950 shadow-sm flex items-center gap-1.5">
            <span>☀️</span> Turno Mañana
          </button>
          <button id="btn-shift-tarde" onclick="app.setShift('tarde')" class="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white transition-all flex items-center gap-1.5">
            <span>🌙</span> Turno Tarde
          </button>
        </div>

        <!-- Parked Tickets count badge -->
        <button onclick="app.openParkedModal()" class="relative p-2.5 rounded-xl bg-slate-900 border border-white/10 hover:border-amber-400/40 text-amber-400 transition-colors touch-btn" title="Tickets Aparcados">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <span id="badge-parked-count" class="hidden absolute -top-1 -right-1 w-5 h-5 bg-amber-500 text-slate-950 rounded-full text-[10px] font-bold flex items-center justify-center">0</span>
        </button>
      </div>

    </div>
  </header>

  <!-- SHIFT STATS STRIP -->
  <section class="border-b border-white/5 bg-[#0e1628]/80 px-4 sm:px-6 py-2.5">
    <div class="max-w-[1700px] mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
      <div class="flex items-center gap-6">
        <div class="flex items-center gap-2">
          <span class="text-slate-400 font-medium">Turno Activo:</span>
          <span id="strip-active-shift" class="font-bold text-amber-400 uppercase tracking-wider">Turno Mañana</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-slate-400">Ventas Hoy:</span>
          <span id="strip-sales-count" class="font-mono-tabular font-bold text-white">0</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-slate-400">Total TPV (Tarjeta):</span>
          <span id="strip-card-total" class="font-mono-tabular font-bold text-cyan-400">0.00 €</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-slate-400">Total Efectivo:</span>
          <span id="strip-cash-total" class="font-mono-tabular font-bold text-emerald-400">0.00 €</span>
        </div>
        <div class="hidden xl:flex items-center gap-2">
          <span class="text-slate-400">Fondo + Cajón Teórico:</span>
          <span id="strip-drawer-total" class="font-mono-tabular font-bold text-amber-300">150.00 €</span>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <button onclick="app.openNewProductModal()" class="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 text-xs font-semibold flex items-center gap-1.5 touch-btn">
          <svg class="w-3.5 h-3.5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
          Nuevo Producto
        </button>
        <button onclick="app.openArqueoModal()" class="px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-1.5 touch-btn">
          <span>⚡</span> Cierre y Arqueo
        </button>
      </div>
    </div>
  </section>

  <!-- MAIN APP CONTAINER -->
  <main class="flex-1 max-w-[1700px] w-full mx-auto p-4 sm:p-6">

    <!-- VIEW 1: POS TERMINAL -->
    <div id="view-pos" class="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full items-start">
      
      <!-- LEFT 8 COLS: PRODUCT CATALOG & TARIFF SELECTOR -->
      <div class="lg:col-span-7 xl:col-span-8 flex flex-col gap-4">
        
        <!-- TARIFF & DISCOUNT BAR (Sticky & Tactile) -->
        <div class="glass-panel p-3.5 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-xl">
          <div class="flex items-center gap-2">
            <span class="text-xs uppercase tracking-wider text-slate-400 font-semibold">Tarifa Venta:</span>
            <div class="flex p-1 bg-slate-900 border border-white/10 rounded-xl">
              <button id="tarifa-btn-pvp" onclick="app.setTarifa('pvp')" class="px-4 py-2 rounded-lg text-xs font-bold transition-all bg-cyan-500 text-slate-950 shadow-sm touch-btn">
                PVP Público
              </button>
              <button id="tarifa-btn-pro" onclick="app.setTarifa('profesional')" class="px-4 py-2 rounded-lg text-xs font-medium text-slate-300 hover:text-white transition-all touch-btn flex items-center gap-1.5">
                <span>Profesional</span>
                <span class="text-[10px] px-1 py-0.2 bg-emerald-500/20 text-emerald-300 rounded font-semibold border border-emerald-500/30">+21% IVA Inc.</span>
              </button>
              <button id="tarifa-btn-desc" onclick="app.setTarifa('descuento')" class="px-4 py-2 rounded-lg text-xs font-medium text-slate-300 hover:text-white transition-all touch-btn">
                Descuento %
              </button>
            </div>
          </div>

          <!-- Dynamic Discount Controls when Descuento is active -->
          <div id="discount-controls" class="hidden flex items-center gap-2">
            <span class="text-xs text-amber-400 font-semibold">Rebaja:</span>
            <div class="flex items-center gap-1 bg-slate-900 border border-white/10 p-1 rounded-xl">
              <button onclick="app.setDiscountPercent(5)" class="px-2.5 py-1 text-xs rounded hover:bg-white/10 text-slate-200">5%</button>
              <button onclick="app.setDiscountPercent(10)" class="px-2.5 py-1 text-xs rounded hover:bg-white/10 text-slate-200">10%</button>
              <button onclick="app.setDiscountPercent(15)" class="px-2.5 py-1 text-xs rounded hover:bg-white/10 text-slate-200">15%</button>
              <button onclick="app.setDiscountPercent(20)" class="px-2.5 py-1 text-xs rounded hover:bg-white/10 text-slate-200">20%</button>
            </div>
            <div class="flex items-center gap-1">
              <input type="number" id="input-discount-val" onchange="app.setDiscountPercent(Number(this.value))" min="0" max="90" value="10" class="w-16 px-2 py-1 bg-slate-900 border border-amber-500/40 rounded-lg text-center text-xs font-bold text-amber-300 focus:outline-none" />
              <span class="text-xs text-amber-400 font-bold">%</span>
            </div>
          </div>
        </div>

        <!-- SEARCH AND CATEGORY FILTER TABS -->
        <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <!-- Search input -->
          <div class="relative flex-1">
            <svg class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            <input type="text" id="catalog-search" oninput="app.filterCatalog()" placeholder="Buscar suplemento, sabor o código de barras..." class="w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors" />
          </div>

          <!-- Category filter buttons -->
          <div class="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0" id="category-tabs">
            <!-- Rendered by JS -->
          </div>
        </div>

        <!-- PRODUCT GRID -->
        <div id="product-grid" class="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3.5 overflow-y-auto max-h-[calc(100vh-290px)] pr-1">
          <!-- Populated by JS -->
        </div>

      </div>

      <!-- RIGHT 4-5 COLS: TICKET / CART -->
      <div class="lg:col-span-5 xl:col-span-4 glass-panel rounded-2xl flex flex-col h-[calc(100vh-170px)] sticky top-20 shadow-2xl border border-white/10 overflow-hidden">
        
        <!-- Cart Header -->
        <div class="p-4 border-b border-white/10 bg-slate-900/60 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <div class="w-2.5 h-2.5 rounded-full bg-cyan-400"></div>
            <h2 class="font-display font-bold text-base text-white">Ticket de Venta</h2>
            <span id="cart-item-count" class="text-xs text-slate-400 font-mono">(0 productos)</span>
          </div>
          <button onclick="app.parkCurrentTicket()" class="px-2.5 py-1 text-xs text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 rounded-lg border border-amber-400/30 transition-colors flex items-center gap-1 touch-btn" title="Pausar venta para atender a otro cliente">
            <span>⏸️</span> Aparcar
          </button>
        </div>

        <!-- Cart Items List -->
        <div id="cart-items-list" class="flex-1 overflow-y-auto p-3 space-y-2.5">
          <!-- Items or empty state rendered by JS -->
        </div>

        <!-- Cart Financial Totals Breakdown -->
        <div class="p-4 bg-slate-900/90 border-t border-white/10 space-y-2">
          
          <div class="flex items-center justify-between text-xs text-slate-400">
            <span>Base Imponible (Sin IVA):</span>
            <span id="cart-subtotal" class="font-mono-tabular font-medium text-slate-200">0.00 €</span>
          </div>

          <div class="flex items-center justify-between text-xs text-slate-400">
            <span>IVA General (21%):</span>
            <span id="cart-iva" class="font-mono-tabular font-medium text-slate-200">0.00 €</span>
          </div>

          <div id="cart-discount-row" class="hidden flex items-center justify-between text-xs text-amber-400">
            <span>Descuento aplicado:</span>
            <span id="cart-discount-val" class="font-mono-tabular font-bold">-0.00 €</span>
          </div>

          <div class="pt-2 border-t border-white/10 flex items-baseline justify-between">
            <div>
              <div class="font-display font-bold text-xs uppercase tracking-wider text-slate-400">Total a Cobrar</div>
              <div class="text-[10px] text-cyan-400 font-medium">IVA 21% Incluido</div>
            </div>
            <div id="cart-total-giant" class="font-display font-black text-3xl sm:text-4xl text-white tracking-tight tabular-nums">
              0.00 €
            </div>
          </div>

          <!-- Bottom Action Buttons -->
          <div class="grid grid-cols-3 gap-2 pt-2">
            <button onclick="app.clearCart()" class="py-3 px-2 rounded-xl bg-slate-800 hover:bg-red-950/40 text-slate-400 hover:text-rose-400 border border-white/10 hover:border-rose-500/40 text-xs font-bold transition-all touch-btn">
              Vaciar
            </button>
            <button onclick="app.openPaymentModal()" class="col-span-2 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-400 via-cyan-500 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-display font-black text-base shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 transition-all touch-btn">
              <span>COBRAR</span>
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </button>
          </div>

        </div>

      </div>

    </div>

    <!-- VIEW 2: MONTHLY HISTORY TABLE -->
    <div id="view-history" class="hidden flex flex-col gap-6">
      
      <!-- Historical KPI Summary Cards -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="glass-panel p-4 rounded-2xl border border-white/10">
          <div class="text-xs text-slate-400 uppercase font-semibold">Facturación Mensual</div>
          <div id="kpi-month-total" class="font-display font-black text-2xl sm:text-3xl text-white mt-1">0.00 €</div>
          <div class="text-[11px] text-cyan-400 mt-1">Acumulado mes en curso</div>
        </div>
        <div class="glass-panel p-4 rounded-2xl border border-white/10">
          <div class="text-xs text-slate-400 uppercase font-semibold">Total TPV (Tarjeta)</div>
          <div id="kpi-month-card" class="font-display font-black text-2xl sm:text-3xl text-cyan-400 mt-1">0.00 €</div>
          <div class="text-[11px] text-slate-400 mt-1">Operaciones datáfono</div>
        </div>
        <div class="glass-panel p-4 rounded-2xl border border-white/10">
          <div class="text-xs text-slate-400 uppercase font-semibold">Total Efectivo</div>
          <div id="kpi-month-cash" class="font-display font-black text-2xl sm:text-3xl text-emerald-400 mt-1">0.00 €</div>
          <div class="text-[11px] text-slate-400 mt-1">Recaudación física</div>
        </div>
        <div class="glass-panel p-4 rounded-2xl border border-white/10">
          <div class="text-xs text-slate-400 uppercase font-semibold">Nº Ventas / Ticket Medio</div>
          <div id="kpi-month-tickets" class="font-display font-black text-2xl sm:text-3xl text-amber-400 mt-1">0 / 0.00€</div>
          <div class="text-[11px] text-slate-400 mt-1">Promedio por ticket</div>
        </div>
      </div>

      <!-- Month Header & Export Action -->
      <div class="flex items-center justify-between">
        <div>
          <h2 class="font-display font-bold text-2xl text-white">Histórico de Ventas del Mes</h2>
          <p class="text-xs text-slate-400">Días pasados bloqueados en modo solo lectura con auditoría inalterable.</p>
        </div>
        <div class="flex items-center gap-2">
          <button onclick="app.exportHistoryCsv()" class="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 text-xs font-semibold flex items-center gap-2 touch-btn">
            <svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            Exportar CSV
          </button>
        </div>
      </div>

      <!-- Table Container -->
      <div class="glass-panel rounded-2xl overflow-hidden border border-white/10">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-900/90 text-slate-400 uppercase tracking-wider text-[11px] border-b border-white/10">
              <tr>
                <th class="py-3 px-4 font-semibold">Día / Fecha</th>
                <th class="py-3 px-4 font-semibold text-center bg-amber-500/5">Turno Mañana (Ventas · Tarjeta · Efectivo)</th>
                <th class="py-3 px-4 font-semibold text-center bg-blue-500/5">Turno Tarde (Ventas · Tarjeta · Efectivo)</th>
                <th class="py-3 px-4 font-semibold text-right">Total Diario</th>
                <th class="py-3 px-4 font-semibold text-center">Estado</th>
              </tr>
            </thead>
            <tbody id="history-table-body" class="divide-y divide-white/5">
              <!-- Populated by JS -->
            </tbody>
          </table>
        </div>
      </div>

    </div>

  </main>

  <!-- ==================== MODALS ==================== -->

  <!-- MODAL: LUMIER CASH & CARD PAYMENT -->
  <div id="modal-payment" class="fixed inset-0 z-50 bg-black/80 backdrop-blur-md hidden flex items-center justify-center p-3 sm:p-4">
    <div class="glass-panel w-full max-w-3xl rounded-3xl border border-white/15 shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
      
      <!-- Payment Modal Header -->
      <div class="p-4 sm:p-5 border-b border-white/10 bg-slate-900/80 flex items-center justify-between">
        <div>
          <h3 class="font-display font-bold text-xl text-white">Cobro y Desglose de Caja</h3>
          <p class="text-xs text-slate-400">Estilo Lumier táctil y cálculo instantáneo de cambio</p>
        </div>
        <button onclick="app.closePaymentModal()" class="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center touch-btn">
          ✕
        </button>
      </div>

      <!-- Payment Method Tabs -->
      <div class="p-4 bg-slate-900/40 border-b border-white/5 flex gap-2">
        <button id="pay-tab-cash" onclick="app.setPaymentMethod('efectivo')" class="flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 touch-btn">
          <span>💵</span> Cobro en Efectivo
        </button>
        <button id="pay-tab-card" onclick="app.setPaymentMethod('tarjeta')" class="flex-1 py-3 px-4 rounded-xl font-medium text-sm text-slate-400 hover:text-white bg-slate-800/80 transition-all flex items-center justify-center gap-2 touch-btn">
          <span>💳</span> Tarjeta / Datáfono TPV
        </button>
      </div>

      <!-- CASH PAYMENT CONTENT -->
      <div id="pay-cash-content" class="p-4 sm:p-6 overflow-y-auto space-y-5">
        
        <!-- Big Figures: Total vs Entregado vs Cambio -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          
          <div class="bg-slate-900/80 p-3.5 rounded-2xl border border-white/10 text-center">
            <span class="text-[11px] uppercase font-semibold text-slate-400 block">Total a Cobrar</span>
            <span id="pay-total-display" class="font-display font-black text-2xl sm:text-3xl text-white mt-1 block">0.00 €</span>
          </div>

          <div class="bg-slate-900/80 p-3.5 rounded-2xl border border-cyan-500/30 text-center">
            <span class="text-[11px] uppercase font-semibold text-cyan-400 block">Entregado por Cliente</span>
            <div class="flex items-center justify-center gap-1 mt-1">
              <span id="pay-given-display" class="font-display font-black text-2xl sm:text-3xl text-cyan-300">0.00</span>
              <span class="text-sm font-bold text-cyan-400">€</span>
            </div>
          </div>

          <div id="pay-change-card" class="bg-slate-900/80 p-3.5 rounded-2xl border border-emerald-500/40 text-center transition-colors">
            <span class="text-[11px] uppercase font-bold text-emerald-400 block">CAMBIO A DEVOLVER</span>
            <span id="pay-change-display" class="font-display font-black text-2xl sm:text-3xl text-emerald-400 mt-1 block">0.00 €</span>
          </div>

        </div>

        <!-- LUMIER TACTILE BILLS ROW -->
        <div>
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs uppercase font-bold text-slate-300 tracking-wider">Billetes (Toque rápido):</span>
            <button onclick="app.setExactCash()" class="px-2.5 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold touch-btn">
              ⚡ Importe Exacto
            </button>
          </div>
          <div class="grid grid-cols-5 gap-2.5">
            <button onclick="app.addCash(100)" class="py-3 px-2 rounded-xl bg-emerald-950/80 hover:bg-emerald-900/80 text-emerald-300 border-2 border-emerald-500/50 font-display font-black text-base sm:text-lg flex flex-col items-center justify-center shadow-lg touch-btn">
              <span>100 €</span>
              <span class="text-[9px] uppercase tracking-widest text-emerald-400 font-sans">Billete</span>
            </button>
            <button onclick="app.addCash(50)" class="py-3 px-2 rounded-xl bg-amber-950/80 hover:bg-amber-900/80 text-amber-300 border-2 border-amber-500/50 font-display font-black text-base sm:text-lg flex flex-col items-center justify-center shadow-lg touch-btn">
              <span>50 €</span>
              <span class="text-[9px] uppercase tracking-widest text-amber-400 font-sans">Billete</span>
            </button>
            <button onclick="app.addCash(20)" class="py-3 px-2 rounded-xl bg-blue-950/80 hover:bg-blue-900/80 text-blue-300 border-2 border-blue-500/50 font-display font-black text-base sm:text-lg flex flex-col items-center justify-center shadow-lg touch-btn">
              <span>20 €</span>
              <span class="text-[9px] uppercase tracking-widest text-blue-400 font-sans">Billete</span>
            </button>
            <button onclick="app.addCash(10)" class="py-3 px-2 rounded-xl bg-rose-950/80 hover:bg-rose-900/80 text-rose-300 border-2 border-rose-500/50 font-display font-black text-base sm:text-lg flex flex-col items-center justify-center shadow-lg touch-btn">
              <span>10 €</span>
              <span class="text-[9px] uppercase tracking-widest text-rose-400 font-sans">Billete</span>
            </button>
            <button onclick="app.addCash(5)" class="py-3 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border-2 border-slate-500/50 font-display font-black text-base sm:text-lg flex flex-col items-center justify-center shadow-lg touch-btn">
              <span>5 €</span>
              <span class="text-[9px] uppercase tracking-widest text-slate-400 font-sans">Billete</span>
            </button>
          </div>
        </div>

        <!-- LUMIER TACTILE COINS ROW -->
        <div>
          <span class="text-xs uppercase font-bold text-slate-300 tracking-wider block mb-2">Monedas (Toque rápido):</span>
          <div class="grid grid-cols-5 gap-2.5">
            <button onclick="app.addCash(2)" class="py-2.5 rounded-full bg-yellow-950/60 hover:bg-yellow-900/60 text-yellow-200 border-2 border-yellow-400/60 font-display font-black text-sm flex items-center justify-center shadow touch-btn">
              2.00 €
            </button>
            <button onclick="app.addCash(1)" class="py-2.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-100 border-2 border-amber-400/50 font-display font-black text-sm flex items-center justify-center shadow touch-btn">
              1.00 €
            </button>
            <button onclick="app.addCash(0.50)" class="py-2.5 rounded-full bg-amber-950/60 hover:bg-amber-900/60 text-amber-200 border-2 border-amber-500/50 font-display font-black text-sm flex items-center justify-center shadow touch-btn">
              0.50 €
            </button>
            <button onclick="app.addCash(0.20)" class="py-2.5 rounded-full bg-amber-950/50 hover:bg-amber-900/50 text-amber-300 border-2 border-amber-600/40 font-display font-black text-sm flex items-center justify-center shadow touch-btn">
              0.20 €
            </button>
            <button onclick="app.addCash(0.10)" class="py-2.5 rounded-full bg-amber-950/50 hover:bg-amber-900/50 text-amber-300 border-2 border-amber-700/40 font-display font-black text-sm flex items-center justify-center shadow touch-btn">
              0.10 €
            </button>
          </div>
        </div>

        <!-- VISUAL CHANGE BREAKDOWN ESTILO LUMIER -->
        <div class="bg-slate-900/90 p-4 rounded-2xl border border-emerald-500/30">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs uppercase font-bold text-emerald-400 tracking-wider">Desglose Físico a Entregar al Cliente:</span>
            <span id="breakdown-status-label" class="text-[11px] text-slate-400">Listo para entregar</span>
          </div>
          <div id="breakdown-cards-container" class="flex flex-wrap gap-2 min-h-[48px] items-center">
            <!-- Badges rendered by JS -->
          </div>
        </div>

        <!-- CASH DRAWER REAL-TIME COUNTER -->
        <div class="flex items-center justify-between text-xs text-slate-400 px-2 py-1 bg-slate-900/50 rounded-xl">
          <span class="flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-amber-400"></span>
            <span>Dinero físico acumulado en cajón:</span>
          </span>
          <span id="cash-drawer-preview" class="font-mono-tabular font-bold text-amber-300">150.00 €</span>
        </div>

      </div>

      <!-- CARD PAYMENT CONTENT -->
      <div id="pay-card-content" class="hidden p-8 flex flex-col items-center justify-center text-center space-y-4">
        <div class="w-20 h-20 rounded-2xl bg-cyan-500/10 border-2 border-cyan-400/40 flex items-center justify-center text-cyan-300">
          <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
        </div>
        <div>
          <h4 class="font-display font-bold text-xl text-white">Datáfono / Pasarela TPV</h4>
          <p class="text-xs text-slate-400 mt-1 max-w-sm">Presente la tarjeta contactless o dispositivo móvil del cliente al datáfono para autorizar el cobro.</p>
        </div>
        <div class="p-3 rounded-xl bg-slate-900 border border-white/10 text-center w-full max-w-xs">
          <span class="text-xs text-slate-400 block">Importe a debitar:</span>
          <span id="card-pay-total" class="font-display font-black text-3xl text-cyan-400">0.00 €</span>
        </div>
      </div>

      <!-- Payment Modal Actions -->
      <div class="p-4 sm:p-5 bg-slate-900/90 border-t border-white/10 flex items-center justify-between gap-3">
        <button onclick="app.resetCashGiven()" class="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold touch-btn">
          Borrar Importe (C)
        </button>
        <button id="btn-complete-sale" onclick="app.finalizeSale()" class="flex-1 py-3 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-display font-black text-base shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 touch-btn">
          <span>CONFIRMAR Y ABRIR CAJÓN</span>
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
        </button>
      </div>

    </div>
  </div>

  <!-- MODAL: ADD PRODUCT -->
  <div id="modal-add-product" class="fixed inset-0 z-50 bg-black/80 backdrop-blur-md hidden flex items-center justify-center p-3 sm:p-4">
    <div class="glass-panel w-full max-w-lg rounded-3xl border border-white/15 shadow-2xl p-6 space-y-4">
      <div class="flex items-center justify-between border-b border-white/10 pb-3">
        <h3 class="font-display font-bold text-lg text-white">Añadir Suplemento al Catálogo</h3>
        <button onclick="app.closeNewProductModal()" class="text-slate-400 hover:text-white">✕</button>
      </div>

      <form onsubmit="app.saveNewProduct(event)" class="space-y-3 text-xs">
        <div>
          <label class="block text-slate-400 mb-1 font-semibold">Nombre del Suplemento</label>
          <input type="text" id="new-prod-name" required placeholder="Ej: Creatina Clonapure® 200 Mesh" class="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white focus:outline-none focus:border-cyan-400" />
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-slate-400 mb-1 font-semibold">Categoría</label>
            <select id="new-prod-cat" class="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white focus:outline-none focus:border-cyan-400">
              <option value="Creatinas">Creatinas</option>
              <option value="Proteínas">Proteínas</option>
              <option value="Pre-Entreno">Pre-Entreno</option>
              <option value="Aminoácidos">Aminoácidos</option>
              <option value="Salud">Salud & Vitaminas</option>
              <option value="Alimentación">Alimentación</option>
            </select>
          </div>
          <div>
            <label class="block text-slate-400 mb-1 font-semibold">Formato (Peso/Volumen)</label>
            <input type="text" id="new-prod-format" required placeholder="Ej: 500g, 250g, 2kg" class="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white focus:outline-none focus:border-cyan-400" />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-slate-400 mb-1 font-semibold">Sabor</label>
            <input type="text" id="new-prod-flavor" placeholder="Ej: Neutro, Chocolate Belga" value="Neutro" class="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white focus:outline-none focus:border-cyan-400" />
          </div>
          <div>
            <label class="block text-slate-400 mb-1 font-semibold">Stock Inicial</label>
            <input type="number" id="new-prod-stock" min="0" value="20" class="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white focus:outline-none focus:border-cyan-400" />
          </div>
        </div>

        <!-- Prices with 21% IVA calculation -->
        <div class="grid grid-cols-2 gap-3 p-3 bg-slate-900/60 rounded-xl border border-white/5">
          <div>
            <label class="block text-cyan-400 mb-1 font-bold">PVP Público (€ con IVA)</label>
            <input type="number" step="0.01" id="new-prod-pvp" required placeholder="36.90" class="w-full px-3 py-2 rounded-xl bg-slate-950 border border-cyan-500/40 text-cyan-300 font-bold focus:outline-none" />
          </div>
          <div>
            <label class="block text-emerald-400 mb-1 font-bold">Precio Pro Sin IVA (€)</label>
            <input type="number" step="0.01" id="new-prod-pro-sin-iva" oninput="app.calcProConIva(this.value)" required placeholder="22.00" class="w-full px-3 py-2 rounded-xl bg-slate-950 border border-emerald-500/40 text-emerald-300 font-bold focus:outline-none" />
            <span class="text-[10px] text-slate-400 mt-1 block">Con IVA 21%: <strong id="new-prod-pro-con-iva" class="text-emerald-300">26.62 €</strong></span>
          </div>
        </div>

        <div class="pt-2 flex justify-end gap-2">
          <button type="button" onclick="app.closeNewProductModal()" class="px-4 py-2 rounded-xl bg-slate-800 text-slate-300">Cancelar</button>
          <button type="submit" class="px-5 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/20">Guardar Producto</button>
        </div>
      </form>
    </div>
  </div>

  <!-- MODAL: ARQUEO DE CAJA Y CIERRE DE TURNO -->
  <div id="modal-arqueo" class="fixed inset-0 z-50 bg-black/80 backdrop-blur-md hidden flex items-center justify-center p-3 sm:p-4">
    <div class="glass-panel w-full max-w-2xl rounded-3xl border border-white/15 shadow-2xl p-6 space-y-4">
      <div class="flex items-center justify-between border-b border-white/10 pb-3">
        <div>
          <h3 class="font-display font-bold text-xl text-white">Arqueo y Cierre de Turno</h3>
          <span class="text-xs text-slate-400">Verificación física del dinero en el cajón portamonedas</span>
        </div>
        <button onclick="app.closeArqueoModal()" class="text-slate-400 hover:text-white">✕</button>
      </div>

      <div class="grid grid-cols-3 gap-3">
        <div class="p-3 rounded-xl bg-slate-900 border border-white/10 text-center">
          <span class="text-[11px] text-slate-400 uppercase font-semibold">Fondo Inicial</span>
          <span id="arqueo-float" class="font-mono-tabular font-bold text-lg text-slate-200 block mt-0.5">150.00 €</span>
        </div>
        <div class="p-3 rounded-xl bg-slate-900 border border-white/10 text-center">
          <span class="text-[11px] text-emerald-400 uppercase font-semibold">Efectivo Cobrado</span>
          <span id="arqueo-sales-cash" class="font-mono-tabular font-bold text-lg text-emerald-400 block mt-0.5">0.00 €</span>
        </div>
        <div class="p-3 rounded-xl bg-slate-900 border border-amber-500/40 text-center">
          <span class="text-[11px] text-amber-400 uppercase font-semibold">Efectivo Teórico</span>
          <span id="arqueo-total-theoretical" class="font-mono-tabular font-bold text-lg text-amber-300 block mt-0.5">150.00 €</span>
        </div>
      </div>

      <!-- Quick Drawer Counting -->
      <div class="bg-slate-900/60 p-4 rounded-2xl border border-white/5 space-y-3">
        <span class="text-xs uppercase font-bold text-slate-300 block">Conteo Físico Real en Cajón:</span>
        <div class="flex items-center gap-3">
          <input type="number" step="0.01" id="input-cash-counted" oninput="app.calculateArqueoDiff(this.value)" placeholder="Introducir total contado..." class="flex-1 px-4 py-2.5 bg-slate-950 border border-white/15 rounded-xl text-white font-bold text-lg focus:outline-none focus:border-cyan-400" />
          <button onclick="app.setArqueoExactMatch()" class="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 font-semibold">
            Copiar Teórico
          </button>
        </div>

        <div id="arqueo-diff-box" class="p-3 rounded-xl bg-slate-900 border border-emerald-500/30 flex items-center justify-between text-xs font-semibold">
          <span class="text-slate-300">Diferencia de Arqueo (Descuadre):</span>
          <span id="arqueo-diff-display" class="font-mono-tabular text-emerald-400 font-bold text-sm">0.00 € (Cuadrado)</span>
        </div>
      </div>

      <div class="pt-2 flex justify-end gap-2">
        <button onclick="app.closeArqueoModal()" class="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold">Cancelar</button>
        <button onclick="app.finalizeShiftClosure()" class="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-lg shadow-amber-500/20">
          Cerrar Turno & Guardar Informe
        </button>
      </div>
    </div>
  </div>

  <!-- MODAL: 80MM THERMAL RECEIPT (PRINTABLE) -->
  <div id="modal-receipt" class="fixed inset-0 z-50 bg-black/80 backdrop-blur-md hidden flex items-center justify-center p-3 sm:p-4">
    <div class="glass-panel w-full max-w-sm rounded-3xl border border-white/15 shadow-2xl p-6 flex flex-col items-center space-y-4">
      
      <!-- Receipt container for 80mm printer -->
      <div id="printable-receipt" class="w-full bg-white text-slate-900 p-4 rounded-xl font-mono text-xs leading-relaxed shadow-inner">
        <div class="text-center pb-2 border-b border-dashed border-slate-400">
          <div class="font-bold text-base tracking-widest">IO.GENIX NUTRITION</div>
          <div>DISTRIBUIDORA OFICIAL TPV</div>
          <div class="text-[10px] text-slate-600">CIF: B-87654321 · C/ Deporte 42</div>
        </div>

        <div class="py-2 border-b border-dashed border-slate-400 space-y-0.5 text-[11px]">
          <div class="flex justify-between"><span>Ticket:</span><strong id="rec-ticket-no">TK-202610-1001</strong></div>
          <div class="flex justify-between"><span>Fecha:</span><span id="rec-date">17/10/2026 18:30</span></div>
          <div class="flex justify-between"><span>Turno:</span><span id="rec-shift">Turno Mañana</span></div>
          <div class="flex justify-between"><span>Tarifa:</span><span id="rec-tarifa">PVP</span></div>
        </div>

        <div id="rec-items-list" class="py-2 border-b border-dashed border-slate-400 space-y-1">
          <!-- Items inserted here -->
        </div>

        <div class="py-2 border-b border-dashed border-slate-400 space-y-1 text-[11px]">
          <div class="flex justify-between"><span>Base Imponible:</span><span id="rec-subtotal">0.00 €</span></div>
          <div class="flex justify-between"><span>IVA (21%):</span><span id="rec-iva">0.00 €</span></div>
          <div class="flex justify-between text-sm font-black pt-1 border-t border-slate-300">
            <span>TOTAL:</span><span id="rec-total">0.00 €</span>
          </div>
        </div>

        <div class="py-2 border-b border-dashed border-slate-400 space-y-0.5 text-[11px]">
          <div class="flex justify-between"><span>Forma de Pago:</span><strong id="rec-payment-method">EFECTIVO</strong></div>
          <div id="rec-cash-details" class="space-y-0.5">
            <div class="flex justify-between"><span>Entregado:</span><span id="rec-given">0.00 €</span></div>
            <div class="flex justify-between"><span>Cambio:</span><span id="rec-change">0.00 €</span></div>
          </div>
        </div>

        <div class="pt-2 text-center text-[10px] text-slate-600">
          ¡GRACIAS POR TU CONFIANZA EN IO.GENIX!<br>
          Conserva este ticket para cualquier cambio o garantía.
        </div>
      </div>

      <!-- Action buttons -->
      <div class="w-full grid grid-cols-2 gap-2">
        <button onclick="window.print()" class="py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 touch-btn">
          <span>🖨️</span> Imprimir
        </button>
        <button onclick="app.closeReceiptModal()" class="py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold flex items-center justify-center gap-1.5 touch-btn">
          Nueva Venta
        </button>
      </div>

    </div>
  </div>

  <!-- JAVASCRIPT LOGIC & STATE ENGINE -->
  <script>
    // ==========================================
    // IO.GENIX POS APPLICATION ENGINE
    // ==========================================
    const app = {
      // Products catalog
      products: [],
      // Cart items: [{ product, quantity, selectedTarifa, customDiscountPercent }]
      cart: [],
      // Active Tarifa: 'pvp' | 'profesional' | 'descuento'
      currentTarifa: 'pvp',
      discountPercent: 10,
      activeCategory: 'Todos',
      activeShift: 'mañana',
      todayDate: '',
      sales: [],
      parkedTickets: [],
      // Cash payment interaction state
      cashGiven: 0,
      paymentMethod: 'efectivo',
      lastCompletedSale: null,

      init() {
        this.detectTodayDate();
        this.loadCatalog();
        this.loadSales();
        this.loadParkedTickets();
        this.renderCategoryTabs();
        this.renderProducts();
        this.updateShiftCounters();
        this.renderHistoryTable();
      },

      detectTodayDate() {
        const d = new Date();
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        this.todayDate = \`\${year}-\${month}-\${day}\`;
        
        const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        const formatted = \`\${dayNames[d.getDay()]}, \${d.getDate()} \${monthNames[d.getMonth()]} \${year}\`;
        
        const el = document.getElementById('header-date');
        if (el) el.innerText = formatted;

        // Auto shift by hour
        if (d.getHours() >= 15) {
          this.activeShift = 'tarde';
        } else {
          this.activeShift = 'mañana';
        }
        this.updateShiftButtons();
      },

      setShift(shift) {
        this.activeShift = shift;
        this.updateShiftButtons();
        this.updateShiftCounters();
        this.renderHistoryTable();
      },

      updateShiftButtons() {
        const btnM = document.getElementById('btn-shift-manana');
        const btnT = document.getElementById('btn-shift-tarde');
        const stripShift = document.getElementById('strip-active-shift');

        if (this.activeShift === 'mañana') {
          btnM.className = 'px-3 py-1.5 rounded-lg text-xs font-bold transition-all bg-amber-500 text-slate-950 shadow-sm flex items-center gap-1.5';
          btnT.className = 'px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white transition-all flex items-center gap-1.5';
          if (stripShift) stripShift.innerText = 'Turno Mañana (09:00 - 14:30)';
        } else {
          btnM.className = 'px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white transition-all flex items-center gap-1.5';
          btnT.className = 'px-3 py-1.5 rounded-lg text-xs font-bold transition-all bg-blue-500 text-slate-950 shadow-sm flex items-center gap-1.5';
          if (stripShift) stripShift.innerText = 'Turno Tarde (16:30 - 21:00)';
        }
      },

      loadCatalog() {
        const stored = localStorage.getItem('iogenix_standalone_products_v1');
        if (stored) {
          try {
            this.products = JSON.parse(stored);
          } catch(e) {
            console.error(e);
          }
        }
        if (!this.products || this.products.length === 0) {
          this.products = [
            {
              id: 'prod-1',
              name: 'Creatina Clonapure® 200 Mesh',
              category: 'Creatinas',
              format: '500g',
              flavor: 'Neutro',
              pvp: 36.90,
              precioProSinIva: 22.00,
              precioProConIva: 26.62,
              stock: 28,
              barcode: '8436578010012'
            },
            {
              id: 'prod-2',
              name: 'Creatina Clonapure® 200 Mesh',
              category: 'Creatinas',
              format: '250g',
              flavor: 'Neutro',
              pvp: 22.90,
              precioProSinIva: 13.50,
              precioProConIva: 16.34,
              stock: 19,
              barcode: '8436578010029'
            },
            {
              id: 'prod-3',
              name: 'Iso Whey Zero Professional CFM',
              category: 'Proteínas',
              format: '2kg',
              flavor: 'Chocolate Belga',
              pvp: 68.90,
              precioProSinIva: 42.00,
              precioProConIva: 50.82,
              stock: 14,
              barcode: '8436578010036'
            },
            {
              id: 'prod-4',
              name: 'Iso Whey Zero Professional CFM',
              category: 'Proteínas',
              format: '1kg',
              flavor: 'Vainilla Bourbon',
              pvp: 39.90,
              precioProSinIva: 24.50,
              precioProConIva: 29.65,
              stock: 22,
              barcode: '8436578010043'
            },
            {
              id: 'prod-5',
              name: 'Pre-Workout Thunder Shot Pro',
              category: 'Pre-Entreno',
              format: '300g',
              flavor: 'Frutos Rojos',
              pvp: 29.90,
              precioProSinIva: 17.50,
              precioProConIva: 21.18,
              stock: 16,
              barcode: '8436578010050'
            },
            {
              id: 'prod-6',
              name: 'BCAA 8:1:1 + Glutamina Kyowa®',
              category: 'Aminoácidos',
              format: '500g',
              flavor: 'Limón Cola',
              pvp: 32.50,
              precioProSinIva: 19.50,
              precioProConIva: 23.60,
              stock: 25,
              barcode: '8436578010067'
            },
            {
              id: 'prod-7',
              name: 'Harina de Avena Micronizada Gourmet',
              category: 'Alimentación',
              format: '1kg',
              flavor: 'Black Cookies',
              pvp: 6.90,
              precioProSinIva: 4.20,
              precioProConIva: 5.08,
              stock: 40,
              barcode: '8436578010074'
            },
            {
              id: 'prod-8',
              name: 'Sport Complex Multivitamin',
              category: 'Salud',
              format: '120 Cáps',
              flavor: 'Neutro',
              pvp: 18.90,
              precioProSinIva: 11.00,
              precioProConIva: 13.31,
              stock: 30,
              barcode: '8436578010081'
            }
          ];
          this.saveCatalog();
        }
      },

      saveCatalog() {
        localStorage.setItem('iogenix_standalone_products_v1', JSON.stringify(this.products));
      },

      loadSales() {
        const stored = localStorage.getItem('iogenix_standalone_sales_v1');
        if (stored) {
          try {
            this.sales = JSON.parse(stored);
          } catch(e) {
            console.error(e);
          }
        }
        if (!this.sales || this.sales.length === 0) {
          // Generate demo seed sales for prior days in month
          this.sales = this.generateSampleSales();
          this.saveSales();
        }
      },

      saveSales() {
        localStorage.setItem('iogenix_standalone_sales_v1', JSON.stringify(this.sales));
      },

      generateSampleSales() {
        const list = [];
        const [year, month, todayD] = this.todayDate.split('-').map(Number);
        let seq = 100;
        for (let d = 1; d < todayD; d++) {
          const dStr = String(d).padStart(2, '0');
          const mStr = String(month).padStart(2, '0');
          const dateStr = \`\${year}-\${mStr}-\${dStr}\`;
          
          // Morning
          list.push({
            id: 's-' + (++seq),
            ticketNumber: \`TK-\${year}\${mStr}-\${seq}\`,
            date: dateStr,
            shift: 'mañana',
            total: 89.70 + (d * 5 % 40),
            paymentMethod: d % 2 === 0 ? 'tarjeta' : 'efectivo',
            subtotalSinIva: 74.13,
            iva: 15.57
          });
          // Afternoon
          list.push({
            id: 's-' + (++seq),
            ticketNumber: \`TK-\${year}\${mStr}-\${seq}\`,
            date: dateStr,
            shift: 'tarde',
            total: 124.50 + (d * 7 % 60),
            paymentMethod: (d + 1) % 2 === 0 ? 'tarjeta' : 'efectivo',
            subtotalSinIva: 102.89,
            iva: 21.61
          });
        }
        return list;
      },

      loadParkedTickets() {
        const stored = localStorage.getItem('iogenix_standalone_parked_v1');
        if (stored) {
          try { this.parkedTickets = JSON.parse(stored); } catch(e){}
        }
        this.updateParkedBadge();
      },

      saveParkedTickets() {
        localStorage.setItem('iogenix_standalone_parked_v1', JSON.stringify(this.parkedTickets));
        this.updateParkedBadge();
      },

      updateParkedBadge() {
        const badge = document.getElementById('badge-parked-count');
        if (badge) {
          if (this.parkedTickets.length > 0) {
            badge.innerText = this.parkedTickets.length;
            badge.classList.remove('hidden');
          } else {
            badge.classList.add('hidden');
          }
        }
      },

      // TARIFF MANAGEMENT
      setTarifa(tarifa) {
        this.currentTarifa = tarifa;
        const btnP = document.getElementById('tarifa-btn-pvp');
        const btnPro = document.getElementById('tarifa-btn-pro');
        const btnD = document.getElementById('tarifa-btn-desc');
        const descControls = document.getElementById('discount-controls');

        btnP.className = 'px-4 py-2 rounded-lg text-xs font-medium text-slate-300 hover:text-white transition-all touch-btn';
        btnPro.className = 'px-4 py-2 rounded-lg text-xs font-medium text-slate-300 hover:text-white transition-all touch-btn flex items-center gap-1.5';
        btnD.className = 'px-4 py-2 rounded-lg text-xs font-medium text-slate-300 hover:text-white transition-all touch-btn';

        if (tarifa === 'pvp') {
          btnP.className = 'px-4 py-2 rounded-lg text-xs font-bold transition-all bg-cyan-500 text-slate-950 shadow-sm touch-btn';
          descControls.classList.add('hidden');
        } else if (tarifa === 'profesional') {
          btnPro.className = 'px-4 py-2 rounded-lg text-xs font-bold transition-all bg-emerald-500 text-slate-950 shadow-sm touch-btn flex items-center gap-1.5';
          descControls.classList.add('hidden');
        } else if (tarifa === 'descuento') {
          btnD.className = 'px-4 py-2 rounded-lg text-xs font-bold transition-all bg-amber-500 text-slate-950 shadow-sm touch-btn';
          descControls.classList.remove('hidden');
        }

        // Re-render catalog and cart prices
        this.renderProducts();
        this.updateCartUI();
      },

      setDiscountPercent(percent) {
        this.discountPercent = Math.max(0, Math.min(90, percent));
        const input = document.getElementById('input-discount-val');
        if (input) input.value = this.discountPercent;
        this.renderProducts();
        this.updateCartUI();
      },

      // CATEGORIES & SEARCH
      renderCategoryTabs() {
        const cats = ['Todos', 'Creatinas', 'Proteínas', 'Pre-Entreno', 'Aminoácidos', 'Salud', 'Alimentación'];
        const container = document.getElementById('category-tabs');
        if (!container) return;
        container.innerHTML = cats.map(cat => {
          const isActive = this.activeCategory === cat;
          return \`<button onclick="app.setCategory('\${cat}')" class="px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors touch-btn \${isActive ? 'bg-white text-slate-950 font-bold shadow-sm' : 'bg-slate-900/80 text-slate-400 hover:text-white border border-white/5'}">\${cat}</button>\`;
        }).join('');
      },

      setCategory(cat) {
        this.activeCategory = cat;
        this.renderCategoryTabs();
        this.renderProducts();
      },

      filterCatalog() {
        this.renderProducts();
      },

      // GET ACTIVE PRICE FOR PRODUCT
      getItemPrice(product) {
        if (this.currentTarifa === 'profesional') {
          return product.precioProConIva;
        } else if (this.currentTarifa === 'descuento') {
          return Number((product.pvp * (1 - this.discountPercent / 100)).toFixed(2));
        }
        return product.pvp;
      },

      // RENDER PRODUCTS GRID
      renderProducts() {
        const grid = document.getElementById('product-grid');
        if (!grid) return;

        const searchVal = (document.getElementById('catalog-search')?.value || '').toLowerCase().trim();
        const filtered = this.products.filter(p => {
          const matchCat = this.activeCategory === 'Todos' || p.category === this.activeCategory;
          const matchSearch = !searchVal || 
            p.name.toLowerCase().includes(searchVal) || 
            p.flavor.toLowerCase().includes(searchVal) || 
            p.barcode.includes(searchVal);
          return matchCat && matchSearch;
        });

        if (filtered.length === 0) {
          grid.innerHTML = \`<div class="col-span-full py-12 text-center text-slate-500 text-sm">No se encontraron productos con ese criterio.</div>\`;
          return;
        }

        grid.innerHTML = filtered.map(prod => {
          const effectivePrice = this.getItemPrice(prod);
          const isPro = this.currentTarifa === 'profesional';
          const isDesc = this.currentTarifa === 'descuento';

          return \`
            <div onclick="app.addToCart('\${prod.id}')" class="glass-card rounded-2xl p-3.5 flex flex-col justify-between hover:border-cyan-400/40 hover:bg-slate-850 transition-all cursor-pointer touch-btn group shadow-lg">
              
              <div>
                <div class="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                  <span class="font-medium text-slate-300">\${prod.format}</span>
                  <span class="text-slate-500">\${prod.flavor}</span>
                </div>

                <h3 class="font-display font-bold text-sm text-white group-hover:text-cyan-300 transition-colors line-clamp-2 leading-snug">
                  \${prod.name}
                </h3>
              </div>

              <div class="pt-3 border-t border-white/5 flex items-end justify-between mt-3">
                <div>
                  \${isDesc ? \`<div class="text-[10px] text-slate-500 line-through">\${prod.pvp.toFixed(2)} €</div>\` : ''}
                  <div class="font-display font-black text-lg text-white tabular-nums tracking-tight">
                    \${effectivePrice.toFixed(2)} €
                  </div>
                  \${isPro ? \`<span class="text-[9px] text-emerald-400 font-semibold uppercase">Base \${prod.precioProSinIva.toFixed(2)}€ + 21% IVA</span>\` : ''}
                </div>

                <div class="w-8 h-8 rounded-xl bg-cyan-500/10 group-hover:bg-cyan-500 text-cyan-300 group-hover:text-slate-950 flex items-center justify-center font-bold text-base transition-colors shadow">
                  +
                </div>
              </div>

            </div>
          \`;
        }).join('');
      },

      // CART ACTIONS
      addToCart(productId) {
        const prod = this.products.find(p => p.id === productId);
        if (!prod) return;

        const existing = this.cart.find(item => item.product.id === productId);
        if (existing) {
          existing.quantity++;
        } else {
          this.cart.push({
            product: prod,
            quantity: 1,
            selectedTarifa: this.currentTarifa,
            customDiscountPercent: this.discountPercent,
          });
        }
        this.updateCartUI();
      },

      changeQty(productId, delta) {
        const item = this.cart.find(i => i.product.id === productId);
        if (!item) return;
        item.quantity += delta;
        if (item.quantity <= 0) {
          this.cart = this.cart.filter(i => i.product.id !== productId);
        }
        this.updateCartUI();
      },

      removeFromCart(productId) {
        this.cart = this.cart.filter(i => i.product.id !== productId);
        this.updateCartUI();
      },

      clearCart() {
        if (this.cart.length === 0) return;
        this.cart = [];
        this.updateCartUI();
      },

      // RECALCULATE AND RENDER CART
      updateCartUI() {
        const list = document.getElementById('cart-items-list');
        const countBadge = document.getElementById('cart-item-count');
        const subtotalEl = document.getElementById('cart-subtotal');
        const ivaEl = document.getElementById('cart-iva');
        const totalEl = document.getElementById('cart-total-giant');
        const discountRow = document.getElementById('cart-discount-row');
        const discountValEl = document.getElementById('cart-discount-val');

        const totalItemsCount = this.cart.reduce((sum, i) => sum + i.quantity, 0);
        if (countBadge) countBadge.innerText = \`(\${totalItemsCount} productos)\`;

        if (this.cart.length === 0) {
          list.innerHTML = \`
            <div class="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500">
              <div class="w-16 h-16 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center mb-3 text-slate-600">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
              </div>
              <p class="font-display font-semibold text-slate-300 text-sm">El ticket está vacío</p>
              <p class="text-xs text-slate-500 mt-1">Toque productos en el catálogo para añadirlos a la venta.</p>
            </div>
          \`;
          if (subtotalEl) subtotalEl.innerText = '0.00 €';
          if (ivaEl) ivaEl.innerText = '0.00 €';
          if (totalEl) totalEl.innerText = '0.00 €';
          if (discountRow) discountRow.classList.add('hidden');
          return;
        }

        let totalGross = 0;
        let originalPvpTotal = 0;

        list.innerHTML = this.cart.map(item => {
          const unitPrice = this.getItemPrice(item.product);
          const lineTotal = unitPrice * item.quantity;
          totalGross += lineTotal;
          originalPvpTotal += item.product.pvp * item.quantity;

          return \`
            <div class="bg-slate-900/70 p-3 rounded-xl border border-white/5 flex items-center justify-between gap-3">
              <div class="flex-1 min-w-0">
                <div class="font-bold text-xs text-white truncate">\${item.product.name}</div>
                <div class="text-[11px] text-slate-400 mt-0.5">
                  \${item.product.format} · \${item.product.flavor} · <span class="text-cyan-300">\${unitPrice.toFixed(2)}€/ud</span>
                </div>
              </div>

              <!-- Quantity Controls -->
              <div class="flex items-center gap-1.5">
                <button onclick="app.changeQty('\${item.product.id}', -1)" class="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center font-bold text-sm touch-btn">
                  -
                </button>
                <span class="w-6 text-center font-mono-tabular font-bold text-xs text-white">\${item.quantity}</span>
                <button onclick="app.changeQty('\${item.product.id}', 1)" class="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center font-bold text-sm touch-btn">
                  +
                </button>
              </div>

              <!-- Line Total & Delete -->
              <div class="text-right">
                <div class="font-mono-tabular font-bold text-xs text-white">\${lineTotal.toFixed(2)} €</div>
                <button onclick="app.removeFromCart('\${item.product.id}')" class="text-[10px] text-rose-400/80 hover:text-rose-300">
                  Quitar
                </button>
              </div>
            </div>
          \`;
        }).join('');

        const subtotalSinIva = Number((totalGross / 1.21).toFixed(2));
        const iva = Number((totalGross - subtotalSinIva).toFixed(2));
        const discountDiff = Number((originalPvpTotal - totalGross).toFixed(2));

        if (subtotalEl) subtotalEl.innerText = subtotalSinIva.toFixed(2) + ' €';
        if (ivaEl) ivaEl.innerText = iva.toFixed(2) + ' €';
        if (totalEl) totalEl.innerText = totalGross.toFixed(2) + ' €';

        if (discountDiff > 0.05) {
          discountRow.classList.remove('hidden');
          discountValEl.innerText = '-' + discountDiff.toFixed(2) + ' €';
        } else {
          discountRow.classList.add('hidden');
        }
      },

      getCartTotal() {
        return this.cart.reduce((sum, item) => {
          return sum + (this.getItemPrice(item.product) * item.quantity);
        }, 0);
      },

      // PARK TICKET
      parkCurrentTicket() {
        if (this.cart.length === 0) return;
        this.parkedTickets.push({
          id: 'parked-' + Date.now(),
          timestamp: Date.now(),
          items: [...this.cart],
          tarifa: this.currentTarifa,
          discountPercent: this.discountPercent,
        });
        this.saveParkedTickets();
        this.cart = [];
        this.updateCartUI();
        alert('Ticket aparcado correctamente. Puede atender al siguiente cliente y recuperarlo cuando desee.');
      },

      openParkedModal() {
        if (this.parkedTickets.length === 0) {
          alert('No hay tickets aparcados en espera.');
          return;
        }
        const last = this.parkedTickets.pop();
        this.cart = last.items;
        this.setTarifa(last.tarifa);
        this.saveParkedTickets();
        this.updateCartUI();
      },

      // LUMIER PAYMENT MODAL
      openPaymentModal() {
        if (this.cart.length === 0) {
          alert('El carrito está vacío. Añade algún suplemento antes de cobrar.');
          return;
        }
        this.paymentMethod = 'efectivo';
        this.cashGiven = 0;
        this.updatePaymentModalUI();
        document.getElementById('modal-payment').classList.remove('hidden');
      },

      closePaymentModal() {
        document.getElementById('modal-payment').classList.add('hidden');
      },

      setPaymentMethod(method) {
        this.paymentMethod = method;
        const tabCash = document.getElementById('pay-tab-cash');
        const tabCard = document.getElementById('pay-tab-card');
        const cashContent = document.getElementById('pay-cash-content');
        const cardContent = document.getElementById('pay-card-content');
        const btnComplete = document.getElementById('btn-complete-sale');

        if (method === 'efectivo') {
          tabCash.className = 'flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 touch-btn';
          tabCard.className = 'flex-1 py-3 px-4 rounded-xl font-medium text-sm text-slate-400 hover:text-white bg-slate-800/80 transition-all flex items-center justify-center gap-2 touch-btn';
          cashContent.classList.remove('hidden');
          cardContent.classList.add('hidden');
          btnComplete.innerText = 'CONFIRMAR Y ABRIR CAJÓN';
        } else {
          tabCash.className = 'flex-1 py-3 px-4 rounded-xl font-medium text-sm text-slate-400 hover:text-white bg-slate-800/80 transition-all flex items-center justify-center gap-2 touch-btn';
          tabCard.className = 'flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20 flex items-center justify-center gap-2 touch-btn';
          cashContent.classList.add('hidden');
          cardContent.classList.remove('hidden');
          btnComplete.innerText = 'AUTORIZAR COBRO CON TARJETA';
        }
        this.updatePaymentModalUI();
      },

      addCash(amount) {
        this.cashGiven = Number((this.cashGiven + amount).toFixed(2));
        this.updatePaymentModalUI();
      },

      setExactCash() {
        this.cashGiven = Number(this.getCartTotal().toFixed(2));
        this.updatePaymentModalUI();
      },

      resetCashGiven() {
        this.cashGiven = 0;
        this.updatePaymentModalUI();
      },

      // LUMIER CHANGE BREAKDOWN CALCULATOR
      calculateLumierBreakdown(changeAmount) {
        if (changeAmount <= 0.005) return [];
        let remainingCents = Math.round(changeAmount * 100);
        const denominations = [
          { label: '50 €', value: 5000, type: 'bill', bg: 'bg-amber-950/80 border-amber-500/50 text-amber-300' },
          { label: '20 €', value: 2000, type: 'bill', bg: 'bg-blue-950/80 border-blue-500/50 text-blue-300' },
          { label: '10 €', value: 1000, type: 'bill', bg: 'bg-rose-950/80 border-rose-500/50 text-rose-300' },
          { label: '5 €', value: 500, type: 'bill', bg: 'bg-slate-800 border-slate-500/50 text-slate-300' },
          { label: '2 €', value: 200, type: 'coin', bg: 'bg-yellow-950/70 border-yellow-400/50 text-yellow-200' },
          { label: '1 €', value: 100, type: 'coin', bg: 'bg-slate-800 border-amber-400/50 text-slate-100' },
          { label: '0.50 €', value: 50, type: 'coin', bg: 'bg-amber-900/60 border-amber-500/50 text-amber-200' },
          { label: '0.20 €', value: 20, type: 'coin', bg: 'bg-amber-950/60 border-amber-600/40 text-amber-200' },
          { label: '0.10 €', value: 10, type: 'coin', bg: 'bg-amber-950/60 border-amber-700/40 text-amber-200' },
          { label: '0.05 €', value: 5, type: 'coin', bg: 'bg-amber-950/60 border-amber-800/40 text-amber-200' },
          { label: '0.02 €', value: 2, type: 'coin', bg: 'bg-stone-900 border-stone-600 text-stone-300' },
          { label: '0.01 €', value: 1, type: 'coin', bg: 'bg-stone-900 border-stone-600 text-stone-300' },
        ];

        const breakdown = [];
        for (const d of denominations) {
          if (remainingCents >= d.value) {
            const count = Math.floor(remainingCents / d.value);
            breakdown.push({ ...d, count });
            remainingCents = remainingCents % d.value;
          }
        }
        return breakdown;
      },

      updatePaymentModalUI() {
        const total = this.getCartTotal();
        document.getElementById('pay-total-display').innerText = total.toFixed(2) + ' €';
        document.getElementById('card-pay-total').innerText = total.toFixed(2) + ' €';
        document.getElementById('pay-given-display').innerText = this.cashGiven.toFixed(2);

        const change = this.cashGiven - total;
        const changeDisplay = document.getElementById('pay-change-display');
        const changeCard = document.getElementById('pay-change-card');
        const breakdownContainer = document.getElementById('breakdown-cards-container');
        const statusLabel = document.getElementById('breakdown-status-label');
        const btnComplete = document.getElementById('btn-complete-sale');

        // Cash drawer preview
        const shiftSalesCash = this.sales
          .filter(s => s.date === this.todayDate && s.shift === this.activeShift && s.paymentMethod === 'efectivo')
          .reduce((sum, s) => sum + s.total, 0);
        const drawerCashTotal = 150.00 + shiftSalesCash + (this.paymentMethod === 'efectivo' && this.cashGiven >= total ? total : 0);
        document.getElementById('cash-drawer-preview').innerText = drawerCashTotal.toFixed(2) + ' €';

        if (this.paymentMethod === 'tarjeta') {
          btnComplete.disabled = false;
          btnComplete.className = 'flex-1 py-3 px-6 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-display font-black text-base shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 touch-btn';
          return;
        }

        if (this.cashGiven < total) {
          const needed = (total - this.cashGiven).toFixed(2);
          changeDisplay.innerText = 'Faltan ' + needed + ' €';
          changeDisplay.className = 'font-display font-black text-xl sm:text-2xl text-amber-400 mt-1 block';
          changeCard.className = 'bg-slate-900/80 p-3.5 rounded-2xl border border-amber-500/40 text-center transition-colors';
          statusLabel.innerText = 'Importe insuficiente';
          breakdownContainer.innerHTML = \`<span class="text-xs text-slate-500 italic">Pulse los billetes o monedas arriba hasta cubrir el total.</span>\`;
          btnComplete.disabled = true;
          btnComplete.className = 'flex-1 py-3 px-6 rounded-xl bg-slate-800 text-slate-500 font-display font-black text-base cursor-not-allowed flex items-center justify-center gap-2';
        } else {
          changeDisplay.innerText = change.toFixed(2) + ' €';
          changeDisplay.className = 'font-display font-black text-2xl sm:text-3xl text-emerald-400 mt-1 block';
          changeCard.className = 'bg-slate-900/80 p-3.5 rounded-2xl border border-emerald-500/50 text-center transition-colors';
          btnComplete.disabled = false;
          btnComplete.className = 'flex-1 py-3 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-display font-black text-base shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 touch-btn';

          const breakdown = this.calculateLumierBreakdown(change);
          if (breakdown.length === 0) {
            statusLabel.innerText = 'Importe Exacto (Sin cambio)';
            breakdownContainer.innerHTML = \`<span class="text-xs text-emerald-400 font-bold">✓ Pago exacto, no hay que devolver cambio.</span>\`;
          } else {
            statusLabel.innerText = 'Entregar al cliente:';
            breakdownContainer.innerHTML = breakdown.map(item => \`
              <div class="px-3 py-1.5 rounded-xl border \${item.bg} flex items-center gap-2 shadow-sm font-bold text-xs">
                <span class="text-sm font-black">\${item.count} ×</span>
                <span>\${item.label}</span>
              </div>
            \`).join('');
          }
        }
      },

      // COMPLETE SALE
      finalizeSale() {
        const total = this.getCartTotal();
        if (this.paymentMethod === 'efectivo' && this.cashGiven < total) return;

        const subtotal = Number((total / 1.21).toFixed(2));
        const iva = Number((total - subtotal).toFixed(2));
        const change = this.paymentMethod === 'efectivo' ? Number((this.cashGiven - total).toFixed(2)) : 0;
        const now = new Date();
        const timeStr = now.toTimeString().split(' ')[0];
        const ticketSeq = this.sales.length + 1001;

        const record = {
          id: 'sale-' + Date.now(),
          ticketNumber: \`TK-\${this.todayDate.replace(/-/g, '')}-\${ticketSeq}\`,
          timestamp: Date.now(),
          date: this.todayDate,
          timeStr,
          shift: this.activeShift,
          items: [...this.cart],
          tarifa: this.currentTarifa,
          discountPercent: this.discountPercent,
          subtotalSinIva: subtotal,
          iva,
          total,
          paymentMethod: this.paymentMethod,
          cashGiven: this.paymentMethod === 'efectivo' ? this.cashGiven : undefined,
          cashChange: this.paymentMethod === 'efectivo' ? change : undefined,
        };

        this.sales.push(record);
        this.saveSales();

        // Decrement product stock
        this.cart.forEach(cartItem => {
          const p = this.products.find(x => x.id === cartItem.product.id);
          if (p && p.stock !== undefined) {
            p.stock = Math.max(0, p.stock - cartItem.quantity);
          }
        });
        this.saveCatalog();

        this.lastCompletedSale = record;
        this.cart = [];
        this.updateCartUI();
        this.closePaymentModal();
        this.updateShiftCounters();
        this.renderHistoryTable();
        this.openReceiptModal(record);
      },

      // RECEIPT MODAL
      openReceiptModal(record) {
        if (!record) return;
        document.getElementById('rec-ticket-no').innerText = record.ticketNumber;
        document.getElementById('rec-date').innerText = \`\${record.date} \${record.timeStr}\`;
        document.getElementById('rec-shift').innerText = record.shift === 'mañana' ? 'Turno Mañana' : 'Turno Tarde';
        document.getElementById('rec-tarifa').innerText = record.tarifa.toUpperCase();
        document.getElementById('rec-subtotal').innerText = record.subtotalSinIva.toFixed(2) + ' €';
        document.getElementById('rec-iva').innerText = record.iva.toFixed(2) + ' €';
        document.getElementById('rec-total').innerText = record.total.toFixed(2) + ' €';
        document.getElementById('rec-payment-method').innerText = record.paymentMethod.toUpperCase();

        const cashDetails = document.getElementById('rec-cash-details');
        if (record.paymentMethod === 'efectivo') {
          cashDetails.classList.remove('hidden');
          document.getElementById('rec-given').innerText = (record.cashGiven || record.total).toFixed(2) + ' €';
          document.getElementById('rec-change').innerText = (record.cashChange || 0).toFixed(2) + ' €';
        } else {
          cashDetails.classList.add('hidden');
        }

        const itemsContainer = document.getElementById('rec-items-list');
        itemsContainer.innerHTML = record.items.map(item => \`
          <div class="flex justify-between text-[11px]">
            <span>\${item.quantity}x \${item.product.name} (\${item.product.format})</span>
            <span>\${(this.getItemPrice(item.product) * item.quantity).toFixed(2)} €</span>
          </div>
        \`).join('');

        document.getElementById('modal-receipt').classList.remove('hidden');
      },

      closeReceiptModal() {
        document.getElementById('modal-receipt').classList.add('hidden');
      },

      // SHIFT & COUNTERS
      updateShiftCounters() {
        const todaySales = this.sales.filter(s => s.date === this.todayDate && s.shift === this.activeShift);
        const cardTotal = todaySales.filter(s => s.paymentMethod === 'tarjeta').reduce((sum, s) => sum + s.total, 0);
        const cashTotal = todaySales.filter(s => s.paymentMethod === 'efectivo').reduce((sum, s) => sum + s.total, 0);
        const drawerTotal = 150.00 + cashTotal;

        document.getElementById('strip-sales-count').innerText = todaySales.length;
        document.getElementById('strip-card-total').innerText = cardTotal.toFixed(2) + ' €';
        document.getElementById('strip-cash-total').innerText = cashTotal.toFixed(2) + ' €';
        document.getElementById('strip-drawer-total').innerText = drawerTotal.toFixed(2) + ' €';
      },

      // ARQUEO MODAL
      openArqueoModal() {
        const todaySales = this.sales.filter(s => s.date === this.todayDate && s.shift === this.activeShift);
        const cashTotal = todaySales.filter(s => s.paymentMethod === 'efectivo').reduce((sum, s) => sum + s.total, 0);
        const theoretical = 150.00 + cashTotal;

        document.getElementById('arqueo-float').innerText = '150.00 €';
        document.getElementById('arqueo-sales-cash').innerText = cashTotal.toFixed(2) + ' €';
        document.getElementById('arqueo-total-theoretical').innerText = theoretical.toFixed(2) + ' €';
        
        const input = document.getElementById('input-cash-counted');
        input.value = '';
        this.calculateArqueoDiff(0);

        document.getElementById('modal-arqueo').classList.remove('hidden');
      },

      closeArqueoModal() {
        document.getElementById('modal-arqueo').classList.add('hidden');
      },

      setArqueoExactMatch() {
        const todaySales = this.sales.filter(s => s.date === this.todayDate && s.shift === this.activeShift);
        const cashTotal = todaySales.filter(s => s.paymentMethod === 'efectivo').reduce((sum, s) => sum + s.total, 0);
        const theoretical = 150.00 + cashTotal;
        const input = document.getElementById('input-cash-counted');
        input.value = theoretical.toFixed(2);
        this.calculateArqueoDiff(theoretical);
      },

      calculateArqueoDiff(countedVal) {
        const counted = Number(countedVal) || 0;
        const todaySales = this.sales.filter(s => s.date === this.todayDate && s.shift === this.activeShift);
        const cashTotal = todaySales.filter(s => s.paymentMethod === 'efectivo').reduce((sum, s) => sum + s.total, 0);
        const theoretical = 150.00 + cashTotal;
        const diff = Number((counted - theoretical).toFixed(2));

        const display = document.getElementById('arqueo-diff-display');
        const box = document.getElementById('arqueo-diff-box');

        if (Math.abs(diff) <= 0.01) {
          display.innerText = '0.00 € (Cuadrado Perfecto)';
          display.className = 'font-mono-tabular text-emerald-400 font-bold text-sm';
          box.className = 'p-3 rounded-xl bg-slate-900 border border-emerald-500/40 flex items-center justify-between text-xs font-semibold';
        } else if (diff > 0) {
          display.innerText = '+' + diff.toFixed(2) + ' € (Sobrante en caja)';
          display.className = 'font-mono-tabular text-cyan-400 font-bold text-sm';
          box.className = 'p-3 rounded-xl bg-slate-900 border border-cyan-500/40 flex items-center justify-between text-xs font-semibold';
        } else {
          display.innerText = diff.toFixed(2) + ' € (Faltante en caja)';
          display.className = 'font-mono-tabular text-rose-400 font-bold text-sm';
          box.className = 'p-3 rounded-xl bg-slate-900 border border-rose-500/40 flex items-center justify-between text-xs font-semibold';
        }
      },

      finalizeShiftClosure() {
        alert('Turno cerrado y arqueo registrado correctamente. El resumen se ha consolidado en el Histórico Mensual.');
        this.closeArqueoModal();
        this.renderHistoryTable();
      },

      // NEW PRODUCT MODAL
      openNewProductModal() {
        document.getElementById('modal-add-product').classList.remove('hidden');
      },

      closeNewProductModal() {
        document.getElementById('modal-add-product').classList.add('hidden');
      },

      calcProConIva(sinIvaVal) {
        const val = Number(sinIvaVal) || 0;
        const conIva = Number((val * 1.21).toFixed(2));
        document.getElementById('new-prod-pro-con-iva').innerText = conIva.toFixed(2) + ' €';
      },

      saveNewProduct(e) {
        e.preventDefault();
        const name = document.getElementById('new-prod-name').value;
        const category = document.getElementById('new-prod-cat').value;
        const format = document.getElementById('new-prod-format').value;
        const flavor = document.getElementById('new-prod-flavor').value || 'Neutro';
        const stock = Number(document.getElementById('new-prod-stock').value) || 20;
        const pvp = Number(document.getElementById('new-prod-pvp').value) || 0;
        const precioProSinIva = Number(document.getElementById('new-prod-pro-sin-iva').value) || 0;
        const precioProConIva = Number((precioProSinIva * 1.21).toFixed(2));

        const newProd = {
          id: 'prod-' + Date.now(),
          name,
          category,
          format,
          flavor,
          stock,
          pvp,
          precioProSinIva,
          precioProConIva,
          barcode: '843' + Math.floor(1000000000 + Math.random() * 9000000000)
        };

        this.products.unshift(newProd);
        this.saveCatalog();
        this.renderProducts();
        this.closeNewProductModal();
        alert('Producto ' + name + ' añadido correctamente al catálogo.');
      },

      // HISTORICAL MONTHLY VIEW
      switchView(viewName) {
        const posView = document.getElementById('view-pos');
        const histView = document.getElementById('view-history');
        const btnPos = document.getElementById('nav-btn-pos');
        const btnHist = document.getElementById('nav-btn-history');

        if (viewName === 'pos') {
          posView.classList.remove('hidden');
          histView.classList.add('hidden');
          btnPos.className = 'px-4 py-2 rounded-lg text-sm font-semibold transition-all bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/25';
          btnHist.className = 'px-4 py-2 rounded-lg text-sm font-medium transition-all text-slate-300 hover:text-white hover:bg-white/5';
        } else {
          posView.classList.add('hidden');
          histView.classList.remove('hidden');
          btnPos.className = 'px-4 py-2 rounded-lg text-sm font-medium transition-all text-slate-300 hover:text-white hover:bg-white/5';
          btnHist.className = 'px-4 py-2 rounded-lg text-sm font-semibold transition-all bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/25';
          this.renderHistoryTable();
        }
      },

      renderHistoryTable() {
        const tbody = document.getElementById('history-table-body');
        if (!tbody) return;

        const [currYear, currMonth, todayDay] = this.todayDate.split('-').map(Number);
        const daysInMonth = new Date(currYear, currMonth, 0).getDate();
        const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

        let monthTotal = 0;
        let monthCardTotal = 0;
        let monthCashTotal = 0;
        let monthSalesCount = 0;

        let rowsHtml = '';

        for (let d = 1; d <= daysInMonth; d++) {
          const dStr = String(d).padStart(2, '0');
          const mStr = String(currMonth).padStart(2, '0');
          const dateStr = \`\${currYear}-\${mStr}-\${dStr}\`;
          const dateObj = new Date(currYear, currMonth - 1, d);
          const dayName = dayNames[dateObj.getDay()];

          const isPast = d < todayDay;
          const isToday = d === todayDay;

          // Day sales
          const daySales = this.sales.filter(s => s.date === dateStr);
          const morningSales = daySales.filter(s => s.shift === 'mañana');
          const afternoonSales = daySales.filter(s => s.shift === 'tarde');

          const mCard = morningSales.filter(s => s.paymentMethod === 'tarjeta').reduce((sum, s) => sum + s.total, 0);
          const mCash = morningSales.filter(s => s.paymentMethod === 'efectivo').reduce((sum, s) => sum + s.total, 0);
          const mTotal = mCard + mCash;

          const tCard = afternoonSales.filter(s => s.paymentMethod === 'tarjeta').reduce((sum, s) => sum + s.total, 0);
          const tCash = afternoonSales.filter(s => s.paymentMethod === 'efectivo').reduce((sum, s) => sum + s.total, 0);
          const tTotal = tCard + tCash;

          const dayTotal = mTotal + tTotal;

          monthTotal += dayTotal;
          monthCardTotal += (mCard + tCard);
          monthCashTotal += (mCash + tCash);
          monthSalesCount += daySales.length;

          const rowBg = isToday ? 'bg-cyan-500/10 font-bold border-l-2 border-cyan-400' : (isPast ? 'hover:bg-slate-900/60' : 'opacity-40');

          rowsHtml += \`
            <tr class="\${rowBg} transition-colors">
              <td class="py-3 px-4 whitespace-nowrap">
                <span class="font-bold \${isToday ? 'text-cyan-300' : 'text-white'}">\${dStr} \${dayName}</span>
                \${isToday ? '<span class="ml-2 px-1.5 py-0.5 rounded text-[10px] bg-cyan-400 text-slate-950 font-bold">HOY</span>' : ''}
              </td>

              <!-- Morning shift -->
              <td class="py-3 px-4 text-center">
                <div class="font-mono-tabular font-bold text-amber-300">\${mTotal.toFixed(2)} €</div>
                <div class="text-[10px] text-slate-400">\${morningSales.length} vtas (💳 \${mCard.toFixed(0)}€ · 💵 \${mCash.toFixed(0)}€)</div>
              </td>

              <!-- Afternoon shift -->
              <td class="py-3 px-4 text-center">
                <div class="font-mono-tabular font-bold text-blue-300">\${tTotal.toFixed(2)} €</div>
                <div class="text-[10px] text-slate-400">\${afternoonSales.length} vtas (💳 \${tCard.toFixed(0)}€ · 💵 \${tCash.toFixed(0)}€)</div>
              </td>

              <!-- Day Total -->
              <td class="py-3 px-4 text-right font-display font-black text-sm text-white tabular-nums">
                \${dayTotal.toFixed(2)} €
              </td>

              <!-- Status -->
              <td class="py-3 px-4 text-center">
                \${isPast ? \`
                  <span class="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-white/5">
                    <span>🔒</span> Cerrado
                  </span>
                \` : isToday ? \`
                  <span class="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                    <span>⚡</span> En Curso
                  </span>
                \` : \`
                  <span class="text-[10px] text-slate-600">Pendiente</span>
                \`}
              </td>
            </tr>
          \`;
        }

        tbody.innerHTML = rowsHtml;

        // Update KPI summaries
        document.getElementById('kpi-month-total').innerText = monthTotal.toFixed(2) + ' €';
        document.getElementById('kpi-month-card').innerText = monthCardTotal.toFixed(2) + ' €';
        document.getElementById('kpi-month-cash').innerText = monthCashTotal.toFixed(2) + ' €';
        const avg = monthSalesCount > 0 ? (monthTotal / monthSalesCount).toFixed(2) : '0.00';
        document.getElementById('kpi-month-tickets').innerText = \`\${monthSalesCount} / \${avg}€\`;
      },

      exportHistoryCsv() {
        const rows = [
          ['Fecha', 'Turno Mañana Ventas', 'Turno Mañana Total', 'Turno Tarde Ventas', 'Turno Tarde Total', 'Total Día']
        ];
        const [currYear, currMonth] = this.todayDate.split('-').map(Number);
        const daysInMonth = new Date(currYear, currMonth, 0).getDate();

        for (let d = 1; d <= daysInMonth; d++) {
          const dStr = String(d).padStart(2, '0');
          const mStr = String(currMonth).padStart(2, '0');
          const dateStr = \`\${currYear}-\${mStr}-\${dStr}\`;
          const daySales = this.sales.filter(s => s.date === dateStr);
          const mSales = daySales.filter(s => s.shift === 'mañana');
          const tSales = daySales.filter(s => s.shift === 'tarde');
          const mTotal = mSales.reduce((sum, s) => sum + s.total, 0);
          const tTotal = tSales.reduce((sum, s) => sum + s.total, 0);
          rows.push([dateStr, mSales.length, mTotal.toFixed(2), tSales.length, tTotal.toFixed(2), (mTotal + tTotal).toFixed(2)]);
        }

        const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(e => e.join(';')).join('\\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', \`historico_iogenix_\${currYear}_\${currMonth}.csv\`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    };

    // Initialize on page load
    window.addEventListener('DOMContentLoaded', () => {
      app.init();
    });
  </script>

</body>
</html>`;
}
