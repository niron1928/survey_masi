// =====================================================================
// Contenu textuel du questionnaire (toutes les questions et libelles).
// Centralise ici pour faciliter relecture et modifications.
// =====================================================================

// ---- Partie 1 : profil socio-economique (choix unique) --------------
export const PROFILE_QUESTIONS = [
  {
    key: 'age',
    label: 'Quelle est votre tranche d’âge ?',
    options: ['18–24', '25–34', '35–44', '45–54', '55 et plus'],
  },
  {
    key: 'genre',
    label: 'Genre',
    options: ['Femme', 'Homme', 'Préfère ne pas dire'],
  },
  {
    key: 'etudes',
    label: 'Niveau d’études le plus élevé',
    options: ['Secondaire', 'Bac+2', 'Bac+3', 'Bac+5', 'Doctorat'],
  },
  {
    key: 'revenu',
    label: 'Revenu mensuel net (DH)',
    options: [
      '< 5 000',
      '5 000–10 000',
      '10 000–20 000',
      '> 20 000',
      'Préfère ne pas dire',
    ],
  },
  {
    key: 'possede_actions',
    label: 'Possédez-vous déjà des actions ou placements en bourse ?',
    options: ['Oui', 'Non'],
  },
  {
    key: 'finance_charia',
    label:
      'Utilisez-vous des produits financiers conformes à la Charia (finance participative) ?',
    options: ['Oui', 'Non', 'Je ne connais pas'],
  },
  {
    key: 'connait_masi',
    label:
      `Connaissiez-vous l'indice MASI (Moroccan All Shares Index) avant ce questionnaire ?`,
    options: [`Oui, je le suivais déjà`, `Oui, j'en avais entendu parler`, `Non, c'est la première fois`],
  },
]

// ---- Partie 2 : culture financiere ("Big Three") --------------------
// `correct` = index de la bonne reponse (usage interne, jamais affiche).
export const LITERACY_QUESTIONS = [
  {
    key: 'q1',
    label:
      'Supposons que vous placiez 100 DH sur un compte rémunéré à 2 % par an. Au bout de 5 ans, combien aurez-vous si vous ne touchez pas à l’argent ?',
    options: ['Plus de 102 DH', 'Exactement 102 DH', 'Moins de 102 DH', 'Je ne sais pas'],
    correct: 0,
  },
  {
    key: 'q2',
    label:
      'Si le taux d’intérêt de votre compte est de 1 % par an et l’inflation de 2 % par an, au bout d’un an vous pourrez acheter :',
    options: ['Plus qu’aujourd’hui', 'Autant qu’aujourd’hui', 'Moins qu’aujourd’hui', 'Je ne sais pas'],
    correct: 2,
  },
  {
    key: 'q3',
    label:
      'Vrai ou faux : acheter l’action d’une seule entreprise procure un rendement plus sûr que d’acheter un fonds composé de plusieurs actions.',
    options: ['Vrai', 'Faux', 'Je ne sais pas'],
    correct: 1,
  },
]

// ---- Partie 3 : les six evenements a eliciter -----------------------
// `code`   : identifiant interne / colonne CSV
// `name`   : nom court affiche (Baisse, Stabilite, ...)
// `cond`   : condition sur le rendement R (rappel visuel)
// `optionA`: description exacte de l'Option A (le marche)
// `tone`   : couleur d'accent ('down' | 'flat' | 'up' | 'mix')
export const EVENTS = [
  {
    code: 'E1',
    name: 'Baisse',
    cond: 'R < −2 %',
    optionA:
      'Vous gagnez 200 DH si le MASI BAISSE de plus de 2 % (R < −2 %) d’ici le 31 décembre 2026.',
    tone: 'down',
  },
  {
    code: 'E2',
    name: 'Stabilité',
    cond: '−2 % ≤ R ≤ +8 %',
    optionA:
      'Vous gagnez 200 DH si le MASI reste STABLE (varie entre −2 % et +8 %) d’ici le 31 décembre 2026.',
    tone: 'flat',
  },
  {
    code: 'E3',
    name: 'Hausse',
    cond: 'R > +8 %',
    optionA:
      'Vous gagnez 200 DH si le MASI AUGMENTE de plus de 8 % (R > +8 %) d’ici le 31 décembre 2026.',
    tone: 'up',
  },
  {
    code: 'E1E2',
    name: 'Baisse ou stabilité',
    cond: 'R ≤ +8 %',
    optionA:
      'Vous gagnez 200 DH si le MASI BAISSE ou reste STABLE (R ≤ +8 %) d’ici le 31 décembre 2026.',
    tone: 'mix',
  },
  {
    code: 'E1E3',
    name: 'Baisse ou hausse',
    cond: 'R < −2 % ou R > +8 %',
    optionA:
      'Vous gagnez 200 DH si le MASI BAISSE de plus de 2 % OU AUGMENTE de plus de 8 % (mouvement fort) d’ici le 31 décembre 2026.',
    tone: 'mix',
  },
  {
    code: 'E2E3',
    name: 'Stabilité ou hausse',
    cond: 'R ≥ −2 %',
    optionA:
      'Vous gagnez 200 DH si le MASI reste STABLE ou AUGMENTE (R ≥ −2 %) d’ici le 31 décembre 2026.',
    tone: 'mix',
  },
]

// ---- Partie 4 : questions finales (echelle 1 a 5) -------------------
export const FINAL_QUESTIONS = [
  {
    key: 'F1',
    label:
      'Je me sens familier avec le fonctionnement de la Bourse de Casablanca et du MASI.',
  },
  {
    key: 'F2',
    label:
      'Je serais prêt(e) à investir une partie de mon épargne en bourse dans les 12 prochains mois.',
  },
]

export const SCALE_LABELS = {
  1: 'Pas du tout d’accord',
  5: 'Tout à fait d’accord',
}
