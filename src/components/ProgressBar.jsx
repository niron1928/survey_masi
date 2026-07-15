// Barre de progression stylee comme un "cours de bourse" :
// une ligne ascendante avec un point qui avance selon l'avancement.
export default function ProgressBar({ current, total }) {
  const pct = total > 1 ? (current / (total - 1)) * 100 : 0
  const clamped = Math.max(0, Math.min(100, pct))

  return (
    <div className="w-full" aria-hidden="true">
      <div className="mb-1 flex items-center justify-between font-mono text-[11px] text-muted">
        <span>PROGRESSION</span>
        <span>{Math.round(clamped)}%</span>
      </div>
      <div className="relative h-8">
        {/* Ligne de reference */}
        <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 24">
          {/* Ligne "cours" ascendante en pointilles (fond) */}
          <line x1="0" y1="20" x2="100" y2="4" stroke="#243049" strokeWidth="0.6" strokeDasharray="2 2" />
          {/* Portion parcourue en vert */}
          <line
            x1="0"
            y1="20"
            x2={clamped}
            y2={20 - (clamped / 100) * 16}
            stroke="#16A34A"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </svg>
        {/* Point courant */}
        <div
          className="absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-up shadow-[0_0_10px_2px_rgba(22,163,74,0.6)] transition-all duration-300"
          style={{ left: `${clamped}%`, top: `${((20 - (clamped / 100) * 16) / 24) * 100}%` }}
        />
      </div>
    </div>
  )
}
