import { useState } from 'react'
import Candlestick from '../components/Candlestick.jsx'
import Urne from '../components/Urne.jsx'
import OrderButton from '../components/OrderButton.jsx'
import { NavButtons } from './Screen1Profile.jsx'
import { P_STEPS } from '../config.js'

// Ecran 3.x : UNE liste de choix pour UN evenement.
//
// MODE LIBRE (choix laisse entierement au participant) :
//  - chaque ligne se coche INDEPENDAMMENT ; aucun remplissage automatique,
//    aucune correction. Le participant est libre pour chaque ligne.
//  - toutes les lignes doivent etre renseignees avant de continuer.
//  - la matching probability et l'eventuelle incoherence (bascule multiple)
//    sont calculees en aval, a partir des choix bruts (voir lib/indices.js).
//
// Props :
//  - event    : { code, name, cond, optionA, tone }
//  - index    : rang d'affichage (1..6)
//  - total    : nombre total de tableaux (6)
//  - choices  : tableau des choix par ligne ('A'|'B'|null), longueur = P_STEPS
//  - onChoose : (rowIndex, option) => void   (met a jour UNE seule ligne)
//  - onNext / onBack
export default function Screen3Ambiguity({ event, index, total, choices, onChoose, onNext, onBack }) {
  const [error, setError] = useState('')
  const rows = choices ?? P_STEPS.map(() => null)

  function choose(i, option) {
    onChoose(i, option)
    setError('')
  }

  function handleNext() {
    const answered = rows.every((c) => c === 'A' || c === 'B')
    if (!answered) {
      setError('Merci de faire un choix (marché ou urne) sur chacune des lignes.')
      return
    }
    onNext()
  }

  const accent =
    {
      down: 'text-down border-down/50 bg-down/10',
      up: 'text-up border-up/50 bg-up/10',
      flat: 'text-info border-info/50 bg-info/10',
      mix: 'text-info border-info/50 bg-info/10',
    }[event.tone] || 'text-info border-info/50 bg-info/10'

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="font-mono text-xs uppercase tracking-widest text-info">
          Tableau {index} / {total}
        </p>
        <span className={`rounded-full border px-3 py-1 font-mono text-xs ${accent}`}>
          {event.name} · {event.cond}
        </span>
      </div>

      {/* Rappel des deux options */}
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-up/40 bg-surface p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-up">OPTION A · MARCHÉ</span>
            <span className="font-mono text-[11px] text-muted">prob. inconnue</span>
          </div>
          <div className="mb-3 h-14 rounded-lg border border-edge bg-black/30 p-1">
            <Candlestick tone={event.tone} bars={12} />
          </div>
          <p className="text-sm text-ink">{event.optionA}</p>
        </div>
        <div className="rounded-2xl border border-info/40 bg-surface p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-info">OPTION B · URNE</span>
            <span className="font-mono text-[11px] text-muted">prob. connue</span>
          </div>
          <p className="text-sm text-ink">
            Gagner <strong>200 DH</strong> si une boule <span className="text-up">verte</span> sort
            d’une urne de 100 boules. La probabilité change à chaque ligne ci-dessous.
          </p>
        </div>
      </div>

      <p className="mt-4 text-sm text-muted">
        Pour chaque ligne, indiquez ce que vous préférez : parier sur le marché (Option A) ou sur
        l’urne (Option B). <strong className="text-ink">Vous êtes libre de choisir chaque ligne.</strong>
      </p>

      {/* La liste de choix, ligne par ligne (choix independant) */}
      <div className="mt-3 grid gap-3">
        {P_STEPS.map((p, i) => {
          const sel = rows[i]
          return (
            <div
              key={p}
              className="grid grid-cols-[auto,1fr,1fr] items-center gap-3 rounded-xl border border-edge bg-black/20 p-3"
            >
              {/* Illustration de l'urne pour ce palier */}
              <div className="hidden sm:block">
                <Urne p={p} size={70} />
              </div>
              {/* Bouton Option A */}
              <OrderButton
                variant="market"
                active={sel === 'A'}
                onClick={() => choose(i, 'A')}
                aria-label={`Ligne ${p} %, parier sur le marché (Option A)`}
              >
                <span className="block text-[11px] font-normal text-muted">
                  urne à {p} % — je préfère
                </span>
                PARIER SUR LE MARCHÉ
              </OrderButton>
              {/* Bouton Option B */}
              <OrderButton
                variant="urn"
                active={sel === 'B'}
                onClick={() => choose(i, 'B')}
                aria-label={`Ligne ${p} %, parier sur l'urne (Option B), probabilité ${p} %`}
              >
                <span className="block text-[11px] font-normal text-muted">
                  urne à {p} % ({p} vertes) — je préfère
                </span>
                PARIER SUR L’URNE
              </OrderButton>
            </div>
          )
        })}
      </div>

      {error && <p className="mt-4 text-sm text-down">{error}</p>}

      <NavButtons onBack={onBack} onNext={handleNext} />
    </div>
  )
}
