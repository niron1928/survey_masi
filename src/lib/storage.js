// =====================================================================
// Persistance locale (localStorage) :
//  - reprise de la progression apres un rafraichissement de page ;
//  - accumulation des reponses completees (une ligne par participant).
// =====================================================================

// NB : la version est incrementee (v2) apres le passage au mode "choix libre".
// Cela invalide automatiquement une progression sauvegardee dans l'ancien
// format (evite tout plantage lie a un modele de donnees obsolete).
const PROGRESS_KEY = 'masi_progress_v2'   // etat en cours de la session
const RESPONSES_KEY = 'masi_responses_v1' // toutes les reponses terminees

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
