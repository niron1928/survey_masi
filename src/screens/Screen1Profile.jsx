import { useState } from 'react'
import RadioGroup from '../components/RadioGroup.jsx'
import { PROFILE_QUESTIONS } from '../data/questions.js'

// Ecran 1 : Partie 1 - profil socio-economique.
export default function Screen1Profile({ data, update, onNext, onBack }) {
  const [error, setError] = useState('')

  function handleNext() {
    const missing = PROFILE_QUESTIONS.find((q) => !data[q.key])
    if (missing) {
      setError('Merci de répondre à toutes les questions avant de continuer.')
      return
    }
    setError('')
    onNext()
  }

  return (
    <div>
      <SectionTitle step="Partie 1 / 4" title="Votre profil" />
      <div className="grid gap-6">
        {PROFILE_QUESTIONS.map((q) => (
          <RadioGroup
            key={q.key}
            name={q.key}
            legend={q.label}
            options={q.options}
            value={data[q.key] || ''}
            onChange={(v) => update({ [q.key]: v })}
          />
        ))}
      </div>

      {error && <p className="mt-4 text-sm text-down">{error}</p>}

      <NavButtons onBack={onBack} onNext={handleNext} />
    </div>
  )
}

// Petit sous-composant de titre de section, reutilise par les ecrans.
export function SectionTitle({ step, title }) {
  return (
    <div className="mb-6">
      <p className="font-mono text-xs uppercase tracking-widest text-info">{step}</p>
      <h2 className="mt-1 text-2xl font-bold text-ink">{title}</h2>
    </div>
  )
}

// Barre de navigation Precedent / Continuer, reutilisee par les ecrans.
export function NavButtons({ onBack, onNext, nextLabel = 'Continuer ▸', disabled = false }) {
  return (
    <div className="mt-8 flex items-center justify-between gap-3">
      {onBack ? (
        <button
          type="button"
          onClick={onBack}
          className="rounded-xl border border-edge bg-surface px-5 py-3 text-sm text-muted transition-colors hover:text-ink"
        >
          ◂ Précédent
        </button>
      ) : (
        <span />
      )}
      <button
        type="button"
        onClick={onNext}
        disabled={disabled}
        className="rounded-xl border border-info bg-info/20 px-6 py-3 text-sm font-bold text-info transition-all hover:bg-info/30 disabled:cursor-not-allowed disabled:border-edge disabled:bg-surface disabled:text-muted"
      >
        {nextLabel}
      </button>
    </div>
  )
}
