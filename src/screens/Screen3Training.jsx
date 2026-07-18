import { useState } from 'react'
import Urne from '../components/Urne.jsx'
import OrderButton from '../components/OrderButton.jsx'
import { NavButtons } from './Screen1Profile.jsx'
import { P_STEPS_SIMPLE } from '../config.js'
import { detectIncoherent } from '../lib/indices.js'

// Ecran d'entrainement : un tableau d'exercice avec un evenement neutre
// (meteo) pour familiariser le participant avec le mecanisme de choix
// AVANT les vrais tableaux d'ambiguite sur le MASI.

const TRAINING_EVENT = {
  name: 'Entraînement',
  optionA: `Vous gagnez 200 DH s'il pleut à Casablanca demain.`,
}

export default function Screen3Training({ onNext, onBack }) {
  const [choices, setChoices] = useState(() => P_STEPS_SIMPLE.map(() => null))
  const [error, setError] = useState('')
  const [showFeedback, setShowFeedback] = useState(false)

  function choose(i, option) {
    setChoices((prev) => {
      const next = [...prev]
      next[i] = option
      return next
    })
    setError('')
  }

  function handleNext() {
    const answered = choices.every((c) => c === 'A' || c === 'B')
    if (!answered) {
      setError('Merci de faire un choix (météo ou urne) sur chacune des lignes.')
      return
    }
    setShowFeedback(true)
  }

  // --- Calcul du feedback ---
  const incoherent = detectIncoherent(choices.filter(Boolean))
  const firstBIndex = choices.indexOf('B')
  const switchP = firstBIndex >= 0 ? P_STEPS_SIMPLE[firstBIndex] : null

  if (showFeedback) {
    return (
      <div>
        {/* Banniere d'entrainement */}
        <div className="mb-4 rounded-xl border border-yellow-500/40 bg-yellow-500/10 px-4 py-3 text-center font-mono text-sm text-yellow-400">
          ⚠ ENTRAÎNEMENT — Cette réponse n'est PAS enregistrée
        </div>

        <div className="rounded-2xl border border-edge bg-surface p-6">
          {incoherent ? (
            <div className="space-y-4">
              <p className="text-sm leading-relaxed text-ink">
                {`Vous avez changé d'avis plusieurs fois. Dans l'idéal, on s'attend à un seul point de basculement : le pari météo tant que l'urne offre peu, puis l'urne au-delà d'un certain niveau. Pas d'inquiétude, c'est un entraînement !`}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm leading-relaxed text-ink">
                {switchP != null ? (
                  <>
                    {`Vous avez préféré le pari météo tant que l'urne offrait moins de `}
                    <strong className="text-info">{switchP} %</strong>
                    {`, puis l'urne au-delà. C'est exactement ce qui est attendu : un seul point de basculement. Les tableaux suivants fonctionnent de la même façon.`}
                  </>
                ) : (
                  /* Cas ou le participant a choisi A partout */
                  <>
                    {`Vous avez toujours préféré le pari météo. C'est tout à fait possible. Les tableaux suivants fonctionnent de la même façon.`}
                  </>
                )}
              </p>
            </div>
          )}

          <button
            type="button"
            onClick={onNext}
            className="mt-6 w-full rounded-xl border border-info bg-info/20 px-6 py-3 text-sm font-bold text-info transition-all hover:bg-info/30"
          >
            {`J'ai compris, passer aux vrais tableaux ▸`}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Banniere d'entrainement */}
      <div className="mb-4 rounded-xl border border-yellow-500/40 bg-yellow-500/10 px-4 py-3 text-center font-mono text-sm text-yellow-400">
        ⚠ ENTRAÎNEMENT — Cette réponse n'est PAS enregistrée
      </div>

      <div className="mb-4 flex items-center justify-between">
        <p className="font-mono text-xs uppercase tracking-widest text-info">
          Exercice pratique
        </p>
        <span className="rounded-full border border-yellow-500/40 bg-yellow-500/10 px-3 py-1 font-mono text-xs text-yellow-400">
          {TRAINING_EVENT.name}
        </span>
      </div>

      {/* Rappel des deux options */}
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-up/40 bg-surface p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-up">OPTION A · MÉTÉO</span>
            <span className="font-mono text-[11px] text-muted">prob. inconnue</span>
          </div>
          <div className="mb-3 flex h-14 items-center justify-center rounded-lg border border-edge bg-black/30 text-3xl">
            ☁️🌧️
          </div>
          <p className="text-sm text-ink">{TRAINING_EVENT.optionA}</p>
        </div>
        <div className="rounded-2xl border border-info/40 bg-surface p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-info">OPTION B · URNE</span>
            <span className="font-mono text-[11px] text-muted">prob. connue</span>
          </div>
          <p className="text-sm text-ink">
            Gagner <strong>200 DH</strong> si une boule <span className="text-up">verte</span> sort
            {` d'une urne de 100 boules. La probabilité change à chaque ligne ci-dessous.`}
          </p>
        </div>
      </div>

      <p className="mt-4 text-sm text-muted">
        Pour chaque ligne, indiquez ce que vous préférez : parier sur la météo (Option A) ou sur
        {` l'urne (Option B). `}<strong className="text-ink">Vous êtes libre de choisir chaque ligne.</strong>
      </p>

      {/* La liste de choix, ligne par ligne */}
      <div className="mt-3 grid gap-3">
        {P_STEPS_SIMPLE.map((p, i) => {
          const sel = choices[i]
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
                aria-label={`Ligne ${p} %, parier sur la météo (Option A)`}
              >
                <span className="block text-[11px] font-normal text-muted">
                  urne à {p} % — je préfère
                </span>
                PARIER SUR LA MÉTÉO
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
                {`PARIER SUR L'URNE`}
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
