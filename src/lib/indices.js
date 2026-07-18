// =====================================================================
// Coeur scientifique : calcul des "matching probabilities" et des indices
// d'attitude face a l'ambiguite (Baillon, Huang, Selim & Wakker, 2018).
//
// Toutes les fonctions sont PURES (pas d'effet de bord) pour etre
// facilement testables (voir indices.test.js).
// =====================================================================

/**
 * Convertit un point de bascule (switchPoint) en matching probability m.
 *
 * Le participant preference l'Option A (le marche) pour les p faibles,
 * puis bascule vers l'Option B (l'urne) a partir d'un certain palier.
 * `switchPoint` = index du PREMIER palier ou l'Option B est choisie.
 *   - switchPoint = 0                -> B des le 1er palier (toutes B)
 *   - switchPoint = pSteps.length    -> jamais de B (toutes A)
 *
 * m = milieu entre le dernier p choisi "A" et le premier p choisi "B".
 * Conventions des cas limites (cf. cahier des charges 6.4) :
 *   - B des 20 %      -> m = (0 + 20)/2  = 10 %
 *   - A jusqu'a 80 %  -> m = (80 + 100)/2 = 90 %
 *
 * @param {number} switchPoint  index de bascule dans pSteps (0..length)
 * @param {number[]} pSteps     paliers en % (ex. [20,40,60,80])
 * @returns {number} m dans [0,1]
 */
export function matchingProbability(switchPoint, pSteps) {
  const lastA = switchPoint > 0 ? pSteps[switchPoint - 1] : 0
  const firstB = switchPoint < pSteps.length ? pSteps[switchPoint] : 100
  return (lastA + firstB) / 2 / 100
}

/**
 * Detecte une incoherence dans une suite brute de choix ('A'/'B').
 * Une reponse coherente a la forme A...A B...B (bascule unique).
 * Retourne true si un 'A' apparait APRES un 'B' (bascule multiple).
 *
 * Remarque : l'interface impose structurellement la bascule unique,
 * donc ce cas ne survient jamais via l'UI. La fonction sert au controle
 * de donnees importees et aux tests.
 *
 * @param {('A'|'B')[]} choices
 * @returns {boolean}
 */
export function detectIncoherent(choices) {
  let seenB = false
  for (const c of choices) {
    if (c === 'B') seenB = true
    else if (c === 'A' && seenB) return true
  }
  return false
}

/**
 * Derive la matching probability et l'incoherence a partir d'une suite
 * BRUTE de choix libres ('A'/'B'), telle que saisie ligne par ligne par
 * le participant (mode libre, sans bascule imposee).
 *
 * Convention : le "point de bascule" retenu = nombre de fois ou l'Option A
 * (le marche) a ete preferee. Pour une reponse coherente A...A B...B, ce
 * nombre est exactement l'index du premier "B" ; m suit alors la meme regle
 * que matchingProbability(). Pour une reponse incoherente (bascule multiple),
 * la valeur reste definie mais l'indicateur `incoherent` est leve : a
 * l'analyse, le chercheur peut filtrer ou traiter ces reponses a part.
 *
 * @param {('A'|'B'|null)[]} choices  choix par ligne (meme longueur que pSteps)
 * @param {number[]} pSteps           paliers en % (ex. [20,40,60,80])
 * @returns {{switchPoint:number, m:number, incoherent:boolean, complete:boolean}}
 */
export function fromRawChoices(choices, pSteps) {
  const complete = choices.length === pSteps.length && choices.every((c) => c === 'A' || c === 'B')
  const countA = choices.filter((c) => c === 'A').length
  return {
    switchPoint: countA,
    m: matchingProbability(countA, pSteps),
    incoherent: detectIncoherent(choices.filter(Boolean)),
    complete,
  }
}

/** Moyenne arithmetique d'un tableau de nombres. */
export function mean(arr) {
  if (!arr.length) return 0
  return arr.reduce((s, x) => s + x, 0) / arr.length
}

/**
 * Calcule les indices agreges a partir des 6 matching probabilities.
 *
 * @param {{E1:number,E2:number,E3:number,E1E2:number,E1E3:number,E2E3:number}} m
 * @returns {{m_s:number, m_c:number, indice_b:number, indice_a:number}}
 */
export function computeIndices(m) {
  // Evenements simples (une seule des trois situations)
  const m_s = mean([m.E1, m.E2, m.E3])
  // Evenements composes (union de deux situations)
  const m_c = mean([m.E1E2, m.E1E3, m.E2E3])

  // indice b : aversion a l'ambiguite (b > 0 = averse)
  const indice_b = 1 - m_c - m_s
  // indice a : insensibilite a la vraisemblance (a > 0 = insensible)
  const indice_a = 1 - 3 * (m_c - m_s)

  return { m_s, m_c, indice_b, indice_a }
}

/**
 * Contrôle de monotonie de Baillon : un événement composé (union)
 * doit avoir une matching probability au moins égale à chacun de
 * ses deux événements simples constituants.
 *
 * Vérifie les 6 inégalités :
 *   m(E1∪E2) ≥ m(E1),  m(E1∪E2) ≥ m(E2)
 *   m(E1∪E3) ≥ m(E1),  m(E1∪E3) ≥ m(E3)
 *   m(E2∪E3) ≥ m(E2),  m(E2∪E3) ≥ m(E3)
 *
 * @param {{E1:number,E2:number,E3:number,E1E2:number,E1E3:number,E2E3:number}} m
 * @returns {number} nombre de violations (0 à 6)
 */
export function countMonotonicityViolations(m) {
  let v = 0
  if (m.E1E2 < m.E1) v++
  if (m.E1E2 < m.E2) v++
  if (m.E1E3 < m.E1) v++
  if (m.E1E3 < m.E3) v++
  if (m.E2E3 < m.E2) v++
  if (m.E2E3 < m.E3) v++
  return v
}

// Codes des 6 evenements dans l'ordre canonique (pour l'export CSV).
export const EVENT_CODES = ['E1', 'E2', 'E3', 'E1E2', 'E1E3', 'E2E3']
