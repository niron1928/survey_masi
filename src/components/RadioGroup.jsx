// Groupe de choix unique reutilisable (Parties 1 et 2).
// Rendu accessible : role="radiogroup" + boutons role="radio".
export default function RadioGroup({ legend, options, value, onChange, name }) {
  return (
    <fieldset className="animate-fadeUp">
      <legend className="mb-3 block text-base font-medium text-ink">{legend}</legend>
      <div className="grid gap-2" role="radiogroup" aria-label={legend}>
        {options.map((opt) => {
          const selected = value === opt
          return (
            <button
              key={opt}
              type="button"
              role="radio"
              aria-checked={selected}
              name={name}
              onClick={() => onChange(opt)}
              className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-all duration-150 ${
                selected
                  ? 'border-info bg-info/15 text-ink'
                  : 'border-edge bg-surface text-ink hover:border-info/50 hover:bg-info/5'
              }`}
            >
              <span
                className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                  selected ? 'border-info' : 'border-muted'
                }`}
              >
                {selected && <span className="h-2 w-2 rounded-full bg-info" />}
              </span>
              <span>{opt}</span>
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}
