// Ecran 5 : remerciement uniquement.
// Les participants n'ont acces a aucune donnee ni export : seul le chercheur
// consulte les resultats via le tableau de bord (voir Dashboard + README).
// Un lien discret "Nouveau participant" permet d'enchainer sur un meme
// appareil (mode kiosque).
export default function Screen5End({ onRestart }) {
  return (
    <div className="animate-fadeUp text-center">
      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-up bg-up/15 text-3xl text-up">
        ✓
      </div>
      <h2 className="text-2xl font-bold text-ink">Merci pour votre participation !</h2>
      <p className="mx-auto mt-3 max-w-md text-muted">
        Vos réponses ont bien été enregistrées. Elles resteront anonymes et ne serviront qu’à un
        travail de recherche en économie comportementale.
      </p>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted">
        Vous pouvez fermer cette page. Merci pour le temps que vous nous avez accordé.
      </p>

      {/* Enchainement pour un nouveau participant (utile en mode kiosque). */}
      <button
        type="button"
        onClick={onRestart}
        className="mt-8 rounded-xl border border-info bg-info/15 px-6 py-3 text-sm font-semibold text-info transition-all hover:bg-info/25"
      >
        ↻ Nouveau participant
      </button>
    </div>
  )
}
