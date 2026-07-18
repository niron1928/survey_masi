import { useEffect, useMemo, useRef, useState } from 'react'
import Ticker from './components/Ticker.jsx'
import ProgressBar from './components/ProgressBar.jsx'

import Screen0Welcome from './screens/Screen0Welcome.jsx'
import Screen0bMasiIntro from './screens/Screen0bMasiIntro.jsx'
import Screen1Profile from './screens/Screen1Profile.jsx'
import Screen2Literacy from './screens/Screen2Literacy.jsx'
import Screen3Intro from './screens/Screen3Intro.jsx'
import Screen3Training from './screens/Screen3Training.jsx'
import Screen3Ambiguity from './screens/Screen3Ambiguity.jsx'
import Screen4Final from './screens/Screen4Final.jsx'
import Screen5End from './screens/Screen5End.jsx'
import Dashboard from './screens/Dashboard.jsx'

import { uuid } from './lib/uuid.js'
import { EVENTS, LITERACY_QUESTIONS } from './data/questions.js'
import { pStepsFor, BACKEND_URL, RESEARCHER_KEY, DASHBOARD_HASH } from './config.js'
import { computeIndices, fromRawChoices, countMonotonicityViolations } from './lib/indices.js'
import { appendResponse, getResponses, loadProgress, saveProgress, clearProgress, saveAbandon } from './lib/storage.js'

// Melange aleatoire (Fisher-Yates) : ordre des 6 evenements par participant.
function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// Cree une session vierge (identifiant + ordre randomise + horodatage de debut).
function newSession() {
  return {
    id: uuid(),
    session_start: new Date().toISOString(),
    eventOrder: shuffle(EVENTS.map((e) => e.code)),
    // ambig.choices[code] = tableau ['A'|'B'|null] ; revisions[code] = nb de clics
    ambig: { choices: {}, revisions: {} },
  }
}

// Cle d'un ecran, utilisee pour chronometrer le temps par ecran.
function stepKey(step) {
  if (step.t === 'table') return `table:${step.code}`
  return step.t
}

