# 📋 Dossier Technique et Historique du Projet : Plateforme RH & Formations PAPREC

> **Document de référence à destination de toute IA ou développeur reprenant le projet.**
> Ce dossier récapitule l'ensemble de l'architecture, la stack technique, les demandes utilisateur traitées, les bugs résolus et le rôle de chaque fichier de la **Plateforme RH & Formations PAPREC** (`paprec-rh-platform`).

---

## 🛠️ 1. Vue d'Ensemble et Stack Technique

- **Nom du projet** : Plateforme RH, Gestion des Congés, Planning & Formations - PAPREC
- **Dépôt GitHub** : `https://github.com/Diblo40/paprec-rh-platform.git` (Branche `main`)
- **Hébergement** : GitHub Pages (Déploiement statique automatique)
- **Technologies utilisées** :
  - **HTML5 / CSS3 (Vanilla)** : Interface utilisateur moderne avec palette institutionnelle Paprec, cartes interactives et modales.
  - **JavaScript (ES6+ Vanilla)** : Logique applicative sans framework ni build step, chargement via scripts avec `defer` et bust de cache (`?v=20260804-v5`).
  - **Base de Données Cloud (Supabase PostgreSQL)** : Source de vérité 100% cloud via API REST PostgREST et WebSockets Realtime (`postgres_changes`).
  - **FontAwesome 6.4.0** : Iconographie pour le suivi des statuts RH, congés et formations.

---

## 📁 2. Structure du Code Source & Rôle des Fichiers

```
paprec-rh-platform/
├── index.html                 # Structure HTML (navigation, onglets Personnel, Congés, Planning, Formations)
├── app.js                     # Cœur de la logique JS (gestion des salariés, calcul des congés, planning, Supabase)
├── data.js                    # Référentiels et données initiales de secours
├── styles.css                 # Style global (variables CSS, tableaux RH, badges de couleur, impression)
├── DOSSIER_TECHNIQUE_RH.md    # Documentation technique présente à la racine du dépôt
└── .nojekyll                  # Fichier de configuration pour la compatibilité GitHub Pages
```

### Détail des Fichiers Clés :

#### 1. `index.html`
- **Navigation par Onglets** :
  - `#tab-personnel` : Annuaire & Fiches des Salariés (contrats, métiers, visites médicales, habilitations).
  - `#tab-conges` : Gestion des Congés & Absences (Vue Synthèse tableau + Vue Calendrier 3 mois).
  - `#tab-planning` : Planning Hebdomadaire Interactif (Affectation par poste/jour, filtres métiers, impression).
  - `#tab-formations` : Matrice & Suivi des Habilitations (CACES, SST, FIMO/FCO, H0B0, etc.).
- **Modales d'Impression & Saisie** :
  - Modale d'ajout/modification de salarié, saisie de congé, purge/archivage d'exercice, et impression du calendrier.

#### 2. `app.js`
- **Source de Vérité 100% Cloud (Supabase)** :
  - URL Supabase : `https://wilukbpvjfdyxahasmmt.supabase.co`
  - Clé API : `sb_publishable_P9MiaaGJqJ2f6zAFvHwXZA_jYHlF830`
  - Table `employees` : Stocke chaque salarié dans une ligne PostgreSQL avec un champ JSON `role` contenant l'intégralité du profil et de l'historique des congés.
  - Ligne `rh_planning` : Stocke le JSON sérialisé des affectations de planning hebdomadaires (`planningData`).
  - WebSockets Realtime : Synchronisation instantanée entre tous les utilisateurs connectés.

---

## 🚀 3. Récapitulatif des Demandes Utilisateur & Corrections Effectuées

### 🔹 1. Gestion des Congés par Exercice (Du 1er Juin au 31 Mai) & Réinitialisation du Solde
- **Demande Utilisateur** : Les congés ne prenaient pas en compte l'exercice légal (1er juin au 31 mai). Sans cette prise en compte des dates, le solde CP ne revenait jamais à 25 jours au 1er juin.
- **Diagnostic Technique** :
  - Les fonctions `calculateEmployeeLeaveStats` et `renderCongesTable` filtraient les congés par année civile (`c.debut.startsWith("2026")`), déduisant les congés pris en début d'année civile du solde du nouvel exercice.
