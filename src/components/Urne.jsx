// Urne interactive : 100 boules disposees en grille 10x10.
// `p` (0..100) = nombre de boules VERTES (gain), le reste en ROUGE.
// La composition reflete visuellement la probabilite connue de l'Option B.
export default function Urne({ p, size = 132 }) {
  const green = Math.round(p)
  const balls = Array.from({ length: 100 }, (_, i) => i < green)

  return (
    <div className="flex flex-col items-center">
      <div
        className="grid gap-[3px] rounded-2xl border border-edge bg-black/30 p-2"
        style={{ gridTemplateColumns: 'repeat(10, 1fr)', width: size, height: size }}
        role="img"
        aria-label={`Urne de 100 boules : ${green} vertes et ${100 - green} rouges (probabilité de gagner ${green} %)`}
      >
        {balls.map((isGreen, i) => (
          <div
            key={i}
            className={`rounded-full ${isGreen ? 'bg-up' : 'bg-down'}`}
            style={{ aspectRatio: '1 / 1', opacity: isGreen ? 0.95 : 0.55 }}
          />
        ))}
      </div>
      <div className="mt-2 font-mono text-xs text-muted">
        <span className="text-up">{green} vertes</span> / <span className="text-down">{100 - green} rouges</span>
      </div>
    </div>
  )
}
