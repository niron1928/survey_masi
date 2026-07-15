import { useState } from 'react'
import ScaleButtons from '../components/ScaleButtons.jsx'
import { SectionTitle, NavButtons } from './Screen1Profile.jsx'
import { FINAL_QUESTIONS } from '../data/questions.js'

// Ecran 4 : Partie 4 - questions finales (echelle 1 a 5).
export default function Screen4Final({ data, update, onNext, onBack }) {
  const [error, setError] = useState('')

  function handleNext() {
    const missing = FINAL_QUESTIONS.find((q) => !data[q.key])
    if (missing) {
      setError('Merci de répondre aux deux questions avant de terminer.')
      return
    }
    setError('')
    onNext()
  }

  return (
    <div>
      <SectionTitle step="Partie 4 / 4" title="Pour finir" />
      <p className="mb-6 text-sm text-muted">
        Indiquez votre degré d’accord, de 1 (pas du tout d’accord) à 5 (tout à fait d’accord).
      </p>

      <div className="grid gap-8">
        {FINAL_QUESTIONS.map((q) => (
          <ScaleButtons
            key={q.key}
            legend={q.label}
            value={data[q.key] || null}
            onChange={(v) => update({ [q.key]: v })}
          />
        ))}
      </div>

      {error && <p className="mt-4 text-sm text-down">{error}</p>}

      <NavButtons onBack={onBack} onNext={handleNext} nextLabel="Terminer ▸" />
    </div>
  )
}
