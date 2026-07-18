import { useMemo, useState } from 'react'
import { downloadCsv, downloadJson } from '../lib/csv.js'
import { clearResponses, getAbandons, clearAbandons } from '../lib/storage.js'
import { EVENT_CODES } from '../lib/indices.js'

// =====================================================================
// TABLEAU DE BORD CHERCHEUR (acces protege par cle, voir App + config).
// Affiche les principaux resultats, des graphiques simples, et permet
// l'export CSV / JSON ainsi que l'effacement des donnees.
//
// Source des donnees : localStorage de CE navigateur (mode local / kiosque).
// Pour une collecte centralisee multi-appareils, brancher un backend
// (BACKEND_URL) et alimenter ce tableau depuis l'API (voir README).
// =====================================================================

const EVENT_LABEL = {
  E1: 'E1 Baisse',
  E2: 'E2 Stabilité',
  E3: 'E3 Hausse',
  E1E2: 'E1∪E2',
  E1E3: 'E1∪E3',
  E2E3: 'E2∪E3',
}

// --- petits utilitaires statistiques ---
const onlyNums = (arr) => arr.filter((x) => typeof x === 'number' && !Number.isNaN(x))
const mean = (arr) => {
  const a = onlyNums(arr)
  return a.length ? a.reduce((s, x) => s + x, 0) / a.length : NaN
}
const pct = (arr, pred) => {
  if (!arr.length) return NaN
  return (100 * arr.filter(pred).length) / arr.length
}
const fmt = (x, d = 2) => (Number.isNaN(x) || x === undefined ? '—' : x.toFixed(d).replace('.', ','))

