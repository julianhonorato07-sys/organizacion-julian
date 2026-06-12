// Datos del portfolio cripto, portados de la app "Personal finance web app"
// (portfolio.html, generado a partir del historial de transacciones de Binance)

export const HOLDINGS = {
  PEPE: 9895225.57, ARS: 1191.645, HBAR: 1087.88269079, DOGE: 612.94302608,
  BONK: 468.0, ADA: 340.25882873, NEXO: 178.29956972, SAND: 167.97149372,
  XRP: 145.86251796, WLD: 139.52910591, RAY: 38.21781239, SXT: 16.5813478,
  SOL: 10.18759823, AVAX: 6.34972458, NIGHT: 3.5055492, RDNT: 3.21691416,
  AIGENSYN: 1.46943126, ROBO: 1.42939813, ETH: 0.79383909, USDC: 0.76015103,
  SHIB: 0.75, XLM: 0.41082694, CHIP: 0.36974705, USDT: 0.2435243,
  BNB: 0.2147628, OPN: 0.20839605, GENIUS: 0.14715365, FDUSD: 0.042,
  UNI: 0.00803177, BTC: 0.00709708,
}

export const CHART_DATA = {
  dates: ['2024-03-01', '2024-07-01', '2024-10-01', '2024-11-01', '2025-02-01', '2025-03-01', '2025-04-01', '2025-05-01', '2025-09-01', '2026-01-01', '2026-03-01', '2026-04-01', '2026-05-01', '2026-06-01'],
  cumulative: [10.58, 53.08, 1953.62, 2355.71, 3309.46, 4209.46, 5817.69, 5917.69, 5949.06, 6780.51, 7162.74, 7258.29, 7449.57, 7640.25],
}

export const STATS = {
  investedSpot: 6562,
  totalDeposited: 7640.25,
  realizedPnl: -895.42,
  totalTransactions: 4276,
}

// Precios de referencia aproximados (se actualizan con la API de Binance o a mano)
export const DEFAULT_PRICES = {
  BTC: 105000, ETH: 2500, SOL: 155, XRP: 2.2, ADA: 0.65, DOGE: 0.16,
  HBAR: 0.2, AVAX: 23, PEPE: 0.000013, BONK: 0.000022, WLD: 0.75,
  NEXO: 1.5, SAND: 0.25, RAY: 3.5, BNB: 600, USDT: 1, USDC: 1,
  SXT: 0.45, RDNT: 0.08, UNI: 8, XLM: 0.28, FDUSD: 1, SHIB: 0.0000095,
  ARS: 0.001, NIGHT: 0, AIGENSYN: 0, ROBO: 0, CHIP: 0, OPN: 0, GENIUS: 0,
}

export const STABLES = ['USDT', 'USDC', 'FDUSD', 'ARS']

const FALLBACK_COLORS = ['#58a6ff', '#3fb950', '#f78166', '#d2a8ff', '#ffa657', '#79c0ff',
  '#56d364', '#ff7b72', '#d29922', '#e3b341', '#a5d6ff', '#b3d4a3', '#ff9492']

const COIN_COLORS = {
  BTC: '#f7931a', ETH: '#627eea', SOL: '#9945ff', XRP: '#00aae4',
  ADA: '#0033ad', DOGE: '#c3a634', HBAR: '#5c5c5c', AVAX: '#e84142',
  PEPE: '#4caf50', USDT: '#26a17b', USDC: '#2775ca', BNB: '#f3ba2f',
  WLD: '#444444', NEXO: '#1a5bcc', SAND: '#00adef', XLM: '#7b68ee',
  RAY: '#c23ce4', RDNT: '#c8a2c8', BONK: '#ff9534',
}

export function coinColor(c) {
  return COIN_COLORS[c] || FALLBACK_COLORS[Object.keys(HOLDINGS).indexOf(c) % FALLBACK_COLORS.length]
}

export function formatNum(n) {
  if (n === undefined || n === null || isNaN(n)) return '0'
  if (n >= 1000) return n.toLocaleString('en-US', { maximumFractionDigits: 2, minimumFractionDigits: 2 })
  if (n >= 1) return n.toFixed(2)
  if (n >= 0.01) return n.toFixed(4)
  return n.toPrecision(4)
}

export function formatQty(n) {
  if (n === undefined || n === null || isNaN(n)) return '0'
  const abs = Math.abs(n)
  const sign = n < 0 ? '-' : ''
  if (abs >= 1000000) return sign + (abs / 1000000).toFixed(2) + 'M'
  if (abs >= 1000) return sign + abs.toLocaleString('en-US', { maximumFractionDigits: 4 })
  if (abs >= 1) return sign + abs.toFixed(4)
  if (abs >= 0.0001) return sign + abs.toFixed(6)
  return sign + abs.toExponential(4)
}
