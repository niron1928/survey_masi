import { useEffect, useState } from 'react'

// Bandeau de cotations defilant en haut de chaque ecran.
// MASI reel-fictif + valeurs fictives (ATW, IAM, BCP, GAZ, LBV) qui
// clignotent alternativement vert/rouge et bougent legerement.

const INITIAL = [
  { sym: 'MASI', val: 18353, dec: 0 },
  { sym: 'ATW', val: 512.4, dec: 1 },
  { sym: 'IAM', val: 98.7, dec: 1 },
  { sym: 'BCP', val: 268.0, dec: 1 },
  { sym: 'GAZ', val: 4620, dec: 0 },
  { sym: 'LBV', val: 1345, dec: 0 },
]

function formatNumber(v, dec) {
  return v.toLocaleString('fr-FR', {
    minimumFractionDigits: dec,
    maximumFractionDigits: dec,
  })
}

export default function Ticker() {
  const [quotes, setQuotes] = useState(() =>
    INITIAL.map((q) => ({ ...q, chg: (Math.random() - 0.45) * 0.6 })),
  )

  // Mise a jour legere des cotations toutes les ~2,5 s.
  useEffect(() => {
    const id = setInterval(() => {
      setQuotes((prev) =>
        prev.map((q) => {
          const chg = (Math.random() - 0.5) * 1.2 // variation en %
          const val = Math.max(0.1, q.val * (1 + chg / 100))
          return { ...q, val, chg }
        }),
      )
    }, 2500)
    return () => clearInterval(id)
  }, [])

  // On duplique la liste pour un defilement continu sans coupure.
  const strip = [...quotes, ...quotes]

  return (
    <div className="ticker-mask overflow-hidden border-b border-edge bg-black/40">
      <div className="flex w-max animate-ticker whitespace-nowrap py-1.5">
        {strip.map((q, i) => {
          const up = q.chg >= 0
          return (
            <span key={i} className="mx-4 font-mono text-[13px]" aria-hidden="true">
              <span className="font-semibold text-ink">{q.sym}</span>{' '}
              <span className="text-muted">{formatNumber(q.val, q.dec)}</span>{' '}
              <span className={up ? 'text-up' : 'text-down'}>
                {up ? '▲' : '▼'} {up ? '+' : ''}
                {q.chg.toFixed(2)}%
              </span>
            </span>
          )
        })}
      </div>
    </div>
  )
}
