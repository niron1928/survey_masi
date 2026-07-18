// =====================================================================
// Configuration globale du questionnaire.
// Centralise les parametres ajustables sans toucher au reste du code.
// =====================================================================

// Montant hypothetique du gain (en DH) propose dans chaque pari.
export const REWARD = 200

// Paliers de probabilité (%) de l'urne (Option B).
// Deux échelles distinctes (Baillon et al. 2018) :
//  - SIMPLES : centrées autour de 1/3 (~0.33), pour E1, E2, E3
//  - COMPOSÉS : centrées autour de 2/3 (~0.67), pour E1∪E2, E1∪E3, E2∪E3
export const P_STEPS_SIMPLE = [5, 10, 20, 30, 40, 50, 65, 80]
export const P_STEPS_COMPOSE = [20, 35, 50, 60, 70, 80, 90, 95]

// Codes des événements simples (pour choisir la bonne échelle).
const SIMPLES = new Set(['E1', 'E2', 'E3'])

/** Retourne le tableau de paliers adapté au type d'événement. */
export function pStepsFor(code) {
  return SIMPLES.has(code) ? P_STEPS_SIMPLE : P_STEPS_COMPOSE
}

// -----------------------------------------------------------------
// Envoi optionnel des reponses a un backend (voir README, section 8).
// Laisser BACKEND_URL vide ('') pour desactiver : les reponses restent
// alors uniquement en local (localStorage) + export CSV manuel.
// Exemple : 'https://formspree.io/f/xxxxxxx' ou votre propre API.
// -----------------------------------------------------------------
export const BACKEND_URL = ''

// Horizon d'evaluation affiche au participant.
export const HORIZON = {
  debut: '1er juillet 2026',
  fin: '31 décembre 2026',
}

// -----------------------------------------------------------------
// Cle d'acces au TABLEAU DE BORD chercheur (voir README).
// Seule une personne connaissant cette cle peut consulter et exporter
// les donnees, via l'adresse :  .../#tableau-de-bord
// >>> CHANGEZ cette valeur avant de diffuser le questionnaire <<<
// -----------------------------------------------------------------
export const RESEARCHER_KEY = 'ZBASALAH-2026'

// Ancre d'URL qui ouvre le tableau de bord (ex. http://localhost:5173/#tableau-de-bord)
export const DASHBOARD_HASH = 'tableau-de-bord'
