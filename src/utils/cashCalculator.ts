export interface DenominationItem {
  id: string;
  value: number; // in euros
  label: string;
  type: 'bill' | 'coin';
  colorBg: string;
  colorBorder: string;
  colorText: string;
}

export const DENOMINATIONS: DenominationItem[] = [
  // Billetes
  { id: 'bill-100', value: 100, label: '100 €', type: 'bill', colorBg: 'bg-emerald-950/80', colorBorder: 'border-emerald-500/40', colorText: 'text-emerald-300' },
  { id: 'bill-50', value: 50, label: '50 €', type: 'bill', colorBg: 'bg-amber-950/80', colorBorder: 'border-amber-500/40', colorText: 'text-amber-300' },
  { id: 'bill-20', value: 20, label: '20 €', type: 'bill', colorBg: 'bg-blue-950/80', colorBorder: 'border-blue-500/40', colorText: 'text-blue-300' },
  { id: 'bill-10', value: 10, label: '10 €', type: 'bill', colorBg: 'bg-rose-950/80', colorBorder: 'border-rose-500/40', colorText: 'text-rose-300' },
  { id: 'bill-5', value: 5, label: '5 €', type: 'bill', colorBg: 'bg-slate-800/90', colorBorder: 'border-slate-500/40', colorText: 'text-slate-300' },
  // Monedas
  { id: 'coin-2', value: 2, label: '2 €', type: 'coin', colorBg: 'bg-yellow-950/70', colorBorder: 'border-yellow-400/50', colorText: 'text-yellow-200' },
  { id: 'coin-1', value: 1, label: '1 €', type: 'coin', colorBg: 'bg-slate-800/80', colorBorder: 'border-amber-400/40', colorText: 'text-slate-200' },
  { id: 'coin-050', value: 0.50, label: '0.50 €', type: 'coin', colorBg: 'bg-amber-900/60', colorBorder: 'border-amber-500/40', colorText: 'text-amber-200' },
  { id: 'coin-020', value: 0.20, label: '0.20 €', type: 'coin', colorBg: 'bg-amber-950/60', colorBorder: 'border-amber-600/40', colorText: 'text-amber-200' },
  { id: 'coin-010', value: 0.10, label: '0.10 €', type: 'coin', colorBg: 'bg-amber-950/60', colorBorder: 'border-amber-700/40', colorText: 'text-amber-200' },
];

export interface ChangeBreakdownResult {
  denomination: DenominationItem;
  count: number;
}

export function calculateChangeBreakdown(changeAmount: number): ChangeBreakdownResult[] {
  if (changeAmount <= 0.005) return [];

  // Convert to cents to avoid floating point precision issues
  let remainingCents = Math.round(changeAmount * 100);
  const results: ChangeBreakdownResult[] = [];

  const breakdownDenominations = [
    { id: 'bill-100', value: 100, label: '100 €', type: 'bill' as const, colorBg: 'bg-emerald-950/80', colorBorder: 'border-emerald-500/40', colorText: 'text-emerald-300' },
    { id: 'bill-50', value: 50, label: '50 €', type: 'bill' as const, colorBg: 'bg-amber-950/80', colorBorder: 'border-amber-500/40', colorText: 'text-amber-300' },
    { id: 'bill-20', value: 20, label: '20 €', type: 'bill' as const, colorBg: 'bg-blue-950/80', colorBorder: 'border-blue-500/40', colorText: 'text-blue-300' },
    { id: 'bill-10', value: 10, label: '10 €', type: 'bill' as const, colorBg: 'bg-rose-950/80', colorBorder: 'border-rose-500/40', colorText: 'text-rose-300' },
    { id: 'bill-5', value: 5, label: '5 €', type: 'bill' as const, colorBg: 'bg-slate-800/90', colorBorder: 'border-slate-500/40', colorText: 'text-slate-300' },
    { id: 'coin-2', value: 2, label: '2 €', type: 'coin' as const, colorBg: 'bg-yellow-950/70', colorBorder: 'border-yellow-400/50', colorText: 'text-yellow-200' },
    { id: 'coin-1', value: 1, label: '1 €', type: 'coin' as const, colorBg: 'bg-slate-800/80', colorBorder: 'border-amber-400/40', colorText: 'text-slate-200' },
    { id: 'coin-050', value: 0.50, label: '0.50 €', type: 'coin' as const, colorBg: 'bg-amber-900/60', colorBorder: 'border-amber-500/40', colorText: 'text-amber-200' },
    { id: 'coin-020', value: 0.20, label: '0.20 €', type: 'coin' as const, colorBg: 'bg-amber-950/60', colorBorder: 'border-amber-600/40', colorText: 'text-amber-200' },
    { id: 'coin-010', value: 0.10, label: '0.10 €', type: 'coin' as const, colorBg: 'bg-amber-950/60', colorBorder: 'border-amber-700/40', colorText: 'text-amber-200' },
    { id: 'coin-005', value: 0.05, label: '0.05 €', type: 'coin' as const, colorBg: 'bg-amber-950/60', colorBorder: 'border-amber-800/40', colorText: 'text-amber-300' },
    { id: 'coin-002', value: 0.02, label: '0.02 €', type: 'coin' as const, colorBg: 'bg-stone-900/60', colorBorder: 'border-amber-900/40', colorText: 'text-stone-300' },
    { id: 'coin-001', value: 0.01, label: '0.01 €', type: 'coin' as const, colorBg: 'bg-stone-900/60', colorBorder: 'border-amber-900/40', colorText: 'text-stone-300' },
  ];

  for (const item of breakdownDenominations) {
    const itemCents = Math.round(item.value * 100);
    if (remainingCents >= itemCents) {
      const count = Math.floor(remainingCents / itemCents);
      results.push({
        denomination: item,
        count,
      });
      remainingCents = remainingCents % itemCents;
    }
  }

  return results;
}

// Audio Feedback helper using Web Audio API (no external files)
export function playChimeSound(type: 'success' | 'click' | 'openDrawer' = 'success') {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    if (type === 'success') {
      // Pleasant double bell chime
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'triangle';
      osc1.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc1.frequency.exponentialRampToValueAtTime(1046.5, ctx.currentTime + 0.15); // C6
      osc2.frequency.setValueAtTime(659.25, ctx.currentTime + 0.05); // E5

      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start();
      osc2.start(ctx.currentTime + 0.05);
      osc1.stop(ctx.currentTime + 0.4);
      osc2.stop(ctx.currentTime + 0.4);
    } else if (type === 'click') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.06);
    } else if (type === 'openDrawer') {
      // Cash register ding-kachink simulation
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1200, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1500, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    }
  } catch (e) {
    // Graceful fallback if audio is muted or blocked
    console.debug('Audio play not allowed or unsupported', e);
  }
}
