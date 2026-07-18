// =====================================================================
// Persistance locale (localStorage) :
//  - reprise de la progression apres un rafraichissement de page ;
//  - accumulation des reponses completees (une ligne par participant) ;
//  - tracking des abandons (C4).
// =====================================================================

// NB : la version est incrementee (v3) apres la mise aux normes
// scientifiques (deux echelles, nouvelles questions, nouveau flux).
// Cela invalide automatiquement une progression sauvegardee dans
// l'ancien format (evite tout plantage lie a un modele de donnees obsolete).
const PROGRESS_KEY = 'masi_progress_v3'   // etat en cours de la session
const RESPONSES_KEY = 'masi_responses_v2' // toutes les reponses terminees
const ABANDONS_KEY = 'masi_abandons_v1'   // sessions abandonnees (C4)

// ---- Progression de la session en cours -----------------------------

export function saveProgress(state) {
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(state))
  } catch {
    /* stockage indisponible (mode prive) : on ignore silencieusement */
  }
}

export function loadProgress() {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function clearProgress() {
  try {
    localStorage.removeItem(PROGRESS_KEY)
  } catch {
    /* ignore */
  }
}

// ---- Reponses terminees (accumulees sur l'appareil) -----------------

export function getResponses() {
  try {
    const raw = localStorage.getItem(RESPONSES_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

/** Ajoute une reponse terminee et renvoie la liste complete. */
export function appendResponse(response) {
  const all = getResponses()
  all.push(response)
  try {
    localStorage.setItem(RESPONSES_KEY, JSON.stringify(all))
  } catch {
    /* ignore */
  }
  return all
}

export function clearResponses() {
  try {
    localStorage.removeItem(RESPONSES_KEY)
  } catch {
    /* ignore */
  }
}

// ---- C4 : Tracking des abandons -------------------------------------
// Enregistre l'ecran d'abandon quand le participant quitte sans finir.
// Le tableau de bord chercheur peut consulter ces donnees.

export function saveAbandon(info) {
  try {
    const all = getAbandons()
    all.push(info)
    localStorage.setItem(ABANDONS_KEY, JSON.stringify(all))
  } catch {
    /* ignore */
  }
}

export function getAbandons() {
  try {
    const raw = localStorage.getItem(ABANDONS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function clearAbandons() {
  try {
    localStorage.removeItem(ABANDONS_KEY)
  } catch {
    /* ignore */
  }
}