export default function App() {
  // --- Routage : questionnaire ou tableau de bord chercheur --------
  const [view, setView] = useState('survey') // 'survey' | 'dashboard'
  const [unlocked, setUnlocked] = useState(false)

  useEffect(() => {
    const check = () => {
      const h = window.location.hash.replace(/^#/, '')
      setView(h.startsWith(DASHBOARD_HASH) ? 'dashboard' : 'survey')
      // Deverrouillage direct possible via #tableau-de-bord=CLE
      const eq = h.indexOf('=')
      if (eq !== -1 && h.slice(eq + 1) === RESEARCHER_KEY) setUnlocked(true)
    }
    check()
    window.addEventListener('hashchange', check)
    return () => window.removeEventListener('hashchange', check)
  }, [])

  // --- Etat principal : donnees + etape courante -------------------
  // Reprise robuste : on n'accepte une sauvegarde que si elle a la forme
  // attendue (identifiant, ordre des evenements, structure ambig complete).
  // Sinon on repart d'une session vierge (evite tout ecran blanc).
  const restored = (() => {
    const saved = loadProgress()
    const d = saved?.data
    const valide = d && d.id && Array.isArray(d.eventOrder) && d.ambig && d.ambig.choices && d.ambig.revisions
    return valide ? saved : null
  })()

  const [data, setData] = useState(() => restored?.data ?? newSession())
  const [stepIndex, setStepIndex] = useState(() => restored?.stepIndex ?? 0)

  // Construit dynamiquement la liste des etapes.
  // NOUVEL ORDRE (B3 + B4) :
  //   welcome → profile (avec familiarité) → masiIntro → literacy
  //   → ambigIntro → training → ...tables → final → end
  const steps = useMemo(() => {
    const tables = data.eventOrder.map((code) => ({ t: 'table', code }))
    return [
      { t: 'welcome' },
      { t: 'profile' },
      { t: 'masiIntro' },
      { t: 'literacy' },
      { t: 'ambigIntro' },
      { t: 'training' },
      ...tables,
      { t: 'final' },
      { t: 'end' },
    ]
  }, [data.eventOrder])

  const step = steps[stepIndex]

  // --- Chronometrage comportemental (refs, hors rendu) -------------
  const timesRef = useRef({}) // { cleEcran: millisecondes cumulees }
  const markRef = useRef(null) // { key, t } dernier point de mesure
  const retoursRef = useRef(0) // nombre d'utilisations du bouton "Precedent"

  // A chaque changement d'ecran : impute le temps ecoule a l'ecran quitte.
  useEffect(() => {
    if (view !== 'survey') return
    const now = performance.now()
    if (markRef.current) {
      const prev = markRef.current
      timesRef.current[prev.key] = (timesRef.current[prev.key] || 0) + (now - prev.t)
    }
    markRef.current = { key: stepKey(step), t: now }
  }, [stepIndex, view]) // eslint-disable-line react-hooks/exhaustive-deps

  // --- Persistance locale (reprise apres rafraichissement) ---------
  useEffect(() => {
    if (step.t !== 'end') saveProgress({ data, stepIndex })
  }, [data, stepIndex, step.t])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [stepIndex])

  // --- C4 : tracking d'abandon (beforeunload) ---------------------
  useEffect(() => {
    function onBeforeUnload() {
      if (step.t !== 'end') {
        saveAbandon({ id: data.id, ecran_abandon: stepKey(step), horodatage: new Date().toISOString() })
      }
    }
    window.addEventListener('beforeunload', onBeforeUnload)
    return () => window.removeEventListener('beforeunload', onBeforeUnload)
  }, [data.id, step]) // eslint-disable-line react-hooks/exhaustive-deps

  // --- Helpers de mise a jour --------------------------------------
  const update = (patch) => setData((d) => ({ ...d, ...patch }))

  // Enregistre le choix d'UNE ligne (mode libre) et compte les revisions.
  // Utilise pStepsFor(code) pour determiner le bon nombre de lignes.
  const setChoice = (code, i, option) =>
    setData((d) => {
      const pSteps = pStepsFor(code)
      const arr = [...(d.ambig.choices[code] || pSteps.map(() => null))]
      arr[i] = option
      return {
        ...d,
        ambig: {
          ...d.ambig,
          choices: { ...d.ambig.choices, [code]: arr },
          revisions: { ...d.ambig.revisions, [code]: (d.ambig.revisions[code] || 0) + 1 },
        },
      }
    })

  const goNext = () => setStepIndex((i) => Math.min(i + 1, steps.length - 1))
  const goBack = () => {
    retoursRef.current += 1
    setStepIndex((i) => Math.max(i - 1, 0))
  }

  // Convertit le cumul de temps (ms) en secondes entieres par ecran.
  function collectTimes() {
    // Fige le temps de l'ecran courant avant de calculer.
    const now = performance.now()
    if (markRef.current) {
      const prev = markRef.current
      timesRef.current[prev.key] = (timesRef.current[prev.key] || 0) + (now - prev.t)
      markRef.current = { key: prev.key, t: now }
    }
    const parEcran = {}
    for (const [k, ms] of Object.entries(timesRef.current)) parEcran[k] = Math.round(ms / 1000)
    return parEcran
  }

  // --- Finalisation : calcul des indices + enregistrement ----------
  function finalize() {
    const score_culture = LITERACY_QUESTIONS.reduce(
      (acc, q) => acc + (data[q.key] === q.options[q.correct] ? 1 : 0),
      0,
    )

    // Matching probability + incoherence, derivees des choix bruts (mode libre).
    // Chaque evenement utilise sa propre echelle de paliers.
    const m = {}
    let incoherentAny = false
    for (const e of EVENTS) {
      const pSteps = pStepsFor(e.code)
      const choices = data.ambig.choices[e.code] || pSteps.map(() => null)
      const res = fromRawChoices(choices, pSteps)
      m[e.code] = res.m
      if (res.incoherent) incoherentAny = true
    }

    const { m_s, m_c, indice_b, indice_a } = computeIndices(m)

    // C5 : controle de monotonie de Baillon (ne bloque pas le participant).
    const violations_monotonie = countMonotonicityViolations(m)

    // Donnees temporelles / comportementales
    const temps_par_ecran = collectTimes()
    const temps_par_tableau = {}
    for (const [k, sec] of Object.entries(temps_par_ecran)) {
      if (k.startsWith('table:')) temps_par_tableau[k.slice(6)] = sec
    }
    const duree_totale_sec = Object.values(temps_par_ecran).reduce((s, x) => s + x, 0)

    const response = {
      id: data.id,
      horodatage: new Date().toISOString(),
      session_start: data.session_start,
      duree_totale_sec,
      age: data.age,
      genre: data.genre,
      etudes: data.etudes,
      possede_actions: data.possede_actions,
      connait_charia: data.connait_charia,
      utilise_charia: data.utilise_charia || '',
      connait_masi: data.connait_masi,
      familiarite_masi: data.familiarite_masi,
      q1: data.q1,
      q2: data.q2,
      q3: data.q3,
      score_culture,
      m,
      m_s,
      m_c,
      indice_b,
      indice_a,
      revenu: data.revenu,
      intention_investir: data.intention_investir,
      incoherent: incoherentAny,
      violations_monotonie,
      // --- comportemental ---
      temps_par_ecran,
      temps_par_tableau,
      nb_revisions: data.ambig.revisions,
      nb_retours: retoursRef.current,
      ordre_evenements: data.eventOrder,
      ecran_abandon: null, // completion reussie
      appareil: typeof navigator !== 'undefined' ? navigator.userAgent.slice(0, 180) : '',
      largeur_ecran: typeof window !== 'undefined' ? window.innerWidth : '',
    }

    appendResponse(response)
    sendToBackend(response)
    clearProgress()
  }

  async function sendToBackend(response) {
    if (!BACKEND_URL) return
    try {
      await fetch(BACKEND_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(response),
      })
    } catch {
      /* la reponse reste disponible en local */
    }
  }

  function goToEnd() {
    finalize()
    goNext()
  }

  function restart() {
    clearProgress()
    timesRef.current = {}
    markRef.current = null
    retoursRef.current = 0
    setData(newSession())
    setStepIndex(0)
  }

  // --- Vue tableau de bord (chercheur) -----------------------------
  if (view === 'dashboard') {
    if (!unlocked) return <KeyGate onUnlock={() => setUnlocked(true)} />
    return (
      <Dashboard
        responses={getResponses()}
        onExit={() => {
          window.location.hash = ''
          setView('survey')
        }}
        onCleared={() => setView('dashboard')}
      />
    )
  }

  // --- Rendu de l'ecran courant (questionnaire) --------------------
  function renderScreen() {
    switch (step.t) {
      case 'welcome':
        return <Screen0Welcome onNext={goNext} />
      case 'profile':
        return <Screen1Profile data={data} update={update} onNext={goNext} onBack={goBack} />
      case 'masiIntro':
        return <Screen0bMasiIntro onNext={goNext} onBack={goBack} />
      case 'literacy':
        return <Screen2Literacy data={data} update={update} onNext={goNext} onBack={goBack} />
      case 'ambigIntro':
        return <Screen3Intro onNext={goNext} onBack={goBack} />
      case 'training':
        return <Screen3Training onNext={goNext} onBack={goBack} />
      case 'table': {
        const event = EVENTS.find((e) => e.code === step.code)
        const displayIndex = data.eventOrder.indexOf(step.code) + 1
        return (
          <Screen3Ambiguity
            key={step.code}
            event={event}
            index={displayIndex}
            total={data.eventOrder.length}
            choices={data.ambig.choices?.[step.code]}
            onChoose={(i, option) => setChoice(step.code, i, option)}
            onNext={goNext}
            onBack={goBack}
          />
        )
      }
      case 'final':
        return <Screen4Final data={data} update={update} onNext={goToEnd} onBack={goBack} />
      case 'end':
        return <Screen5End onRestart={restart} />
      default:
        return null
    }
  }

  const showProgress = step.t !== 'welcome' && step.t !== 'end'

  return (
    <div className="min-h-screen bg-night">
      <Ticker />
      <main className="mx-auto w-full max-w-3xl px-4 py-6 sm:py-10">
        {showProgress && (
          <div className="mb-8">
            <ProgressBar current={stepIndex} total={steps.length} />
          </div>
        )}
        <div className="rounded-3xl border border-edge bg-surface/40 p-5 shadow-2xl sm:p-8">
          {renderScreen()}
        </div>
        <footer className="mt-6 text-center font-mono text-[11px] leading-relaxed text-muted">
          Étude anonyme · Méthode de Baillon, Huang, Selim &amp; Wakker (2018)
          <br />
          Zakaria BASALAH — sous la direction du Pr. Hayat ZOUITEN · 2026
        </footer>
      </main>
    </div>
  )
}