export default function Dashboard({ responses, onExit, onCleared }) {
  const [n, setN] = useState(responses.length)
  const data = responses
  const abandons = getAbandons()

  const stats = useMemo(() => {
    if (!data.length) return null
    const bs = data.map((r) => r.indice_b)
    const as = data.map((r) => r.indice_a)
    const averse = data.filter((r) => r.indice_b > 0)
    const nonAverse = data.filter((r) => r.indice_b <= 0)
    return {
      meanB: mean(bs),
      meanA: mean(as),
      pctAverse: pct(data, (r) => r.indice_b > 0),
      pctTolerant: pct(data, (r) => r.indice_b < 0),
      pctInsensible: pct(data, (r) => r.indice_a > 0),
      meanCulture: mean(data.map((r) => r.score_culture)),
      // Nouvelles cles (notation directe au lieu de Likert)
      meanViolations: mean(data.map((r) => r.violations_monotonie)),
      pctIncoherent: pct(data, (r) => r.incoherent),
      meanDuree: mean(data.map((r) => r.duree_totale_sec)),
      // Constat central : intention d'investir selon l'attitude
      // intention_investir est maintenant une chaine, on la code en score pour la moyenne
      intentionAverse: countIntention(averse),
      intentionNonAverse: countIntention(nonAverse),
      mByEvent: EVENT_CODES.map((c) => ({ code: c, label: EVENT_LABEL[c], value: mean(data.map((r) => r.m?.[c])) })),
      bs,
    }
  }, [data])

  function handleClear() {
    if (window.confirm('Effacer DÉFINITIVEMENT toutes les réponses de cet appareil ? Exportez le CSV avant.')) {
      clearResponses()
      clearAbandons()
      setN(0)
      onCleared?.()
    }
  }

  const stamp = () => new Date().toISOString().slice(0, 10)

  return (
    <div className="min-h-screen bg-night px-4 py-6 sm:py-10">
      <div className="mx-auto w-full max-w-5xl">
        {/* En-tete */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-info">Accès chercheur</p>
            <h1 className="text-2xl font-bold text-ink">Tableau de bord — résultats</h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => downloadCsv(data, `reponses_masi_${stamp()}.csv`)}
              disabled={!n}
              className="rounded-xl border border-up bg-up/20 px-4 py-2 text-sm font-bold text-up hover:bg-up/30 disabled:opacity-40"
            >
              ⬇ Export CSV
            </button>
            <button
              onClick={() => downloadJson(data, `reponses_masi_${stamp()}.json`)}
              disabled={!n}
              className="rounded-xl border border-info bg-info/15 px-4 py-2 text-sm font-semibold text-info hover:bg-info/25 disabled:opacity-40"
            >
              ⬇ Export JSON
            </button>
            <button
              onClick={handleClear}
              disabled={!n}
              className="rounded-xl border border-edge bg-surface px-4 py-2 text-sm text-muted hover:text-down disabled:opacity-40"
            >
              Effacer
            </button>
            <button
              onClick={onExit}
              className="rounded-xl border border-edge bg-surface px-4 py-2 text-sm text-muted hover:text-ink"
            >
              ← Questionnaire
            </button>
          </div>
        </div>

        {!n || !stats ? (
          <div className="rounded-2xl border border-edge bg-surface p-8 text-center text-muted">
            Aucune réponse enregistrée sur cet appareil pour l'instant.
          </div>
        ) : (
          <>
            {/* Cartes de synthese */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Stat label="Participants" value={n} mono />
              <Stat label="Indice b moyen (aversion)" value={fmt(stats.meanB)} tone={stats.meanB > 0 ? 'up' : 'down'} />
              <Stat label="Indice a moyen (insensibilité)" value={fmt(stats.meanA)} tone="info" />
              <Stat label="Durée moy. (s)" value={fmt(stats.meanDuree, 0)} mono />
              <Stat label="% averses (b>0)" value={fmt(stats.pctAverse, 0) + ' %'} tone="up" />
              <Stat label="% tolérants (b<0)" value={fmt(stats.pctTolerant, 0) + ' %'} tone="down" />
              <Stat label="% insensibles (a>0)" value={fmt(stats.pctInsensible, 0) + ' %'} tone="info" />
              <Stat label="% incohérents" value={fmt(stats.pctIncoherent, 0) + ' %'} tone={stats.pctIncoherent > 20 ? 'down' : 'muted'} />
              <Stat label="Violations monotonie moy." value={fmt(stats.meanViolations, 1)} tone={stats.meanViolations > 1 ? 'down' : 'muted'} />
              <Stat label="Culture fin. moy." value={fmt(stats.meanCulture, 1) + '/3'} mono />
              <Stat label="Abandons (ce navigateur)" value={abandons.length} mono />
              <Stat label="Taux complétion" value={n + abandons.length > 0 ? fmt((100 * n) / (n + abandons.length), 0) + ' %' : '—'} tone="info" />
            </div>

            {/* Constat central de l'etude */}
            <div className="mt-4 rounded-2xl border border-edge bg-surface p-5">
              <p className="font-mono text-xs uppercase tracking-widest text-info">Constat principal</p>
              <p className="mt-2 text-sm text-ink">
                Intention d'investir — averses à l'ambiguïté :{' '}
                <strong className="text-down">{stats.intentionAverse}</strong> · non-averses :{' '}
                <strong className="text-up">{stats.intentionNonAverse}</strong>. Culture financière
                moyenne : <strong>{fmt(stats.meanCulture, 1)}</strong>/3.
              </p>
            </div>

            {/* Graphiques */}
            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              <ChartCard title="Matching probability moyenne par événement">
                <BarChart
                  data={stats.mByEvent.map((e) => ({ label: e.label, value: e.value }))}
                  max={1}
                  refLine={1 / 3}
                />
                <p className="mt-2 text-[11px] text-muted">
                  Repère à 1/3 (équiprobabilité). Simples (E1–E3) vs composés (unions).
                </p>
              </ChartCard>
              <ChartCard title="Distribution de l'indice b (aversion)">
                <Histogram values={stats.bs} min={-1} max={1} bins={9} />
                <p className="mt-2 text-[11px] text-muted">À droite de 0 = aversion à l'ambiguïté.</p>
              </ChartCard>
            </div>

            {/* Abandons (C4) */}
            {abandons.length > 0 && (
              <div className="mt-4 rounded-2xl border border-edge bg-surface p-4">
                <p className="mb-3 font-mono text-xs uppercase tracking-widest text-info">
                  Abandons ({abandons.length})
                </p>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {Object.entries(
                    abandons.reduce((acc, a) => {
                      const k = a.ecran_abandon || 'inconnu'
                      acc[k] = (acc[k] || 0) + 1
                      return acc
                    }, {}),
                  ).map(([ecran, count]) => (
                    <div key={ecran} className="rounded-lg border border-edge bg-black/20 p-2">
                      <p className="font-mono text-[11px] text-muted">{ecran}</p>
                      <p className="text-lg font-bold text-ink">{count}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tableau brut */}
            <div className="mt-4 rounded-2xl border border-edge bg-surface p-4">
              <p className="mb-3 font-mono text-xs uppercase tracking-widest text-info">
                Réponses ({n})
              </p>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left font-mono text-xs">
                  <thead className="text-muted">
                    <tr>
                      {['#', 'horodatage', 'âge', 'genre', 'culture', 'b', 'a', 'famil.', 'intent.', 'durée', 'monot.', 'incoh.'].map((h) => (
                        <th key={h} className="border-b border-edge px-2 py-1.5">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="text-ink">
                    {data.map((r, i) => (
                      <tr key={r.id} className="hover:bg-black/20">
                        <td className="border-b border-edge/50 px-2 py-1.5 text-muted">{i + 1}</td>
                        <td className="border-b border-edge/50 px-2 py-1.5">{(r.horodatage || '').slice(0, 16).replace('T', ' ')}</td>
                        <td className="border-b border-edge/50 px-2 py-1.5">{r.age}</td>
                        <td className="border-b border-edge/50 px-2 py-1.5">{r.genre}</td>
                        <td className="border-b border-edge/50 px-2 py-1.5">{r.score_culture}/3</td>
                        <td className={`border-b border-edge/50 px-2 py-1.5 ${r.indice_b > 0 ? 'text-up' : 'text-down'}`}>{fmt(r.indice_b)}</td>
                        <td className="border-b border-edge/50 px-2 py-1.5 text-info">{fmt(r.indice_a)}</td>
                        <td className="border-b border-edge/50 px-2 py-1.5">{r.familiarite_masi?.slice(0, 6) || '—'}</td>
                        <td className="border-b border-edge/50 px-2 py-1.5">{r.intention_investir?.slice(0, 8) || '—'}</td>
                        <td className="border-b border-edge/50 px-2 py-1.5">{r.duree_totale_sec}s</td>
                        <td className={`border-b border-edge/50 px-2 py-1.5 ${r.violations_monotonie > 0 ? 'text-down' : ''}`}>{r.violations_monotonie ?? '—'}</td>
                        <td className="border-b border-edge/50 px-2 py-1.5">{r.incoherent ? '⚠' : ''}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// ---- helpers --------------------------------------------------------

// Compte la distribution des reponses d'intention pour un groupe.
function countIntention(group) {
  if (!group.length) return '—'
  const counts = {}
  for (const r of group) {
    const v = r.intention_investir || '—'
    counts[v] = (counts[v] || 0) + 1
  }
  // Retourne la reponse la plus frequente avec le pourcentage
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1])
  const top = sorted[0]
  return `${top[0]} (${Math.round((100 * top[1]) / group.length)}%)`
}

// ---- sous-composants d'affichage ------------------------------------

function Stat({ label, value, tone = 'ink', mono }) {
  const color = { up: 'text-up', down: 'text-down', info: 'text-info', muted: 'text-muted', ink: 'text-ink' }[tone]
  return (
    <div className="rounded-xl border border-edge bg-surface p-3">
      <p className="text-[11px] leading-tight text-muted">{label}</p>
      <p className={`mt-1 text-xl font-bold ${color} ${mono ? 'font-mono' : ''}`}>{value}</p>
    </div>
  )
}

function ChartCard({ title, children }) {
  return (
    <div className="rounded-2xl border border-edge bg-surface p-4">
      <p className="mb-3 text-sm font-medium text-ink">{title}</p>
      {children}
    </div>
  )
}

// Diagramme a barres verticales (valeurs entre 0 et `max`).
function BarChart({ data, max = 1, refLine = null }) {
  const W = 380
  const H = 160
  const pad = { l: 28, r: 8, t: 8, b: 34 }
  const pw = W - pad.l - pad.r
  const ph = H - pad.t - pad.b
  const bw = pw / data.length
  const yOf = (v) => pad.t + ph - (v / max) * ph
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full">
      {[0, 0.25, 0.5, 0.75, 1].map((t) => (
        <g key={t}>
          <line x1={pad.l} y1={yOf(t * max)} x2={W - pad.r} y2={yOf(t * max)} stroke="#243049" strokeWidth="1" />
          <text x={pad.l - 5} y={yOf(t * max) + 3} textAnchor="end" fontSize="8" fill="#9AA6B8">{(t * max).toFixed(2).replace('.', ',')}</text>
        </g>
      ))}
      {refLine != null && (
        <line x1={pad.l} y1={yOf(refLine)} x2={W - pad.r} y2={yOf(refLine)} stroke="#3B82F6" strokeWidth="1" strokeDasharray="3 3" />
      )}
      {data.map((d, i) => {
        const h = Number.isNaN(d.value) ? 0 : (d.value / max) * ph
        const isComposite = i >= 3
        return (
          <g key={d.label}>
            <rect
              x={pad.l + i * bw + bw * 0.15}
              y={pad.t + ph - h}
              width={bw * 0.7}
              height={h}
              fill={isComposite ? '#3B82F6' : '#16A34A'}
              opacity="0.85"
              rx="2"
            />
            <text x={pad.l + i * bw + bw / 2} y={H - 20} textAnchor="middle" fontSize="8" fill="#E5E9F0">{d.label.split(' ')[0]}</text>
            <text x={pad.l + i * bw + bw / 2} y={H - 9} textAnchor="middle" fontSize="8" fill="#9AA6B8">{fmt(d.value)}</text>
          </g>
        )
      })}
    </svg>
  )
}

// Histogramme simple d'une liste de valeurs.
function Histogram({ values, min, max, bins }) {
  const W = 380
  const H = 160
  const pad = { l: 24, r: 8, t: 8, b: 26 }
  const pw = W - pad.l - pad.r
  const ph = H - pad.t - pad.b
  const counts = new Array(bins).fill(0)
  const step = (max - min) / bins
  values.forEach((v) => {
    if (typeof v !== 'number' || Number.isNaN(v)) return
    let idx = Math.floor((v - min) / step)
    idx = Math.max(0, Math.min(bins - 1, idx))
    counts[idx]++
  })
  const maxC = Math.max(1, ...counts)
  const bw = pw / bins
  const zeroX = pad.l + ((0 - min) / (max - min)) * pw
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full">
      {counts.map((c, i) => {
        const h = (c / maxC) * ph
        const binCenter = min + (i + 0.5) * step
        return (
          <rect
            key={i}
            x={pad.l + i * bw + 1}
            y={pad.t + ph - h}
            width={bw - 2}
            height={h}
            fill={binCenter > 0 ? '#16A34A' : binCenter < 0 ? '#DC2626' : '#9AA6B8'}
            opacity="0.85"
            rx="2"
          />
        )
      })}
      {/* axe 0 */}
      <line x1={zeroX} y1={pad.t} x2={zeroX} y2={pad.t + ph} stroke="#E5E9F0" strokeWidth="1" strokeDasharray="2 2" />
      <text x={pad.l} y={H - 8} fontSize="8" fill="#9AA6B8">{min}</text>
      <text x={zeroX} y={H - 8} textAnchor="middle" fontSize="8" fill="#E5E9F0">0</text>
      <text x={W - pad.r} y={H - 8} textAnchor="end" fontSize="8" fill="#9AA6B8">{max}</text>
    </svg>
  )
}
