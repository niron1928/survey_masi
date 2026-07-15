import { useState } from 'react'
import RadioGroup from '../components/RadioGroup.jsx'
import { SectionTitle, NavButtons } from './Screen1Profile.jsx'
import { LITERACY_QUESTIONS } from '../data/questions.js'

// Ecran 2 : Partie 2 - culture financiere ("Big Three").
// Le score est calcule en aval (App) ; rien n'est jamais affiche au participant.
export default function Screen2Literacy({ data, update, onNext, onBack }) {
  const [error, setError] = useState('')

  function handleNext() {
    const missing = LITERACY_QUESTIONS.find((q) => !data[q.key])
    if (missing) {
      setError('Merci de répondre à toutes les questions avant de continuer.')
      return
    }
    setError('')
    onNext()
  }

  return (
    <div>
      <SectionTitle step="Partie 2 / 4" title="Quelques repères" />
      <p className="mb-6 text-sm text-muted">
        Trois questions rapides. Répondez au mieux ; « Je ne sais pas » est une réponse valable.
      </p>

      <div className="grid gap-6">
        {LITERACY_QUESTIONS.map((q) => (
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
