import { useState } from 'react'
import RadioGroup from '../components/RadioGroup.jsx'
import { SectionTitle, NavButtons } from './Screen1Profile.jsx'
import { FINAL_QUESTIONS } from '../data/questions.js'

// Ecran 4 : Partie 4 - questions finales (revenu + intention d'investir).
// Utilise desormais la NOTATION DIRECTE (RadioGroup) au lieu de l'echelle
// d'accord / pas d'accord (Fowler, 2014 : moins de validite, biais
// d'acquiescement). Le revenu est place en fin conformement aux bonnes
// pratiques (question sensible).
export default function Screen4Final({ data, update, onNext, onBack }) {
  const [error, setError] = useState('')

  function handleNext() {
    const missing = FINAL_QUESTIONS.find((q) => !data[q.key])
    if (missing) {
      setError('Merci de répondre à toutes les questions avant de terminer.')
      return
    }
    setError('')
    onNext()
  }

  return (
    <div>
      <SectionTitle step="Partie 4 / 4" title="Pour finir" />
      <p className="mb-6 text-sm text-muted">
        Merci de répondre à ces dernières questions.
      </p>

      <div className="grid gap-6">
        {FINAL_QUESTIONS.map((q) => (
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

      <NavButtons onBack={onBack} onNext={handleNext} nextLabel="Terminer ▸" />
    </div>
  )
}