// Porte d'acces au tableau de bord : demande la cle chercheur.
function KeyGate({ onUnlock }) {
  const [key, setKey] = useState('')
  const [error, setError] = useState('')

  function submit(e) {
    e.preventDefault()
    if (key === RESEARCHER_KEY) onUnlock()
    else setError('Clé incorrecte.')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-night px-4">
      <form onSubmit={submit} className="w-full max-w-sm rounded-2xl border border-edge bg-surface p-6">
        <p className="font-mono text-xs uppercase tracking-widest text-info">Accès réservé</p>
        <h1 className="mt-1 text-xl font-bold text-ink">Tableau de bord chercheur</h1>
        <p className="mt-2 text-sm text-muted">Entrez la clé d'accès pour consulter les résultats.</p>
        <input
          type="password"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          autoFocus
          placeholder="Clé d'accès"
          className="mt-4 w-full rounded-xl border border-edge bg-night px-4 py-3 font-mono text-ink outline-none focus:border-info"
        />
        {error && <p className="mt-2 text-sm text-down">{error}</p>}
        <button type="submit" className="mt-4 w-full rounded-xl border border-info bg-info/20 py-3 font-bold text-info hover:bg-info/30">
          Déverrouiller
        </button>
        <a href="#" onClick={() => (window.location.hash = '')} className="mt-3 block text-center text-xs text-muted hover:text-ink">
          ← Retour au questionnaire
        </a>
      </form>
    </div>
  )
}
