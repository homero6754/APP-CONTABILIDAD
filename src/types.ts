export type TarifaType = 'pvp' | 'profesional' | 'descuento';
export type ShiftType = 'mañana' | 'tarde';
export type PaymentMethod = 'efectivo' | 'tarjeta';

export interface Product {
  id: string;
  name: string;
  category: 'Proteínas' | 'Creatinas' | 'Pre-Entreno' | 'Aminoácidos' | 'Salud' | 'Alimentación';
  format: string;
  flavor: string;
  pvp: number;
  precioProSinIva: number;
  precioProConIva: number;
  stock: number;
  image: string;
  barcode: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedTarifa: TarifaType;
  customDiscountPercent: number;
}

export interface CashDenominationBreakdown {
  [denomination: string]: number;
}

export interface SaleRecord {
  id: string;
  ticketNumber: string;
  timestamp: number;
  date: string; // YYYY-MM-DD
  timeStr: string; // HH:mm:ss
  shift: ShiftType;
  items: CartItem[];
  tarifa: TarifaType;
  discountPercent: number;
  subtotalSinIva: number;
  iva: number;
  total: number;
  paymentMethod: PaymentMethod;
  cashGiven?: number;
  cashChange?: number;
  cashBreakdown?: CashDenominationBreakdown;
}

export interface ShiftState {
  date: string;
  shift: ShiftType;
  initialCashFloat: number; // Fondo de caja inicial (ej: 150.00€)
  isClosed: boolean;
  closedAt?: number;
  closedCashCounted?: number;
  notes?: string;
}

export interface ParkedTicket {
  id: string;
  timestamp: number;
  customerNote: string;
  items: CartItem[];
  tarifa: TarifaType;
  discountPercent: number;
}

export interface DayShiftData {
  salesCount: number;
  cashTotal: number;
  cardTotal: number;
  total: number;
  isClosed: boolean;
}

export interface DaySummary {
  date: string; // YYYY-MM-DD
  dayNumber: number;
  dayName: string;
  morning: DayShiftData;
  afternoon: DayShiftData;
  dayTotal: number;
  isPast: boolean;
  isToday: boolean;
  isFuture: boolean;
}
