import { useEffect, useMemo, useState } from 'react'

// Mini graphique en chandeliers anime illustrant l'Option A (le marche).
// Le `tone` oriente legerement la tendance pour coller a l'evenement :
//  'down' baissier, 'up' haussier, 'flat' stable, 'mix' volatil.

function buildSeries(n, tone) {
  const drift = { down: -0.9, up: 0.9, flat: 0, mix: 0 }[tone] ?? 0
  const vol = { down: 1.1, up: 1.1, flat: 0.5, mix: 1.8 }[tone] ?? 1
  let price = 50
  const bars = []
  for (let i = 0; i < n; i++) {
    const open = price
    const move = drift + (Math.random() - 0.5) * 4 * vol
    const close = Math.max(8, Math.min(92, open + move))
    const high = Math.max(open, close) + Math.random() * 3 * vol
    const low = Math.min(open, close) - Math.random() * 3 * vol
    bars.push({ open, close, high, low, up: close >= open })
    price = close
  }
  return bars
}

export default function Candlestick({ tone = 'mix', bars = 14 }) {
  const [tick, setTick] = useState(0)
  // Regenere une serie a intervalle regulier pour l'effet "temps reel".
  const series = useMemo(() => buildSeries(bars, tone), [bars, tone, tick])

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1800)
    return () => clearInterval(id)
  }, [])

  const W = 200
  const H = 90
  const step = W / series.length
  const bodyW = step * 0.55

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="h-full w-full"
      role="img"
      aria-label="Graphique boursier illustratif (probabilité inconnue)"
    >
      {series.map((b, i) => {
        const x = i * step + step / 2
        const color = b.up ? '#16A34A' : '#DC2626'
        return (
          <g key={i} className="transition-all duration-500">
            {/* meche */}
            <line x1={x} y1={H - b.high} x2={x} y2={H - b.low} stroke={color} strokeWidth="1" />
            {/* corps */}
            <rect
              x={x - bodyW / 2}
              y={H - Math.max(b.open, b.close)}
              width={bodyW}
              height={Math.max(1.5, Math.abs(b.close - b.open))}
              fill={color}
              rx="0.5"
            />
          </g>
        )
      })}
    </svg>
  )
}
