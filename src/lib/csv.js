// =====================================================================
// Export CSV compatible Excel francais :
//  - separateur ';'
//  - encodage UTF-8 avec BOM (accents corrects a l'ouverture dans Excel)
//  - decimales avec la virgule (','), coherent avec le separateur ';'
// =====================================================================

// Ordre exact des colonnes (cf. cahier des charges, section 8).
export const CSV_COLUMNS = [
  'id',
  'horodatage',
  'age',
  'genre',
  'etudes',
  'revenu',
  'possede_actions',
  'finance_charia',
  'q1',
  'q2',
  'q3',
  'score_culture',
  'm_E1',
  'm_E2',
  'm_E3',
  'm_E1E2',
  'm_E1E3',
  'm_E2E3',
  'm_s',
  'm_c',
  'indice_b',
  'indice_a',
  'F1',
  'F2',
  'temps_par_tableau',
  'incoherent',
  // --- donnees comportementales additionnelles ---
  'session_start',
  'duree_totale_sec',
  'temps_par_ecran',
  'nb_revisions',
  'nb_retours',
  'ordre_evenements',
  'appareil',
  'largeur_ecran',
]

// Formate un nombre avec la virgule decimale (Excel FR). 4 decimales max.
function num(x) {
  if (x === null || x === undefined || Number.isNaN(x)) return ''
  return String(Math.round(x * 10000) / 10000).replace('.', ',')
}

// Echappe une valeur pour le CSV (guillemets si necessaire).
function cell(value) {
  const s = value === null || value === undefined ? '' : String(value)
  if (/[";\n\r]/.test(s)) {
    return '"' + s.replace(/"/g, '""') + '"'
  }
  return s
}

// Transforme une reponse (objet interne) en ligne de valeurs CSV.
function responseToRow(r) {
  return [
    r.id,
    r.horodatage,
    r.age,
    r.genre,
    r.etudes,
    r.revenu,
    r.possede_actions,
    r.finance_charia,
    r.q1,
    r.q2,
    r.q3,
    r.score_culture,
    num(r.m.E1),
    num(r.m.E2),
    num(r.m.E3),
    num(r.m.E1E2),
    num(r.m.E1E3),
    num(r.m.E2E3),
    num(r.m_s),
    num(r.m_c),
    num(r.indice_b),
    num(r.indice_a),
    r.F1,
    r.F2,
    JSON.stringify(r.temps_par_tableau), // ex. {"E1":12,"E2":9,...}
    r.incoherent ? 'true' : 'false',
    // --- donnees comportementales additionnelles ---
    r.session_start,
    r.duree_totale_sec,
    JSON.stringify(r.temps_par_ecran || {}),
    JSON.stringify(r.nb_revisions || {}),
    r.nb_retours,
    Array.isArray(r.ordre_evenements) ? r.ordre_evenements.join('|') : r.ordre_evenements,
    r.appareil,
    r.largeur_ecran,
  ]
}

/** Construit le contenu CSV (chaine) a partir d'une liste de reponses. */
export function buildCsv(responses) {
  const header = CSV_COLUMNS.join(';')
  const rows = responses.map((r) => responseToRow(r).map(cell).join(';'))
  return '﻿' + [header, ...rows].join('\r\n') // BOM + CRLF
}

// Declenche un telechargement de fichier (helper interne).
function triggerDownload(content, type, filename) {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

/** Declenche le telechargement d'un fichier CSV dans le navigateur. */
export function downloadCsv(responses, filename = 'reponses_masi.csv') {
  triggerDownload(buildCsv(responses), 'text/csv;charset=utf-8;', filename)
}

/** Declenche le telechargement des reponses brutes au format JSON (sauvegarde complete). */
export function downloadJson(responses, filename = 'reponses_masi.json') {
  triggerDownload(JSON.stringify(responses, null, 2), 'application/json;charset=utf-8;', filename)
}
