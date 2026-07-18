// =====================================================================
// Tests de la logique des indices (executer avec : npm test).
// Verifie les conventions de matching probability et les profils types
// demandes dans le cahier des charges (section 9).
// =====================================================================
import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  matchingProbability,
  computeIndices,
  detectIncoherent,
  fromRawChoices,
  countMonotonicityViolations,
} from './indices.js'

const P = [20, 40, 60, 80] // paliers legacy (tests existants)
const P_S = [5, 10, 20, 30, 40, 50, 65, 80] // simples
const P_C = [20, 35, 50, 60, 70, 80, 90, 95] // composés

// ---- matching probability : cas nominaux et limites -----------------
test('m : A jusqu\'a 40 %, B des 60 % -> 0.50', () => {
  // switchPoint = 2 (index de 60 % dans [20,40,60,80])
  assert.equal(matchingProbability(2, P), 0.5)
})

test('m : B des le 1er palier (20 %) -> 0.10', () => {
  assert.equal(matchingProbability(0, P), 0.1)
})

test('m : A jusqu\'au dernier palier (80 %) -> 0.90', () => {
  // switchPoint = 4 (= length) : jamais de B
  assert.equal(matchingProbability(4, P), 0.9)
})

test('m : bascule a 40 % -> 0.30 ; a 80 % -> 0.70', () => {
  assert.equal(matchingProbability(1, P), 0.3)
  assert.equal(matchingProbability(3, P), 0.7)
})

// ---- exemple numerique de controle (cahier des charges 6.4) ---------
test('exemple de controle -> b = 0.15, a = 0.25', () => {
  const m = { E1: 0.25, E2: 0.35, E3: 0.3, E1E2: 0.55, E1E3: 0.5, E2E3: 0.6 }
  const r = computeIndices(m)
  assert.ok(Math.abs(r.m_s - 0.3) < 1e-9)
  assert.ok(Math.abs(r.m_c - 0.55) < 1e-9)
  assert.ok(Math.abs(r.indice_b - 0.15) < 1e-9)
  assert.ok(Math.abs(r.indice_a - 0.25) < 1e-9)
})

// ---- profils types --------------------------------------------------
test('profil neutre (simples ~1/3, composes ~2/3) -> b~0 et a~0', () => {
  const t = 1 / 3
  const m = { E1: t, E2: t, E3: t, E1E2: 2 * t, E1E3: 2 * t, E2E3: 2 * t }
  const r = computeIndices(m)
  assert.ok(Math.abs(r.indice_b) < 1e-9, `b=${r.indice_b}`)
  assert.ok(Math.abs(r.indice_a) < 1e-9, `a=${r.indice_a}`)
})

test('profil neutre avec nouvelles echelles P_S/P_C -> b~0 et a faible', () => {
  // Simples : bascule a index 4 (apres 30 %) -> m = (30+40)/200 = 0.35
  const m_s_val = matchingProbability(4, P_S)
  assert.ok(Math.abs(m_s_val - 0.35) < 1e-9, `m_s=${m_s_val}`)
  // Composes : bascule a index 4 (apres 60 %) -> m = (60+70)/200 = 0.65
  const m_c_val = matchingProbability(4, P_C)
  assert.ok(Math.abs(m_c_val - 0.65) < 1e-9, `m_c=${m_c_val}`)
  // Indices : b = 1 - 0.65 - 0.35 = 0, a = 1 - 3*(0.65 - 0.35) = 0.10
  const m = {
    E1: m_s_val, E2: m_s_val, E3: m_s_val,
    E1E2: m_c_val, E1E3: m_c_val, E2E3: m_c_val,
  }
  const r = computeIndices(m)
  assert.ok(Math.abs(r.indice_b) < 0.05, `b=${r.indice_b}`)
  assert.ok(Math.abs(r.indice_a) < 0.15, `a=${r.indice_a}`)
})

test('profil tres averse (toutes les m basses) -> b > 0', () => {
  const m = { E1: 0.1, E2: 0.1, E3: 0.1, E1E2: 0.2, E1E3: 0.2, E2E3: 0.2 }
  const r = computeIndices(m)
  assert.ok(r.indice_b > 0, `b=${r.indice_b}`)
})

