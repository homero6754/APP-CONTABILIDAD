import { Product, SaleRecord } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-clonapure-500',
    name: 'Creatina Clonapure® 200 Mesh',
    category: 'Creatinas',
    format: '500g',
    flavor: 'Neutro',
    pvp: 36.90,
    precioProSinIva: 22.00,
    precioProConIva: 26.62,
    stock: 28,
    image: '/src/assets/images/iogenix_creatine_clonapure_1792288218078.jpg',
    barcode: '8436578010012',
  },
  {
    id: 'prod-clonapure-250',
    name: 'Creatina Clonapure® 200 Mesh',
    category: 'Creatinas',
    format: '250g',
    flavor: 'Neutro',
    pvp: 22.90,
    precioProSinIva: 13.50,
    precioProConIva: 16.34,
    stock: 19,
    image: '/src/assets/images/iogenix_creatine_clonapure_1792288218078.jpg',
    barcode: '8436578010029',
  },
  {
    id: 'prod-isowhey-2kg',
    name: 'Iso Whey Zero Professional CFM',
    category: 'Proteínas',
    format: '2kg',
    flavor: 'Chocolate Belga',
    pvp: 68.90,
    precioProSinIva: 42.00,
    precioProConIva: 50.82,
    stock: 14,
    image: '/src/assets/images/iogenix_whey_isolate_1792288218829.jpg',
    barcode: '8436578010036',
  },
  {
    id: 'prod-isowhey-1kg',
    name: 'Iso Whey Zero Professional CFM',
    category: 'Proteínas',
    format: '1kg',
    flavor: 'Vainilla Bourbon',
    pvp: 39.90,
    precioProSinIva: 24.50,
    precioProConIva: 29.65,
    stock: 22,
    image: '/src/assets/images/iogenix_whey_isolate_1792288218829.jpg',
    barcode: '8436578010043',
  },
  {
    id: 'prod-thunder-pre',
    name: 'Pre-Workout Thunder Shot Pro',
    category: 'Pre-Entreno',
    format: '300g',
    flavor: 'Frutos Rojos Explosion',
    pvp: 29.90,
    precioProSinIva: 17.50,
    precioProConIva: 21.18,
    stock: 16,
    image: '/src/assets/images/iogenix_preworkout_thunder_1792288218778.jpg',
    barcode: '8436578010050',
  },
  {
    id: 'prod-bcaa-glutamine',
    name: 'BCAA 8:1:1 + Glutamina Kyowa®',
    category: 'Aminoácidos',
    format: '500g',
    flavor: 'Limón Cola Fresco',
    pvp: 32.50,
    precioProSinIva: 19.50,
    precioProConIva: 23.60,
    stock: 25,
    image: '/src/assets/images/iogenix_bcaa_glutamine_1792288219694.jpg',
    barcode: '8436578010067',
  },
  {
    id: 'prod-oatmeal-1kg',
    name: 'Harina de Avena Micronizada Gourmet',
    category: 'Alimentación',
    format: '1kg',
    flavor: 'Black Cookies & Cream',
    pvp: 6.90,
    precioProSinIva: 4.20,
    precioProConIva: 5.08,
    stock: 45,
    image: '/src/assets/images/iogenix_whey_isolate_1792288218829.jpg',
    barcode: '8436578010074',
  },
  {
    id: 'prod-multivit-sport',
    name: 'Sport Complex Multivitamin',
    category: 'Salud',
    format: '120 Cáps',
    flavor: 'Neutro',
    pvp: 18.90,
    precioProSinIva: 11.00,
    precioProConIva: 13.31,
    stock: 30,
    image: '/src/assets/images/iogenix_creatine_clonapure_1792288218078.jpg',
    barcode: '8436578010081',
  },
  {
    id: 'prod-crispy-bars',
    name: 'Crispy Protein Bar 32% (Pack 12)',
    category: 'Alimentación',
    format: '12x 60g',
    flavor: 'Chocolate Brownie',
    pvp: 24.00,
    precioProSinIva: 14.80,
    precioProConIva: 17.91,
    stock: 12,
    image: '/src/assets/images/iogenix_preworkout_thunder_1792288218778.jpg',
    barcode: '8436578010098',
  },
];

