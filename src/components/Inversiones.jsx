import { useEffect, useMemo, useState } from 'react'
import { RefreshCw } from 'lucide-react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import { Line, Doughnut, Bar } from 'react-chartjs-2'
import { useLocalStorage } from '../hooks/useLocalStorage'
import {
  HOLDINGS,
  CHART_DATA,
  STATS,
  DEFAULT_PRICES,
  STABLES,
  coinColor,
  formatNum,
  formatQty,
} from '../data/portfolio'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Tooltip, Legend, Filler)

// Tarjetas integradas al tema monocromático global
const T = {
  card: 'glass rounded-2xl',
  sub: 'text-zinc-500',
  cardTitle: 'text-sm font-semibold text-zinc-200',
}

// Escala de grises para los gráficos (estilo monocromático: el 1° más claro)
const MONO = ['#fafafa', '#d8d8dc', '#b4b4ba', '#92929a', '#74747c', '#5b5b63', '#46464e', '#36363d', '#2a2a30']
const monoColor = (i) => MONO[Math.min(i, MONO.length - 1)]

const TIME_FILTERS = [
  { label: '3M', months: 3 },
  { label: '6M', months: 6 },
  { label: '1A', months: 12 },
  { label: 'Todo', months: 0 },
]

export default function Inversiones() {
  const [prices, setPrices] = useLocalStorage('inv-precios', DEFAULT_PRICES)
  const [status, setStatus] = useState({ text: 'Cargando precios en vivo...', color: '#8b949e' })
  const [months, setMonths] = useState(0)

  const total = useMemo(
    () => Object.keys(HOLDINGS).reduce((sum, c) => sum + HOLDINGS[c] * (prices[c] || 0), 0),
    [prices],
  )
  const unrealizedPnl = total - STATS.totalDeposited

  const fetchLivePrices = async () => {
    setStatus({ text: 'Cargando precios en vivo...', color: '#8b949e' })
    try {
      const res = await fetch('https://api.binance.com/api/v3/ticker/price')
      const tickers = await res.json()
      const priceMap = {}
      tickers.forEach((t) => { priceMap[t.symbol] = parseFloat(t.price) })

      let updated = 0
      const livePrices = {}
      Object.keys(HOLDINGS).forEach((c) => {
        if (c === 'USDT' || c === 'USDC' || c === 'FDUSD') { livePrices[c] = 1; updated++; return }
        const direct = priceMap[c + 'USDT']
        if (direct) { livePrices[c] = direct; updated++; return }
        const viaBtc = priceMap[c + 'BTC']
        if (viaBtc && priceMap['BTCUSDT']) { livePrices[c] = viaBtc * priceMap['BTCUSDT']; updated++ }
      })
      if (priceMap['USDTARS']) livePrices['ARS'] = 1 / priceMap['USDTARS']
      setPrices((prev) => ({ ...prev, ...livePrices }))
      const now = new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })
      setStatus({ text: `✓ Precios en vivo de Binance · ${updated} activos · actualizado ${now}`, color: '#3fb950' })
    } catch {
      setStatus({
        text: '⚠ No se pudieron cargar precios en vivo. Usando precios de referencia — podés editarlos en la tabla.',
        color: '#d29922',
      })
    }
  }

  useEffect(() => {
    fetchLivePrices()
    const id = setInterval(fetchLivePrices, 60000)
    return () => clearInterval(id)
  }, [])

  // Evolución del capital, filtrada por rango temporal
  const lineData = useMemo(() => {
    let points = CHART_DATA.dates.map((d, i) => ({ d, v: CHART_DATA.cumulative[i] }))
    if (months > 0) {
      const cutoff = new Date()
      cutoff.setMonth(cutoff.getMonth() - months)
      points = points.filter((x) => new Date(x.d) >= cutoff)
    }
    return points
  }, [months])

  // Asignación: top 8 por valor + "Otros"
  const allocation = useMemo(() => {
    const sorted = Object.keys(HOLDINGS)
      .map((c) => ({ c, v: HOLDINGS[c] * (prices[c] || 0) }))
      .sort((a, b) => b.v - a.v)
    const top = sorted.slice(0, 8)
    const others = sorted.slice(8).reduce((a, b) => a + b.v, 0)
    return {
      labels: [...top.map((x) => x.c), ...(others > 0 ? ['Otros'] : [])],
      values: [...top.map((x) => x.v), ...(others > 0 ? [others] : [])],
      colors: [...top.map((_, i) => monoColor(i)), '#232328'],
    }
  }, [prices])

  const topAssets = useMemo(
    () =>
      Object.keys(HOLDINGS)
        .map((c) => ({ c, v: HOLDINGS[c] * (prices[c] || 0) }))
        .sort((a, b) => b.v - a.v)
        .slice(0, 10),
    [prices],
  )

  const allocationTotal = allocation.values.reduce((a, b) => a + b, 0)

  return (
    <div className="text-slate-100">
      {/* Encabezado del portfolio */}
      <div className={`${T.card} p-6 mb-4`}>
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <div className={`${T.cardTitle} mb-1.5`}>Valor Total del Portfolio</div>
            <div className="text-4xl font-bold text-white mb-1">${formatNum(total)}</div>
            <div className="text-sm" style={{ color: status.color }}>{status.text}</div>
          </div>
          <button
            onClick={fetchLivePrices}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#2a2a2e] text-zinc-400 text-sm font-semibold hover:border-zinc-500 hover:text-white transition-colors"
          >
            <RefreshCw size={14} /> Actualizar precios
          </button>
        </div>
        <div className="flex gap-6 flex-wrap mt-4">
          <Meta label="Total Invertido (Spot)" value={`$${STATS.investedSpot.toLocaleString('en-US')}`} />
          <Meta label="PnL Realizado (Futuros)" value={`-$${Math.abs(STATS.realizedPnl).toFixed(2)}`} color="#f85149" />
          <Meta
            label="PnL No Realizado (est.)"
            value={`${unrealizedPnl >= 0 ? '+' : '-'}$${formatNum(Math.abs(unrealizedPnl))}`}
            color={unrealizedPnl >= 0 ? '#3fb950' : '#f85149'}
          />
          <Meta label="Transacciones" value={STATS.totalTransactions.toLocaleString()} />
          <Meta label="Activos" value={Object.keys(HOLDINGS).length} />
        </div>
      </div>

      {/* Evolución del capital */}
      <div className={`${T.card} p-5 mb-4`}>
        <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
          <div className={T.cardTitle}>Evolución del Capital Invertido</div>
          <div className="flex gap-1 bg-[#101012] border border-[#232328] rounded-full p-1">
            {TIME_FILTERS.map((f) => (
              <button
                key={f.label}
                onClick={() => setMonths(f.months)}
                className={`px-3 py-1 rounded-full text-[13px] font-semibold transition-colors ${
                  months === f.months
                    ? 'bg-[#2e2e33] text-white'
                    : 'text-zinc-500 hover:text-zinc-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
        <div className="h-[220px]">
          <Line
            data={{
              labels: lineData.map((x) => x.d),
              datasets: [{
                label: 'Capital Invertido (USD)',
                data: lineData.map((x) => x.v),
                borderColor: '#3fb950',
                backgroundColor: 'rgba(63,185,80,0.1)',
                fill: true,
                tension: 0.3,
                pointRadius: 4,
                pointHoverRadius: 6,
                borderWidth: 2,
              }],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { display: false },
                tooltip: { callbacks: { label: (ctx) => ' $' + formatNum(ctx.raw) } },
              },
              scales: {
                x: { grid: { color: '#1e1e22' }, ticks: { color: '#71717a', maxTicksLimit: 8 } },
                y: { grid: { color: '#1e1e22' }, ticks: { color: '#71717a', callback: (v) => '$' + formatNum(v) } },
              },
            }}
          />
        </div>
      </div>

      {/* Asignación + Top activos */}
      <div className="grid gap-4 md:grid-cols-2 mb-4">
        <div className={`${T.card} p-5`}>
          <div className={`${T.cardTitle} mb-4`}>Asignación (por valor)</div>
          <div className="flex items-center gap-5 flex-wrap">
            <div className="w-[160px] h-[160px] shrink-0">
              <Doughnut
                data={{
                  labels: allocation.labels,
                  datasets: [{
                    data: allocation.values,
                    backgroundColor: allocation.colors,
                    borderColor: '#151517',
                    borderWidth: 2,
                  }],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  cutout: '65%',
                  plugins: {
                    legend: { display: false },
                    tooltip: {
                      callbacks: {
                        label: (ctx) => {
                          const pct = allocationTotal > 0 ? ((ctx.raw / allocationTotal) * 100).toFixed(1) : '0'
                          return ` ${ctx.label}: ${pct}% ($${formatNum(ctx.raw)})`
                        },
                      },
                    },
                  },
                }}
              />
            </div>
            <div className="flex-1 min-w-[180px]">
              {allocation.labels.map((l, i) => {
                const pct = allocationTotal > 0 ? ((allocation.values[i] / allocationTotal) * 100).toFixed(1) : '0'
                return (
                  <div key={l} className="flex items-center gap-2 py-1.5 border-b border-[#1e1e22] last:border-0">
                    <span className="w-2.5 h-2.5 rounded-[3px] shrink-0" style={{ backgroundColor: allocation.colors[i] }} />
                    <span className="flex-1 text-[13px] font-semibold">{l}</span>
                    <span className="text-[13px] font-bold w-12 text-right">{pct}%</span>
                    <span className={`text-xs ${T.sub} w-[70px] text-right`}>
                      {allocation.values[i] > 0 ? '$' + formatNum(allocation.values[i]) : '—'}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div className={`${T.card} p-5`}>
          <div className={`${T.cardTitle} mb-4`}>Top Activos por Valor (USD)</div>
          <div className="h-[220px]">
            <Bar
              data={{
                labels: topAssets.map((x) => x.c),
                datasets: [{
                  data: topAssets.map((x) => x.v),
                  backgroundColor: topAssets.map((_, i) => monoColor(i)),
                  borderRadius: 6,
                }],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false },
                  tooltip: { callbacks: { label: (ctx) => ' $' + formatNum(ctx.raw) } },
                },
                scales: {
                  x: { grid: { display: false }, ticks: { color: '#71717a' } },
                  y: { grid: { color: '#1e1e22' }, ticks: { color: '#71717a', callback: (v) => '$' + formatNum(v) } },
                },
              }}
            />
          </div>
        </div>
      </div>

      {/* Tabla de posiciones */}
      <div className={`${T.card} p-5`}>
        <div className="flex items-center justify-between mb-4">
          <div className="text-base font-bold">Posiciones</div>
          <span className={`text-xs ${T.sub}`}>Editá los precios para calcular el valor</span>
        </div>
        <div className="overflow-x-auto scroll-slim">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {['Activo', 'Cantidad', 'Precio (USD)', 'Valor (USD)'].map((h, i) => (
                  <th
                    key={h}
                    className={`text-xs ${T.sub} font-medium px-2.5 py-2 border-b border-[#232328] ${i === 0 ? 'text-left' : 'text-right'}`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.keys(HOLDINGS).map((c) => {
                const qty = HOLDINGS[c]
                const price = prices[c] || 0
                const val = qty * price
                const isStable = STABLES.includes(c)
                return (
                  <tr key={c} className="hover:bg-[#1a1a1d]">
                    <td className="px-2.5 py-2 border-b border-[#1e1e22]">
                      <div className="inline-flex items-center gap-1.5 font-bold text-sm">
                        <span
                          className="w-7 h-7 rounded-full inline-flex items-center justify-center text-[11px] font-bold text-white shrink-0"
                          style={{ backgroundColor: coinColor(c) }}
                        >
                          {c.substring(0, 3)}
                        </span>
                        <span>{c}</span>
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                            isStable ? 'bg-[#1a3a1a] text-[#56d364]' : 'bg-[#1f3a5f] text-[#79c0ff]'
                          }`}
                        >
                          {isStable ? 'STABLE' : 'CRYPTO'}
                        </span>
                      </div>
                    </td>
                    <td className={`px-2.5 py-2 border-b border-[#1e1e22] text-right text-[13px] ${T.sub}`}>
                      {formatQty(qty)}
                    </td>
                    <td className="px-2.5 py-2 border-b border-[#1e1e22] text-right">
                      <input
                        type="number"
                        step="any"
                        value={price}
                        onChange={(e) => setPrices((prev) => ({ ...prev, [c]: parseFloat(e.target.value) || 0 }))}
                        className="bg-[#101012] border border-[#2a2a2e] rounded-md text-zinc-100 text-[13px] px-2 py-1 w-[110px] text-right focus:outline-none focus:border-zinc-400"
                      />
                    </td>
                    <td className="px-2.5 py-2 border-b border-[#1e1e22] text-right text-sm font-semibold">
                      {val > 0 ? '$' + formatNum(val) : '—'}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function Meta({ label, value, color }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-slate-500">{label}</span>
      <span className="text-base font-semibold" style={color ? { color } : undefined}>{value}</span>
    </div>
  )
}
