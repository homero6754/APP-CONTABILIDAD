import React, { useState } from 'react';
import { SaleRecord } from '../types';
import { Lock, FileSpreadsheet, Calendar, Sparkles } from 'lucide-react';

interface MonthlyHistoryViewProps {
  sales: SaleRecord[];
  todayDateStr: string;
}

export const MonthlyHistoryView: React.FC<MonthlyHistoryViewProps> = ({
  sales,
  todayDateStr,
}) => {
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const [year, month] = todayDateStr.split('-');
    return `${year}-${month}`;
  });

  const [yearStr, monthStr] = selectedMonth.split('-');
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);
  const todayDay = parseInt(todayDateStr.split('-')[2], 10);
  const isCurrentMonth = todayDateStr.startsWith(selectedMonth);

  const daysInMonth = new Date(year, month, 0).getDate();
  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  // Aggregate monthly stats
  interface MonthRowData {
    dayNumber: number;
    dStr: string;
    dayName: string;
    dateStr: string;
    morningSalesCount: number;
    mCard: number;
    mCash: number;
    mTotal: number;
    afternoonSalesCount: number;
    tCard: number;
    tCash: number;
    tTotal: number;
    dayTotal: number;
    isPast: boolean;
    isToday: boolean;
    isFuture: boolean;
  }

  let monthTotal = 0;
  let monthCardTotal = 0;
  let monthCashTotal = 0;
  let monthSalesCount = 0;

  const monthRows: MonthRowData[] = [];

  for (let d = 1; d <= daysInMonth; d++) {
    const dStr = d < 10 ? `0${d}` : `${d}`;
    const mStr = month < 10 ? `0${month}` : `${month}`;
    const dateStr = `${year}-${mStr}-${dStr}`;
    const dateObj = new Date(year, month - 1, d);
    const dayName = dayNames[dateObj.getDay()];

    const isPast = isCurrentMonth ? d < todayDay : year < parseInt(todayDateStr.split('-')[0], 10) || month < parseInt(todayDateStr.split('-')[1], 10);
    const isToday = isCurrentMonth && d === todayDay;
    const isFuture = isCurrentMonth && d > todayDay;

    const daySales = sales.filter((s) => s.date === dateStr);
    const morningSales = daySales.filter((s) => s.shift === 'mañana');
    const afternoonSales = daySales.filter((s) => s.shift === 'tarde');

    const mCard = morningSales.filter((s) => s.paymentMethod === 'tarjeta').reduce((sum, s) => sum + s.total, 0);
    const mCash = morningSales.filter((s) => s.paymentMethod === 'efectivo').reduce((sum, s) => sum + s.total, 0);
    const mTotal = mCard + mCash;

    const tCard = afternoonSales.filter((s) => s.paymentMethod === 'tarjeta').reduce((sum, s) => sum + s.total, 0);
    const tCash = afternoonSales.filter((s) => s.paymentMethod === 'efectivo').reduce((sum, s) => sum + s.total, 0);
    const tTotal = tCard + tCash;

    const dayTotal = mTotal + tTotal;

    monthTotal += dayTotal;
    monthCardTotal += (mCard + tCard);
    monthCashTotal += (mCash + tCash);
    monthSalesCount += daySales.length;

    monthRows.push({
      dayNumber: d,
      dStr,
      dayName,
      dateStr,
      morningSalesCount: morningSales.length,
      mCard,
      mCash,
      mTotal,
      afternoonSalesCount: afternoonSales.length,
      tCard,
      tCash,
      tTotal,
      dayTotal,
      isPast,
      isToday,
      isFuture,
    });
  }

  const averageTicket = monthSalesCount > 0 ? (monthTotal / monthSalesCount).toFixed(2) : '0.00';

  const handleExportCsv = () => {
    const headers = [
      'Fecha',
      'Dia Semana',
      'Turno Manana Ventas',
      'Turno Manana Tarjeta (EUR)',
      'Turno Manana Efectivo (EUR)',
      'Turno Manana Total (EUR)',
      'Turno Tarde Ventas',
      'Turno Tarde Tarjeta (EUR)',
      'Turno Tarde Efectivo (EUR)',
      'Turno Tarde Total (EUR)',
      'Total Diario (EUR)',
      'Estado',
    ];

    const csvRows = [headers.join(';')];

    monthRows.forEach((r) => {
      const status = r.isPast ? 'Cerrado (Solo Lectura)' : r.isToday ? 'En Curso' : 'Pendiente';
      csvRows.push([
        r.dateStr,
        r.dayName,
        r.morningSalesCount,
        r.mCard.toFixed(2),
        r.mCash.toFixed(2),
        r.mTotal.toFixed(2),
        r.afternoonSalesCount,
        r.tCard.toFixed(2),
        r.tCash.toFixed(2),
        r.tTotal.toFixed(2),
        r.dayTotal.toFixed(2),
        status,
      ].join(';'));
    });

    const blob = new Blob(['\uFEFF' + csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `historico_iogenix_${year}_${monthStr}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      
      {/* Month KPI Header Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        <div className="glass-panel p-4 rounded-3xl border border-white/10 shadow-lg">
          <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold block">
            Facturación Mes
          </span>
          <div className="font-display font-black text-2xl sm:text-3xl text-white mt-1 tabular-nums">
            {monthTotal.toFixed(2)} €
          </div>
          <span className="text-[11px] text-cyan-400 font-medium mt-1 block">
            {monthNames[month - 1]} {year}
          </span>
        </div>

        <div className="glass-panel p-4 rounded-3xl border border-white/10 shadow-lg">
          <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold block">
            Total TPV (Tarjeta)
          </span>
          <div className="font-display font-black text-2xl sm:text-3xl text-cyan-300 mt-1 tabular-nums">
            {monthCardTotal.toFixed(2)} €
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Cobros con datáfono
          </span>
        </div>

        <div className="glass-panel p-4 rounded-3xl border border-white/10 shadow-lg">
          <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold block">
            Total Efectivo en Caja
          </span>
          <div className="font-display font-black text-2xl sm:text-3xl text-emerald-400 mt-1 tabular-nums">
            {monthCashTotal.toFixed(2)} €
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Recaudación física
          </span>
        </div>

        <div className="glass-panel p-4 rounded-3xl border border-white/10 shadow-lg">
          <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold block">
            Ventas / Ticket Medio
          </span>
          <div className="font-display font-black text-2xl sm:text-3xl text-amber-300 mt-1 tabular-nums">
            {monthSalesCount} <span className="text-lg font-bold text-slate-400">/ {averageTicket}€</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Promedio ticket mensual
          </span>
        </div>

      </div>

      {/* Filter and Export Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-black text-2xl text-white flex items-center gap-2">
            <span>Histórico Mensual de Ventas y Arqueos</span>
            <span className="text-xs uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/25 font-bold">
              Auditoría
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Los días pasados se encuentran bloqueados en modo solo lectura para garantizar la integridad contable.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-900 border border-white/10 px-3 py-1.5 rounded-xl">
            <Calendar className="w-4 h-4 text-cyan-400" />
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-transparent text-xs text-white font-semibold focus:outline-none"
            />
          </div>

          <button
            onClick={handleExportCsv}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-white/10 hover:border-emerald-400/40 text-xs font-bold flex items-center gap-2 touch-active transition-colors shadow-md"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Exportar CSV</span>
          </button>
        </div>
      </div>

      {/* Main Table */}
      <div className="glass-panel rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            
            <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider text-[11px] border-b border-white/10">
              <tr>
                <th className="py-3.5 px-4 font-bold">Día / Fecha</th>
                <th className="py-3.5 px-4 font-bold text-center bg-amber-500/5 border-l border-white/5">
                  Turno Mañana (Vtas · 💳 TPV · 💵 Efectivo)
                </th>
                <th className="py-3.5 px-4 font-bold text-center bg-blue-500/5 border-l border-white/5">
                  Turno Tarde (Vtas · 💳 TPV · 💵 Efectivo)
                </th>
                <th className="py-3.5 px-4 font-bold text-right border-l border-white/5">
                  Total Diario
                </th>
                <th className="py-3.5 px-4 font-bold text-center border-l border-white/5">
                  Estado
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/5">
              {monthRows.map((row) => {
                const rowClasses = row.isToday
                  ? 'bg-cyan-500/10 font-bold border-l-4 border-l-cyan-400'
                  : row.isPast
                  ? 'hover:bg-slate-900/50'
                  : 'opacity-40';

                return (
                  <tr key={row.dateStr} className={`${rowClasses} transition-colors`}>
                    
                    {/* Day / Date */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className={`font-display font-bold text-sm ${row.isToday ? 'text-cyan-300' : 'text-white'}`}>
                          {row.dStr} {row.dayName}
                        </span>
                        {row.isToday && (
                          <span className="px-2 py-0.5 rounded text-[10px] bg-cyan-400 text-slate-950 font-black">
                            HOY
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono-tabular">
                        {row.dateStr}
                      </span>
                    </td>

                    {/* Morning Shift */}
                    <td className="py-3 px-4 text-center border-l border-white/5 bg-amber-500/[0.02]">
                      <div className="font-mono-tabular font-bold text-sm text-amber-300">
                        {row.mTotal.toFixed(2)} €
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {row.morningSalesCount} vtas (💳 {row.mCard.toFixed(0)}€ · 💵 {row.mCash.toFixed(0)}€)
                      </div>
                    </td>

                    {/* Afternoon Shift */}
                    <td className="py-3 px-4 text-center border-l border-white/5 bg-blue-500/[0.02]">
                      <div className="font-mono-tabular font-bold text-sm text-blue-300">
                        {row.tTotal.toFixed(2)} €
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {row.afternoonSalesCount} vtas (💳 {row.tCard.toFixed(0)}€ · 💵 {row.tCash.toFixed(0)}€)
                      </div>
                    </td>

                    {/* Day Total */}
                    <td className="py-3 px-4 text-right border-l border-white/5 font-display font-black text-sm sm:text-base text-white tabular-nums">
                      {row.dayTotal.toFixed(2)} €
                    </td>

                    {/* Status Indicator */}
                    <td className="py-3 px-4 text-center border-l border-white/5 whitespace-nowrap">
                      {row.isPast ? (
                        <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-1 rounded-xl bg-slate-800/80 text-slate-400 border border-white/10" title="Día pasado cerrado. Solo lectura">
                          <Lock className="w-3 h-3 text-slate-400" />
                          <span>Cerrado</span>
                        </span>
                      ) : row.isToday ? (
                        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                          <Sparkles className="w-3 h-3 text-cyan-400" />
                          <span>En Curso</span>
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-600 font-medium">
                          Pendiente
                        </span>
                      )}
                    </td>

                  </tr>
                );
              })}
            </tbody>

          </table>
        </div>
      </div>

    </div>
  );
};