// Helper to seed realistic locked past historical sales for the current month
export function generateSeedSales(todayDateStr: string): SaleRecord[] {
  const [yearStr, monthStr, dayStr] = todayDateStr.split('-');
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);
  const todayDay = parseInt(dayStr, 10);

  const seedSales: SaleRecord[] = [];
  let ticketSeq = 1001;

  // Generate sales for previous days in the current month (days 1 to todayDay - 1)
  for (let d = 1; d < todayDay; d++) {
    const dStr = d < 10 ? `0${d}` : `${d}`;
    const dateStr = `${year}-${month < 10 ? '0' + month : month}-${dStr}`;

    // Morning shift sales (typically 3 to 7 sales)
    const morningCount = 3 + (d % 4);
    for (let s = 0; s < morningCount; s++) {
      ticketSeq++;
      const isCard = s % 2 === 0;
      const hour = 9 + (s % 5);
      const min = (s * 13) % 60;
      const timeStr = `${hour < 10 ? '0' + hour : hour}:${min < 10 ? '0' + min : min}:15`;
      const amount = 25 + ((d * 7 + s * 13) % 65) + 0.90;
      const subtotal = Number((amount / 1.21).toFixed(2));
      const iva = Number((amount - subtotal).toFixed(2));

      seedSales.push({
        id: `sale-seed-${ticketSeq}`,
        ticketNumber: `TK-${year}${monthStr}-${ticketSeq}`,
        timestamp: new Date(`${dateStr}T${timeStr}`).getTime(),
        date: dateStr,
        timeStr,
        shift: 'mañana',
        items: [
          {
            product: INITIAL_PRODUCTS[s % INITIAL_PRODUCTS.length],
            quantity: 1 + (s % 2),
            selectedTarifa: s % 3 === 0 ? 'profesional' : 'pvp',
            customDiscountPercent: 0,
          },
        ],
        tarifa: s % 3 === 0 ? 'profesional' : 'pvp',
        discountPercent: 0,
        subtotalSinIva: subtotal,
        iva,
        total: amount,
        paymentMethod: isCard ? 'tarjeta' : 'efectivo',
        cashGiven: isCard ? undefined : amount + 10,
        cashChange: isCard ? undefined : 10,
      });
    }

    // Afternoon shift sales (typically 4 to 8 sales)
    const afternoonCount = 4 + ((d * 2) % 4);
    for (let s = 0; s < afternoonCount; s++) {
      ticketSeq++;
      const isCard = (s + d) % 2 === 0;
      const hour = 16 + (s % 5);
      const min = (s * 17) % 60;
      const timeStr = `${hour}:${min < 10 ? '0' + min : min}:30`;
      const amount = 30 + ((d * 11 + s * 9) % 75) + 0.50;
      const subtotal = Number((amount / 1.21).toFixed(2));
      const iva = Number((amount - subtotal).toFixed(2));

      seedSales.push({
        id: `sale-seed-${ticketSeq}`,
        ticketNumber: `TK-${year}${monthStr}-${ticketSeq}`,
        timestamp: new Date(`${dateStr}T${timeStr}`).getTime(),
        date: dateStr,
        timeStr,
        shift: 'tarde',
        items: [
          {
            product: INITIAL_PRODUCTS[(s + 2) % INITIAL_PRODUCTS.length],
            quantity: 1,
            selectedTarifa: 'pvp',
            customDiscountPercent: 0,
          },
        ],
        tarifa: 'pvp',
        discountPercent: 0,
        subtotalSinIva: subtotal,
        iva,
        total: amount,
        paymentMethod: isCard ? 'tarjeta' : 'efectivo',
        cashGiven: isCard ? undefined : 50,
        cashChange: isCard ? undefined : Number((50 - amount).toFixed(2)),
      });
    }
  }

  return seedSales;
}
