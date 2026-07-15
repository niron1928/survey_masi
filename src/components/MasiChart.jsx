// Reproduction fidele du graphique "Evolution du MASI - niveau de fin d'annee
// (2013-2025)" fournie par le chercheur. Rendu en SVG responsive, avec
// annotations. Les niveaux sont approximatifs (synthese de presse).
//
// Chaque point est colore selon le sens de variation par rapport a l'annee
// precedente : vert = hausse, rouge = baisse, bleu = point de depart.

const DATA = [
  { year: 2013, v: 9100, color: 'blue' },
  { year: 2014, v: 9600, color: 'up' },
  { year: 2015, v: 8900, color: 'down' },
  { year: 2016, v: 11650, color: 'up' },
  { year: 2017, v: 12400, color: 'up' },
  { year: 2018, v: 11350, color: 'down' },
  { year: 2019, v: 12150, color: 'up' },
  { year: 2020, v: 11250, color: 'down' },
  { year: 2021, v: 13350, color: 'up' },
  { year: 2022, v: 10700, color: 'down' },
  { year: 2023, v: 12150, color: 'up' },
  { year: 2024, v: 14750, color: 'up' },
  { year: 2025, v: 18850, color: 'up' },
]

const COLORS = { up: '#2e7d32', down: '#c0392b', blue: '#1f4e79' }

// Geometrie du trace
const W = 820
const H = 430
const M = { top: 40, right: 40, bottom: 50, left: 62 }
const Y_MIN = 8000
const Y_MAX = 20000

const plotW = W - M.left - M.right
const plotH = H - M.top - M.bottom

const x = (i) => M.left + (i * plotW) / (DATA.length - 1)
const y = (v) => M.top + plotH - ((v - Y_MIN) / (Y_MAX - Y_MIN)) * plotH

export default function MasiChart() {
  const linePath = DATA.map((d, i) => `${i === 0 ? 'M' : 'L'} ${x(i)} ${y(d.v)}`).join(' ')
  const areaPath = `${linePath} L ${x(DATA.length - 1)} ${y(Y_MIN)} L ${x(0)} ${y(Y_MIN)} Z`
  const yTicks = [8000, 10000, 12000, 14000, 16000, 18000, 20000]

  return (
    <div className="w-full overflow-x-auto rounded-2xl bg-white p-2 shadow-lg">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full"
        role="img"
        aria-label="Graphique : évolution du niveau du MASI en fin d'année de 2013 à 2025, d'environ 9 100 points à un record proche de 20 000 points."
        style={{ minWidth: 520 }}
      >
        {/* Titre */}
        <text x={W / 2} y={24} textAnchor="middle" fontSize="19" fontWeight="700" fill="#1f4e79">
          Évolution du MASI — niveau de fin d’année (2013–2025)
        </text>

        {/* Grille + axe Y */}
        {yTicks.map((t) => (
          <g key={t}>
            <line x1={M.left} y1={y(t)} x2={W - M.right} y2={y(t)} stroke="#e5e7eb" strokeWidth="1" />
            <text x={M.left - 10} y={y(t) + 4} textAnchor="end" fontSize="12" fill="#4b5563">
              {t / 1000}k
            </text>
          </g>
        ))}

        {/* Aire sous la courbe */}
        <path d={areaPath} fill="#1f4e79" opacity="0.06" />
        {/* Courbe */}
        <path d={linePath} fill="none" stroke="#1f4e79" strokeWidth="2.6" strokeLinejoin="round" />

        {/* Points */}
        {DATA.map((d, i) => (
          <circle key={d.year} cx={x(i)} cy={y(d.v)} r="6" fill={COLORS[d.color]} />
        ))}

        {/* Axe X (annees) */}
        {DATA.map((d, i) => (
          <text key={d.year} x={x(i)} y={H - M.bottom + 20} textAnchor="middle" fontSize="12" fill="#4b5563">
            {d.year}
          </text>
        ))}

        {/* Annotations */}
        <text x={x(3)} y={y(11650) - 26} textAnchor="middle" fontSize="13" fontWeight="700" fill="#2e7d32">
          Forte hausse
        </text>
        <text x={x(3)} y={y(11650) - 11} textAnchor="middle" fontSize="13" fontWeight="700" fill="#2e7d32">
          (+30%)
        </text>

        <text x={x(7)} y={y(11250) + 42} textAnchor="middle" fontSize="13" fontWeight="700" fill="#c0392b">
          Choc Covid
        </text>

        <text x={x(9)} y={y(10700) + 34} textAnchor="middle" fontSize="13" fontWeight="700" fill="#c0392b">
          Chute
        </text>
        <text x={x(9)} y={y(10700) + 49} textAnchor="middle" fontSize="13" fontWeight="700" fill="#c0392b">
          (-20%)
        </text>

        <text x={x(12)} y={y(18850) - 26} textAnchor="end" fontSize="13" fontWeight="700" fill="#2e7d32">
          Record
        </text>
        <text x={x(12)} y={y(18850) - 11} textAnchor="end" fontSize="13" fontWeight="700" fill="#2e7d32">
          (~20 000 en août)
        </text>

        {/* Axe Y - titre */}
        <text
          x={16}
          y={M.top + plotH / 2}
          textAnchor="middle"
          fontSize="12"
          fill="#4b5563"
          transform={`rotate(-90 16 ${M.top + plotH / 2})`}
        >
          Niveau du MASI (points)
        </text>

        {/* Note de bas de figure */}
        <text x={W / 2} y={H - 6} textAnchor="middle" fontSize="11" fontStyle="italic" fill="#9ca3af">
          Niveaux de fin d’année approximatifs (synthèse de presse). Source à confirmer sur la série
          officielle de la Bourse de Casablanca.
        </text>
      </svg>
    </div>
  )
}
