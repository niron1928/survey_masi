# Vous et l'incertitude des marchés — Questionnaire MASI

Site web de questionnaire de recherche en **économie comportementale**, en français,
au design immersif « salle de marché / trading ».

Il mesure les **attitudes face à l'ambiguïté** (méthode de **Baillon, Huang, Selim & Wakker, 2018**,
*Econometrica*) chez des investisseurs marocains potentiels, en s'appuyant sur l'indice **MASI**
de la Bourse de Casablanca, puis relie ces attitudes à l'intention d'investir.

> Étude anonyme, non rémunérée, montants **hypothétiques**.
> Zakaria BASALAH — sous la direction du Pr. Hayat ZOUITEN — 2026.

---

## 1. Lancer le site

### Le plus simple : double-clic (Windows)

Double-cliquez sur **`Lancer_le_site.bat`**. Il installe automatiquement ce qu'il faut
(la première fois), démarre le site et ouvre votre navigateur. Pour arrêter, fermez la
fenêtre noire.

> Pré-requis unique : **Node.js** installé (https://nodejs.org, version « LTS »). Si Node
> manque, le `.bat` vous l'indique. Une fois installé, plus rien à faire à la main.

Deux adresses s'ouvrent alors sur cet ordinateur :
- Questionnaire (participants) : **http://localhost:5173**
- Tableau de bord (chercheur) : **http://localhost:5173/#tableau-de-bord**

### En ligne de commande (équivalent)

Pré-requis : **Node.js ≥ 18** (testé avec Node 24).

```bash
cd masi-ambiguite
npm install      # installe les dépendances (première fois seulement)
npm run dev      # démarre le serveur de dev sur http://localhost:5173
```

Pour une version optimisée à héberger (Netlify, Vercel, GitHub Pages, serveur classique) :

```bash
npm run build    # génère le dossier dist/
npm run preview  # prévisualise le build de production en local
```

Le contenu de `dist/` est un site statique : déposez-le tel quel sur n'importe quel hébergeur.

---

## 2. Structure du projet

```
src/
├── App.jsx                # machine à états écran par écran + persistance + finalisation
├── config.js              # paramètres (paliers p, montant, backend optionnel)
├── data/questions.js      # tous les textes, questions et définitions d'événements
├── lib/
│   ├── indices.js         # matching probabilities + indices a et b (cœur scientifique)
│   ├── indices.test.js    # tests de la logique (npm test)
│   ├── csv.js             # export CSV « ; » UTF-8 + BOM
│   ├── storage.js         # localStorage (reprise + accumulation des réponses)
│   └── uuid.js            # identifiant de session anonyme
├── components/            # Ticker, ProgressBar, Candlestick, Urne, boutons…
└── screens/               # les 6 écrans (accueil → fin)
```

---

## 3. Déroulé du questionnaire

| Écran | Contenu |
|-------|---------|
| 0 | Accueil & consentement (case à cocher obligatoire) |
| 0b | **« Qu'est-ce que le MASI ? »** — introduction pédagogique + graphique 2013–2025 |
| 1 | Partie 1 — profil socio-économique (6 questions) |
| 2 | Partie 2 — culture financière « Big Three » (score 0–3, jamais affiché) |
| 3 | Partie 3 — **mesure de l'ambiguïté** : contexte MASI + 6 tableaux de choix |
| 4 | Partie 4 — 2 questions finales (échelle 1–5) |
| 5 | Fin — **remerciement uniquement** (le participant ne télécharge rien) |

L'ordre des 6 événements est **randomisé** pour chaque participant. De nombreuses
**données comportementales** sont collectées automatiquement (voir §5).

---

## 4. La mesure d'ambiguïté (le cœur)

Le rendement du MASI sur 6 mois (1er juillet → 31 décembre 2026) est partitionné en trois
événements approximativement équiprobables :

- **E1 Baisse** : `R < −2 %`
- **E2 Stabilité** : `−2 % ≤ R ≤ +8 %`
- **E3 Hausse** : `R > +8 %`

On élicite **6 événements** : les 3 simples (E1, E2, E3) et les 3 composés
(E1∪E2, E1∪E3, E2∪E3). Pour chacun, le participant compare, ligne par ligne, un pari sur
le **marché** (Option A, probabilité inconnue) à un pari sur une **urne** (Option B,
probabilité connue = 20 %, 40 %, 60 %, 80 %).

**Choix libre (mode retenu).** Chaque ligne se coche **indépendamment** : le participant est
entièrement libre de choisir « marché » ou « urne » sur chacune, sans remplissage automatique
ni correction. Les quatre lignes doivent être renseignées pour continuer.

- La **matching probability** est dérivée du nombre de lignes où le marché a été préféré
  (`fromRawChoices` dans `src/lib/indices.js`). Pour une réponse cohérente `A…A B…B`, cela
  correspond exactement au point de bascule.
- Si le participant bascule **plusieurs fois** (`A B A B`…), la valeur reste définie mais
  `incoherent = true` est enregistré. À l'analyse, vous pouvez ainsi **filtrer ou traiter à
  part** ces réponses (indicateur de qualité / d'attention).

**Calcul des indices** (dans `src/lib/indices.js`, jamais montrés au participant) :

```
m (matching probability) = milieu entre le dernier p choisi « A » et le premier p choisi « B »
  - B dès 20 %      → m = (0 + 20)/2  = 0,10
  - A jusqu'à 80 %  → m = (80 + 100)/2 = 0,90

m_s = moyenne(m_E1, m_E2, m_E3)            # événements simples
m_c = moyenne(m_E1E2, m_E1E3, m_E2E3)      # événements composés
indice_b = 1 − m_c − m_s                    # aversion à l'ambiguïté (b > 0 = averse)
indice_a = 1 − 3 × (m_c − m_s)              # insensibilité (a > 0 = insensible)
```

### Vérifier la logique

```bash
npm test
```

Les tests (`src/lib/indices.test.js`) couvrent notamment :

- l'exemple numérique de contrôle → **b = 0,15 ; a = 0,25** ;
- un profil **neutre** (m simples ≈ 1/3, composés ≈ 2/3) → **b ≈ 0 et a ≈ 0** ;
- un profil **très averse** (toutes les m basses) → **b > 0** ;
- un profil **insensible** (simples et composés rapprochés) → **a élevé**.

---

## 5. Récupérer les données (réservé au chercheur)

Les **participants ne voient et ne téléchargent aucune donnée** — juste un message de
remerciement. Seul le chercheur accède aux résultats.

### a) Le tableau de bord chercheur

Ouvrez : **`http://localhost:5173/#tableau-de-bord`** (ou l'URL de votre site + `#tableau-de-bord`).

Une **clé d'accès** est demandée. Elle est définie dans `src/config.js` :

```js
export const RESEARCHER_KEY = 'ZBASALAH-2026'   // >>> CHANGEZ-LA avant diffusion <<<
```

> Astuce : vous pouvez aussi ouvrir directement `.../#tableau-de-bord=VOTRE_CLE` pour
> déverrouiller sans saisie (pratique pour un marque-page privé).

Le tableau de bord affiche :

- le **nombre de participants** ;
- les **indices moyens** `a` et `b`, le % d'averses / tolérants / insensibles / incohérents ;
- le **constat central** : intention d'investir (F2) selon l'attitude face à l'ambiguïté ;
- des **graphiques** (matching probability moyenne par événement, distribution de `b`) ;
- le **tableau brut** des réponses ;
- les boutons **Export CSV**, **Export JSON**, et **Effacer**.

### b) Format d'export CSV

- séparateur **`;`**, décimales à la **virgule** (Excel français), **UTF-8 avec BOM** ;
- **une ligne par participant**.

**Colonnes :** `id ; horodatage ; age ; genre ; etudes ; revenu ; possede_actions ;
finance_charia ; q1 ; q2 ; q3 ; score_culture ; m_E1 ; m_E2 ; m_E3 ; m_E1E2 ; m_E1E3 ;
m_E2E3 ; m_s ; m_c ; indice_b ; indice_a ; F1 ; F2 ; temps_par_tableau ; incoherent`
puis les **données comportementales** : `session_start ; duree_totale_sec ;
temps_par_ecran ; nb_revisions ; nb_retours ; ordre_evenements ; appareil ; largeur_ecran`.

**Données comportementales collectées (automatiquement) :**

| Champ | Signification |
|-------|----------------|
| `session_start` | horodatage de début de session |
| `duree_totale_sec` | durée totale de participation (secondes) |
| `temps_par_ecran` | temps passé sur chaque écran (JSON) |
| `temps_par_tableau` | temps par tableau d'événement (JSON) |
| `nb_revisions` | nombre de clics/changements par tableau (JSON) — mesure l'hésitation |
| `nb_retours` | nombre d'utilisations du bouton « Précédent » |
| `ordre_evenements` | ordre randomisé des 6 événements pour ce participant |
| `appareil` | navigateur / appareil (user-agent) |
| `largeur_ecran` | largeur d'écran en pixels (proxy mobile/desktop) |

> ⚠️ Les réponses sont stockées dans le **localStorage du navigateur** utilisé. Deux options :
> 1. **Mode « kiosque »** : tout le monde répond sur le même appareil/navigateur ; les
>    réponses s'accumulent, vous exportez le CSV à la fin depuis le tableau de bord.
> 2. **Backend centralisé** : voir ci-dessous (recommandé pour une diffusion en ligne).

### b) Envoi à un backend (collecte centralisée, optionnel)

Renseignez `BACKEND_URL` dans `src/config.js`. À la fin du questionnaire, chaque réponse
est envoyée en **POST JSON** à cette URL (en plus d'être stockée en local).

```js
// src/config.js
export const BACKEND_URL = 'https://formspree.io/f/xxxxxxx'
```

Solutions simples sans coder de serveur : **Formspree**, **Sheet.best** / **SheetDB**
(vers Google Sheets), **Supabase** (table + endpoint REST), ou une petite API maison
(`POST /responses`). Le corps envoyé correspond à l'objet réponse (mêmes champs que le CSV,
avec `m` sous forme d'objet `{E1, E2, …}`).

---

## 6. Reprise & confidentialité

- **Reprise** : la progression est sauvegardée en local ; un rafraîchissement de page
  reprend là où le participant s'était arrêté. La session terminée n'est pas reprise.
- **Anonymat** : aucune donnée personnelle n'est demandée. L'`id` est un UUID aléatoire.
- Le participant ne voit **jamais** son score de culture financière, ni les bonnes réponses,
  ni les indices calculés.

---

## 7. Personnalisation rapide

| Besoin | Où |
|--------|-----|
| Paliers de probabilité (20/40/60/80 → mode fin 10…90) | `src/config.js` (`P_STEPS`) |
| Montant du pari | `src/config.js` (`REWARD`) |
| **Clé d'accès du tableau de bord** | `src/config.js` (`RESEARCHER_KEY`) |
| Graphique / données du MASI | `src/components/MasiChart.jsx` |
| Textes / questions / événements | `src/data/questions.js` |
| Couleurs du thème | `tailwind.config.js` |
| Backend | `src/config.js` (`BACKEND_URL`) |

---

## Référence

Baillon, A., Huang, Z., Selim, A., & Wakker, P. P. (2018).
*Measuring Ambiguity Attitudes for All (Natural) Events*. **Econometrica**, 86(5), 1839–1858.
