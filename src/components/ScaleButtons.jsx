import { SCALE_LABELS } from '../data/questions.js'

// Echelle de Likert 1 a 5 affichee en boutons (Partie 4).
export default function ScaleButtons({ legend, value, onChange }) {
  return (
    <fieldset className="animate-fadeUp">
      <legend className="mb-4 block text-base font-medium text-ink">{legend}</legend>
      <div className="flex items-stretch justify-between gap-2" role="radiogroup" aria-label={legend}>
        {[1, 2, 3, 4, 5].map((n) => {
          const selected = value === n
          return (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={selected}
              aria-label={`${n}${SCALE_LABELS[n] ? ' - ' + SCALE_LABELS[n] : ''}`}
              onClick={() => onChange(n)}
              className={`flex-1 rounded-xl border py-4 font-mono text-lg font-bold transition-all duration-150 ${
                selected
                  ? 'border-info bg-info/20 text-info'
                  : 'border-edge bg-surface text-muted hover:border-info/50 hover:text-ink'
              }`}
            >
              {n}
            </button>
          )
        })}
      </div>
      <div className="mt-2 flex justify-between font-mono text-[11px] text-muted">
        <span>1 · {SCALE_LABELS[1]}</span>
        <span>{SCALE_LABELS[5]} · 5</span>
      </div>
    </fieldset>
  )
}