- **Correction Appliquée** :
  - Création de la fonction `getCurrentExerciseYear()` qui détermine l'exercice actif : si la date courante est $\ge$ 1er juin, l'exercice $Y$ court du `YYYY-06-01` au `(YYYY+1)-05-31` ; si elle est $<$ 1er juin, il court du `(YYYY-1)-06-01` au `YYYY-05-31`.
  - Refonte de `calculateEmployeeLeaveStats()` et `renderCongesTable()` pour ne comptabiliser que les congés posés au sein de la plage `[01/06/N → 31/05/N+1]`.
  - Au 1er juin de chaque année, l'exercice bascule automatiquement : les anciens congés ne sont plus déduits et le solde revient automatiquement à **25 jours** (plus les jours d'ancienneté Paprec).

### 🔹 2. Dynamisation Intégrale des Dates (Planning & Calendrier)
- **Demande Utilisateur** : La plateforme affichait la semaine W30 (juillet) en août au lieu de caler directement l'affichage sur la période actuelle.
- **Diagnostic Technique** :
  - Présence de 5 valeurs statiques hardcodées (`'2026-W30'`, `currentCongesStartMonth = 6` pour juillet, fallback fixe du planning au 20 juillet).
- **Correction Appliquée** :
  - Création de la fonction helper ISO Week `getCurrentISOWeek()` pour calculer dynamiquement la semaine courante (ex: `2026-W32`).
  - Initialisation dynamique du sélecteur de semaine `#planning-week-picker` et du bouton "Cette semaine" avec `getCurrentISOWeek()`.
  - Initialisation dynamique du calendrier 3 mois sur le mois courant avec `new Date().getMonth()` et `new Date().getFullYear()`.

### 🔹 3. Correction des Couleurs du Calendrier & Résolution du Bug Substring `"exPLoitation"`
- **Demande Utilisateur** :
  - Souci initial : La vue Calendrier appliquait les couleurs par métier (Chauffeurs, Dalles & Tri, Bureaux, Maintenance). Un bug décalait certains employés de bureau ("Bureaux / Exploitation") vers la couleur Vert ("Dalles & Tri").
  - Deuxième souci signalé lors des corrections : Les ouvriers Dalles & Tri apparaissaient soudainement en Orange (Chauffeurs).
- **Diagnostic Technique Approfondi (Audit de la Base)** :
  - L'audit des 18 salariés Supabase a révélé que la fonction `getMetierColorInfo(emp)` vérifiait la sous-chaîne `combined.includes('pl')` pour détecter les Chauffeurs (Poids Lourd).
  - Or, le mot **`exPLoitation`** contient les lettres **`p`** et **`l`** !
  - Par conséquent, TOUS les ouvriers dalles dont le métier ou le poste contenait *"Exploitation / DALE"* ou *"Exploitation / Tri"* renvoyaient `true` sur `includes('pl')` et basculaient par erreur en **Chauffeurs (Orange)** !
- **Correction Appliquée** :
  - Remplacement de `.includes('pl')` par la regex de mot entier strict : `/\b(spl|pl)\b/`.
  - Priorisation stricte des mots-clés du personnel de bureau (`bureau`, `secretariat`, `bascule`, `accueil`, `rh`, `qse`, `admin`, `comptab`, `assistante`) AVANT l'évaluation de l'exploitation.
  - Réalisation d'un audit complet sur les 18 salariés de l'agence confirmant la classification exacte à 100%.

---

## 🗄️ 4. Référentiel des Couleurs par Métier (Calendrier 3 Mois)

