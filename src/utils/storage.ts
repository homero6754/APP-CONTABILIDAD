import { Product, SaleRecord, ShiftState, ParkedTicket, ShiftType } from '../types';
import { INITIAL_PRODUCTS, generateSeedSales } from '../data/initialCatalog';

const STORAGE_KEYS = {
  PRODUCTS: 'iogenix_tpv_products_v1',
  SALES: 'iogenix_tpv_sales_v1',
  SHIFT: 'iogenix_tpv_shift_v1',
  PARKED: 'iogenix_tpv_parked_v1',
  INITIAL_FLOAT: 'iogenix_tpv_initial_float_v1',
};

// Return today's ISO date string (YYYY-MM-DD)
export function getTodayDateString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Return human friendly Spanish formatted date
export function formatSpanishDate(dateStr: string): string {
  try {
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const monthNames = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return `${dayNames[date.getDay()]}, ${day} de ${monthNames[date.getMonth()]} de ${year}`;
  } catch {
    return dateStr;
  }
}

// Load products
export function loadStoredProducts(): Product[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Error loading products from localStorage', e);
  }
  // Fallback to initial
  saveStoredProducts(INITIAL_PRODUCTS);
  return INITIAL_PRODUCTS;
}

export function saveStoredProducts(products: Product[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  } catch (e) {
    console.error('Error saving products to localStorage', e);
  }
}

// Load sales
export function loadStoredSales(): SaleRecord[] {
  const today = getTodayDateString();
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SALES);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Error loading sales from localStorage', e);
  }
  // Generate realistic seed sales for current month if empty
  const seeds = generateSeedSales(today);
  saveStoredSales(seeds);
  return seeds;
}

export function saveStoredSales(sales: SaleRecord[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(sales));
  } catch (e) {
    console.error('Error saving sales to localStorage', e);
  }
}

// Load current shift state
export function loadShiftState(): ShiftState {
  const today = getTodayDateString();
  // Default shift based on time of day (morning before 15:00, afternoon after 15:00)
  const currentHour = new Date().getHours();
  const defaultShift: ShiftType = currentHour < 15 ? 'mañana' : 'tarde';

  try {
    const data = localStorage.getItem(STORAGE_KEYS.SHIFT);
    if (data) {
      const parsed = JSON.parse(data);
      if (parsed.date === today) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Error loading shift state', e);
  }

  const newState: ShiftState = {
    date: today,
    shift: defaultShift,
    initialCashFloat: 150.00, // 150€ default cash drawer base
    isClosed: false,
  };
  saveShiftState(newState);
  return newState;
}

export function saveShiftState(shift: ShiftState): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SHIFT, JSON.stringify(shift));
  } catch (e) {
    console.error('Error saving shift state', e);
  }
}

// Load parked tickets
export function loadParkedTickets(): ParkedTicket[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PARKED);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.warn('Error loading parked tickets', e);
  }
  return [];
}

export function saveParkedTickets(tickets: ParkedTicket[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PARKED, JSON.stringify(tickets));
  } catch (e) {
    console.error('Error saving parked tickets', e);
  }
}
