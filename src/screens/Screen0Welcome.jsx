import { useState } from 'react'
import Candlestick from '../components/Candlestick.jsx'

// Ecran 0 : accueil et consentement.
export default function Screen0Welcome({ onNext }) {
  const [accepted, setAccepted] = useState(false)

  return (
    <div className="animate-fadeUp">
      <div className="mb-6 flex items-center gap-4">
        <div className="h-16 w-24 shrink-0 rounded-lg border border-edge bg-black/30 p-1">
          <Candlestick tone="up" bars={10} />
        </div>
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-info">
            Étude universitaire · anonyme
          </p>
          <h1 className="mt-1 text-2xl font-bold text-ink sm:text-3xl">
            Vous et l’incertitude des marchés
          </h1>
        </div>
      </div>

      <p className="text-lg text-muted">
        Une courte étude universitaire sur la façon dont nous décidons face à l’inconnu boursier.
      </p>

      <div className="mt-6 rounded-2xl border border-edge bg-surface p-5 leading-relaxed text-ink">
        <p>
          Ce questionnaire est <strong>anonyme</strong> et dure environ{' '}
          <strong>10 minutes</strong>. Il n’y a <strong>ni bonne ni mauvaise réponse</strong>.
          Les sommes évoquées sont <strong>hypothétiques</strong> : aucun gain réel n’est versé,
          mais nous vous invitons à répondre <strong>comme si vous jouiez votre propre argent</strong>.
        </p>
        <p className="mt-3 text-sm text-muted">
          Vos réponses serviront uniquement à un travail de recherche en économie comportementale.
          Aucune donnée personnelle (nom, e-mail…) n’est collectée.
        </p>
      </div>

      <label className="mt-6 flex cursor-pointer items-start gap-3 rounded-xl border border-edge bg-surface p-4">
        <input
          type="checkbox"
          checked={accepted}
          onChange={(e) => setAccepted(e.target.checked)}
          className="mt-0.5 h-5 w-5 accent-info"
        />
        <span className="text-sm text-ink">J’ai lu et j’accepte de participer.</span>
      </label>

      <button
        type="button"
        disabled={!accepted}
        onClick={onNext}
        className="mt-6 w-full rounded-xl border border-up bg-up/20 py-4 text-base font-bold text-up transition-all duration-150 hover:bg-up/30 disabled:cursor-not-allowed disabled:border-edge disabled:bg-surface disabled:text-muted"
      >
        Commencer ▸
      </button>
    </div>
  )
}
