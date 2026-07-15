import Candlestick from '../components/Candlestick.jsx'
import Urne from '../components/Urne.jsx'
import { SectionTitle, NavButtons } from './Screen1Profile.jsx'

// Ecran 3.1 : introduction du contexte de la mesure d'ambiguite.
export default function Screen3Intro({ onNext, onBack }) {
  return (
    <div>
      <SectionTitle step="Partie 3 / 4" title="Le MASI dans les 6 prochains mois" />

      <div className="relative overflow-hidden rounded-2xl border border-edge bg-surface p-5">
        <div className="pointer-events-none absolute inset-0 opacity-20">
          <Candlestick tone="mix" bars={26} />
        </div>
        <div className="relative leading-relaxed text-ink">
          <p>
            Le <strong>MASI</strong> (Moroccan All Shares Index) est l’indice principal de la
            Bourse de Casablanca : il reflète l’évolution de l’ensemble des actions cotées. On
            s’intéresse à son évolution <strong>du 1er juillet 2026 au 31 décembre 2026</strong>{' '}
            (les 6 prochains mois). Trois situations sont possibles, et <strong>une seule</strong>{' '}
            se réalisera :
          </p>
          <ul className="mt-4 grid gap-2">
            <li className="rounded-lg border border-down/40 bg-down/10 px-3 py-2">
              <span className="font-semibold text-down">Baisse (E1)</span>
              <span className="text-muted"> — le MASI baisse de plus de 2 % </span>
              <span className="font-mono text-sm text-down">(R &lt; −2 %)</span>
            </li>
            <li className="rounded-lg border border-info/40 bg-info/10 px-3 py-2">
              <span className="font-semibold text-info">Stabilité (E2)</span>
              <span className="text-muted"> — le MASI varie entre −2 % et +8 % </span>
              <span className="font-mono text-sm text-info">(−2 % ≤ R ≤ +8 %)</span>
            </li>
            <li className="rounded-lg border border-up/40 bg-up/10 px-3 py-2">
              <span className="font-semibold text-up">Hausse (E3)</span>
              <span className="text-muted"> — le MASI augmente de plus de 8 % </span>
              <span className="font-mono text-sm text-up">(R &gt; +8 %)</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Regle du jeu : comment lire les deux options */}
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-edge bg-surface p-4">
          <div className="mb-2 flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-up">OPTION A · BOURSE</span>
          </div>
          <div className="mb-2 h-16 rounded-lg border border-edge bg-black/30 p-1">
            <Candlestick tone="mix" bars={12} />
          </div>
          <p className="text-sm text-muted">
            Gagner <strong className="text-ink">200 DH</strong> si un événement boursier se réalise.
            La probabilité exacte est <strong>inconnue</strong>.
          </p>
        </div>
        <div className="rounded-2xl border border-edge bg-surface p-4">
          <div className="mb-2 flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-info">OPTION B · URNE</span>
          </div>
          <div className="mb-2 flex justify-center">
            <Urne p={60} size={92} />
          </div>
          <p className="text-sm text-muted">
            Gagner <strong className="text-ink">200 DH</strong> si une boule verte sort d’une urne.
            La probabilité est <strong>connue</strong>.
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-xl border border-edge bg-black/20 p-4 text-sm text-muted">
        Dans chaque tableau, choisissez ligne par ligne entre l’Option A et l’Option B. Vous ne
        passez de A à B <strong className="text-ink">qu’une seule fois</strong> : dès que l’urne
        devient assez avantageuse, vous basculez. Il y a <strong className="text-ink">6 tableaux</strong>.
      </div>

      <NavButtons onBack={onBack} onNext={onNext} nextLabel="Commencer les tableaux ▸" />
    </div>
  )
}