| Catégorie Métier | Mots-clés Détectés | Couleur de la Pastille | Code Hexa (BG / Border) |
| :--- | :--- | :--- | :--- |
| **Bureaux & Secrétariat** | `bureau`, `secretariat`, `bascule`, `accueil`, `rh`, `qse`, `admin`, `comptab`, `assistante` | 🟣 **Violet** | `#ede9fe` / `#7c3aed` |
| **Chauffeurs & Conducteurs** | `chauffeur`, `chaffeur`, `conducteur`, `toupie`, `\bpl\b`, `\bspl\b` | 🟧 **Orange** | `#ffedd5` / `#ea580c` |
| **Dalles & Tri** | `dalle`, `tri`, `exploitation`, `cariste`, `opérateur`, `operator`, `rippeur`, `manutention` | 🟢 **Vert** | `#d1fae5` / `#059669` |
| **Maintenance & Autres** | *Tous les autres postes (mécanicien, maintenance, etc.)* | 🔵 **Bleu** | `#e0f2fe` / `#0284c7` |

---

## 📊 5. Audit des 18 Salariés en Base (Supabase)

| Salarié | Métier / Poste Supabase | Couleur Déterminée | Status |
| :--- | :--- | :--- | :--- |
| **MARIE - AMELIE BERNARDH** | Bureaux / Secrétariat (Assistante) | 🟣 Violet | Validé |
| **VERGE VALENTIN** | Chauffeurs (Chauffeur) | 🟧 Orange | Validé |
| **LUCAS NORTES** | Chauffeurs (Chauffeur PL) | 🟧 Orange | Validé |
| **JULIEN CLERET** | Exploitation / Tri (Rippeur) | 🟢 Vert | Validé |
| **ANTHONY FONTI** | Bureaux / Secrétariat (Technicien QSE) | 🟣 Violet | Validé |
| **THOMAS VIDAL** | Exploitation / DALE (Ouvrier DALE) | 🟢 Vert | Validé |
| **CHRISTIAN LEROUX** | Chauffeurs (Chauffeur) | 🟧 Orange | Validé |
| **VERGE FABRICE** | Chauffeurs (Chauffeur) | 🟧 Orange | Validé |
| **TYWAN BALAZARD** | Conducteur d'engins (Ouvrier DALE) | 🟧 Orange | Validé |
| **REMY RAUZY** | Chauffeurs (Chauffeur) | 🟧 Orange | Validé |
| **LAURENT MARECHAL** | Exploitation / DALE (Resp. DALE) | 🟢 Vert | Validé |
| **JEAN-FRANCOIS PIERRE** | Chauffeurs (Chauffeur) | 🟧 Orange | Validé |
| **EMILIE JAYAT** | Bureaux / Secrétariat (Resp. Exploitation) | 🟣 Violet | Validé |
| **YASINE BELLAOUI** | Exploitation / DALE (Ouvrier DALE) | 🟢 Vert | Validé |
| **DEBORAH BAUDEIGNE** | Bureaux / Secrétariat (Assistante) | 🟣 Violet | Validé |
| **DIDIER MARTY** | Chauffeurs (Chauffeur) | 🟧 Orange | Validé |
| **PHILIPPE CAMPEDEL** | Chauffeurs (Chauffeur) | 🟧 Orange | Validé |

---

## 💡 6. Recommandations pour la Prochaine IA / Développeur

1. **Incrémentation des Versions Assets** : À chaque modification dans `app.js`, toujours mettre à jour les balises `<script>` dans `index.html` avec une nouvelle chaîne de requête (ex: `app.js?v=20260804-v6`) pour éviter la rétention de cache navigateur chez les utilisateurs.
2. **Structure des Lignes Salariés Supabase** : Les données du salarié et le tableau `conges` sont sérialisés au format JSON dans la colonne `role` de la table `employees`. Utiliser systématiquement `parseDbRowToEmployee()` et `formatEmployeeToDbRow()` lors des opérations de lecture/écriture.
3. **Périodes d'Exercice Congés** : Le calcul des soldes dépend exclusivement des dates du 1er juin au 31 mai. Ne jamais repasser sur un filtrage par année civile sans accord explicite de l'utilisateur.