test('profil insensible (simples et composes rapproches) -> a eleve', () => {
  // m_c - m_s petit => a proche de 1
  const m = { E1: 0.4, E2: 0.4, E3: 0.4, E1E2: 0.45, E1E3: 0.45, E2E3: 0.45 }
  const r = computeIndices(m)
  assert.ok(r.indice_a > 0.7, `a=${r.indice_a}`)
})

// ---- detection d'incoherence ----------------------------------------
test('detectIncoherent : A...A B...B est coherent', () => {
  assert.equal(detectIncoherent(['A', 'A', 'B', 'B']), false)
  assert.equal(detectIncoherent(['B', 'B', 'B', 'B']), false)
  assert.equal(detectIncoherent(['A', 'A', 'A', 'A']), false)
})

test('detectIncoherent : un A apres un B est incoherent', () => {
  assert.equal(detectIncoherent(['A', 'B', 'A', 'B']), true)
  assert.equal(detectIncoherent(['B', 'A', 'B', 'B']), true)
})

// ---- mode libre : derivation depuis les choix bruts -----------------
test('fromRawChoices : A,A,B,B coherent -> m=0.5, incoherent=false', () => {
  const r = fromRawChoices(['A', 'A', 'B', 'B'], P)
  assert.equal(r.switchPoint, 2)
  assert.equal(r.m, 0.5)
  assert.equal(r.incoherent, false)
  assert.equal(r.complete, true)
})

test('fromRawChoices : tout B -> m=0.1 ; tout A -> m=0.9', () => {
  assert.equal(fromRawChoices(['B', 'B', 'B', 'B'], P).m, 0.1)
  assert.equal(fromRawChoices(['A', 'A', 'A', 'A'], P).m, 0.9)
})

test('fromRawChoices : bascule multiple -> incoherent=true, m defini', () => {
  const r = fromRawChoices(['A', 'B', 'A', 'B'], P)
  assert.equal(r.incoherent, true)
  assert.equal(r.switchPoint, 2) // 2 choix A
  assert.equal(r.m, 0.5)
  assert.equal(r.complete, true)
})

test('fromRawChoices : lignes manquantes -> complete=false', () => {
  const r = fromRawChoices(['A', null, 'B', null], P)
  assert.equal(r.complete, false)
})

test('fromRawChoices avec P_S : bascule a index 4 -> m=0.35', () => {
  // 4 choix A puis 4 choix B sur l'echelle simples
  const choices = ['A', 'A', 'A', 'A', 'B', 'B', 'B', 'B']
  const r = fromRawChoices(choices, P_S)
  assert.equal(r.switchPoint, 4)
  assert.equal(r.m, 0.35)
  assert.equal(r.incoherent, false)
  assert.equal(r.complete, true)
})

test('fromRawChoices avec P_C : bascule a index 4 -> m=0.65', () => {
  // 4 choix A puis 4 choix B sur l'echelle composes
  const choices = ['A', 'A', 'A', 'A', 'B', 'B', 'B', 'B']
  const r = fromRawChoices(choices, P_C)
  assert.equal(r.switchPoint, 4)
  assert.equal(r.m, 0.65)
  assert.equal(r.incoherent, false)
  assert.equal(r.complete, true)
})

// ---- controle de monotonie ------------------------------------------
test('monotonicity: no violations when composites >= simples', () => {
  const m = { E1: 0.3, E2: 0.3, E3: 0.3, E1E2: 0.6, E1E3: 0.6, E2E3: 0.6 }
  assert.equal(countMonotonicityViolations(m), 0)
})

test('monotonicity: detects all 6 violations', () => {
  const m = { E1: 0.8, E2: 0.8, E3: 0.8, E1E2: 0.1, E1E3: 0.1, E2E3: 0.1 }
  assert.equal(countMonotonicityViolations(m), 6)
})

test('monotonicity: partial violations', () => {
  const m = { E1: 0.5, E2: 0.3, E3: 0.3, E1E2: 0.6, E1E3: 0.4, E2E3: 0.6 }
  // E1E3 (0.4) < E1 (0.5) => 1 violation
  assert.equal(countMonotonicityViolations(m), 1)
})
