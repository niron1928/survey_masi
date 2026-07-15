// =====================================================================
// Configuration globale du questionnaire.
// Centralise les parametres ajustables sans toucher au reste du code.
// =====================================================================

// Montant hypothetique du gain (en DH) propose dans chaque pari.
export const REWARD = 200

// Paliers de probabilite p (en %) de l'urne (Option B).
//  - Mode "standard" (cahier des charges) : 20, 40, 60, 80.
//  - Mode "fin" : decommentez la ligne 10..90 pour une mesure plus precise.
export const P_STEPS = [20, 35, 40, 50, 60, 85]
// export const P_STEPS = [10, 20, 30, 40, 50, 60, 70, 80, 90] // mode fin

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
