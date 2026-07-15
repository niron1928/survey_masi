import MasiChart from '../components/MasiChart.jsx'
import { SectionTitle, NavButtons } from './Screen1Profile.jsx'

// Ecran d'introduction pedagogique : "Qu'est-ce que le MASI ?"
// Affiche au tout debut de l'experience, avant le profil.
export default function Screen0bMasiIntro({ onNext, onBack }) {
  return (
    <div>
      <SectionTitle step="Avant de commencer" title="Qu’est-ce que le MASI ?" />

      <div className="rounded-2xl border border-edge bg-surface p-5 leading-relaxed text-ink">
        <p>
          Le <strong>MASI</strong> (<span className="italic">Moroccan All Shares Index</span>) est
          l’indice principal de la <strong>Bourse de Casablanca</strong>. Il regroupe l’ensemble des
          actions cotées et sert de « thermomètre » du marché : quand la plupart des entreprises
          montent, le MASI monte ; quand elles baissent, il baisse.
        </p>
        <p className="mt-3">
          On l’exprime en <strong>points</strong>. Ce n’est pas le prix d’une seule action, mais une
          moyenne qui résume la tendance générale. Les investisseurs le suivent pour savoir si le
          marché marocain se porte globalement bien ou mal.
        </p>
      </div>

      {/* Le graphique fourni, reproduit fidelement */}
      <div className="mt-5">
        <MasiChart />
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <FactCard color="up" title="Sur 12 ans" text="Le MASI est passé d’environ 9 100 points (2013) à près de 20 000 points (2025)." />
        <FactCard color="down" title="Des à-coups" text="Il connaît aussi des reculs : choc Covid en 2020, chute d’environ 20 % en 2022." />
        <FactCard color="info" title="Rien n’est garanti" text="Personne ne connaît à l’avance son évolution future : c’est tout l’enjeu de cette étude." />
      </div>

      <p className="mt-5 text-sm text-muted">
        Dans la suite, nous vous poserons quelques questions, puis nous vous proposerons des paris
        hypothétiques sur l’évolution du MASI dans les 6 prochains mois. Gardez simplement en tête
        que le MASI <strong className="text-ink">peut monter comme descendre</strong>.
      </p>

      <NavButtons onBack={onBack} onNext={onNext} nextLabel="J’ai compris ▸" />
    </div>
  )
}

function FactCard({ color, title, text }) {
  const tone = {
    up: 'border-up/40 text-up',
    down: 'border-down/40 text-down',
    info: 'border-info/40 text-info',
  }[color]
  return (
    <div className={`rounded-xl border ${tone} bg-black/20 p-3`}>
      <p className="font-mono text-xs font-bold">{title}</p>
      <p className="mt-1 text-sm text-ink">{text}</p>
    </div>
  )
}
