# 💻 UniTable — Frontend Desktop

> **Une application web pour gérer votre organisation** — Une interface Next.js avec TypeScript, Radix UI et Tailwind CSS pour une gestion complète des établissements, employés, services, équipes et plannings.

[![Next.js](https://img.shields.io/badge/Next.js-16.1.6-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.4-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Radix UI](https://img.shields.io/badge/Radix_UI-1.4.3-161616?style=for-the-badge)](https://www.radix-ui.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.2.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Redux](https://img.shields.io/badge/Redux-2.11.2-764ABC?style=for-the-badge&logo=redux&logoColor=white)](https://redux.js.org/)
[![React Big Calendar](https://img.shields.io/badge/React_Big_Calendar-1.19.4-4A90E2?style=for-the-badge)](https://github.com/jquense/react-big-calendar)
[![Recharts](https://img.shields.io/badge/Recharts-2.15.0-FF7C43?style=for-the-badge)](https://recharts.org/)
[![License: BSL](https://img.shields.io/badge/License-BSL_1.1-orange.svg?style=for-the-badge)](https://mariadb.com/bsl11)

---

## 📜 À propos du projet

**UniTable** est un projet de fin de formation conçu en groupe, en 10 jours.
C'est une **application web moderne** développée avec **Next.js 16**, **JavaScript**, **TypeScript** et **React 19**. Elle offre une expérience utilisateur complète pour gérer :

- Les établissements et leurs configurations
- Les employés avec leurs rôles et permissions
- Les services du restaurant
- Les équipes et leur composition
- Les plannings avec visualisation calendaire
- L'envoi d'emails de réinitialisation de mot de passe

L'application utilise **Radix UI** pour des composants accessibles et **Tailwind CSS** pour un design moderne et personnalisable. Elle est conçue pour être puissante, intuitive et adaptée aux besoins des administrateurs et gestionnaires.

---

## 🔧 Stack Technique

| Catégorie            | Technologie                                                                 | Version | Rôle                                   |
| -------------------- | --------------------------------------------------------------------------- | ------- | -------------------------------------- |
| **Framework**        | [Next.js](https://nextjs.org/)                                              | 16.1.6  | Framework React avec SSR et App Router |
| **Librairie UI**     | [React](https://reactjs.org/)                                               | 19.2.4  | Construction de l'interface            |
| **State Management** | [Redux Toolkit](https://redux-toolkit.js.org/)                              | 2.11.2  | Gestion centralisée de l'état          |
| **Persistance**      | [Redux Persist](https://github.com/rt2zz/redux-persist)                     | 6.0.0   | Sauvegarde du state                    |
| **UI Components**    | [Radix UI](https://www.radix-ui.com/)                                       | 1.4.3   | Composants accessibles                 |
| **UI Components**    | [shadcn/ui](https://ui.shadcn.com/)                                         | 3.8.5   | Collection de composants               |
| **Styling**          | [Tailwind CSS](https://tailwindcss.com/)                                    | 4.2.0   | Framework CSS utility-first            |
| **Icons**            | [Tabler Icons](https://tabler-icons.io/)                                    | 3.39.0  | Bibliothèque d'icônes                  |
| **Icons**            | [Lucide React](https://lucide.dev/)                                         | 0.564.0 | Bibliothèque d'icônes alternative      |
| **Calendar**         | [React Big Calendar](https://github.com/jquense/react-big-calendar)         | 1.19.4  | Calendrier interactif                  |
| **Date Picker**      | [React Day Picker](https://react-day-picker.js.org/)                        | 9.14.0  | Sélecteur de dates                     |
| **Charts**           | [Recharts](https://recharts.org/)                                           | 2.15.0  | Graphiques et visualisations           |
| **Formulaires**      | [React Hook Form](https://react-hook-form.com/)                             | 7.54.1  | Gestion des formulaires                |
| **Validation**       | [Zod](https://zod.dev/)                                                     | 4.3.6   | Schéma de validation                   |
| **Notificiations**   | [Sonner](https://sonner.emilkowal.ski/)                                     | 2.0.7   | Toast notifications                    |
| **Drag & Drop**      | [react-resizable-panels](https://github.com/bvaughn/react-resizable-panels) | 2.1.7   | Panneaux redimensionnables             |
| **Caroussel**        | [Embla Carousel](https://www.embla-carousel.com/)                           | 8.6.0   | Composant carrousel                    |
| **Analytique**       | [Vercel Analytics](https://vercel.com/analytics)                            | 1.6.1   | Analytics                              |
| **Déploiement**      | [Vercel](https://vercel.com/)                                               | -       | Hébergement optimisé                   |

---

## ✨ Fonctionnalités

### 👤 Authentification

- Écran de connexion sécurisé
- Écran d'inscription
- Gestion des tokens JWT
- Mot de passe oublié avec réinitialisation par email
- Stockage sécurisé des informations

### 🏢 Gestion des Organisations

- Création et modification d'une organisation
- Ajout de membres
- Configuration des paramètres
- Vue d'ensemble de l'organisation

### 👥 Gestion des Employés

- Liste complète des employés
- Ajout et modification des employés
- Affichage détaillé des informations
- Filtrage et recherche
- Visualisation par équipes

### 📋 Gestion des Services

- Création de nouveaux services
- Définition des rôles et permissions
- Association des employés aux services
- Liste avec filtrage
- Visualisation détaillée

### 👥 Gestion des Équipes

- Création d'équipes
- Ajout d'employés aux équipes
- Organisation hiérarchique
- Visualisation des membres
- Gestion des permissions

### 📅 Planning

- **Visualisation calendaire** avec React Big Calendar
- Création et modification des plannings
- Association des employés aux plannings
- Gestion des horaires et disponibilités
- Vue par jour/semaine/mois
- Drag & Drop pour le réordonnancement

### 📧 Gestion des Emails

- Formulaire de mot de passe oublié
- Envoi d'emails de réinitialisation
- Template personnalisable

---

## 🚀 Installation

### Prérequis

- [Node.js](https://nodejs.org/) (version 18 ou supérieure)
- [Yarn](https://yarnpkg.com/) ou [npm](https://www.npmjs.com/)
- [UniTable Backend](https://github.com/dankysten/unitable-backend) **en cours d'exécution**

### Étapes

1. **Cloner le dépôt**

   ```bash
   git clone https://github.com/dankysten/unitable-frontend-desktop.git
   cd unitable-frontend-desktop
   ```

2. **Installer les dépendances**

   ```bash
   yarn install
   # ou
   npm install
   ```

3. **Configurer l'environnement**
   Créer un fichier `.env` à la racine avec la variable suivante :

   ```env
   NEXT_PUBLIC_API_URL=http://localhost:4000
   ```

4. **Lancer l'application**

   ```bash
   # Mode développement
   yarn dev
   # ou
   npm run dev

   # Mode production
   yarn build && yarn start
   # ou
   npm run build && npm start
   ```

5. **Accéder à l'application**
   ```
   ✓ Compiled successfully
   🔗 Local:   http://localhost:3001
   ```
   L'application sera disponible à l'URL : `http://localhost:3001`

---

## 📁 Structure du Projet

```
unitable-frontend-desktop/
├── package.json               # Dépendances et scripts
├── next.config.js             # Configuration Next.js
├── next-env.d.ts              # Types TypeScript pour Next.js
├── tsconfig.json              # Configuration TypeScript
├── postcss.config.js          # Configuration PostCSS
├── tailwind.config.js         # Configuration Tailwind CSS
├── jest.config.js            # Configuration Jest
├── jsconfig.json              # Configuration des modules
├── .env                       # Variables d'environnement
├── .gitignore                 # Fichiers ignorés par Git
│
├── pages/
│   ├── _app.js                # Configuration globale
│   ├── index.js               # Page d'accueil
│   ├── login.js               # Connexion
│   ├── signup.js              # Inscription
│   ├── forgetPassword.js      # Mot de passe oublié
│   ├── sendEmailPassword.js   # Envoi email réinitialisation
│   ├── dashboard.js           # Tableau de bord
│   ├── businessForm.js        # Formulaire organisation
│   ├── createEmployee.js      # Création employé
│   ├── createTeams.js         # Création équipe
│   ├── services.js            # Gestion services
│   ├── viewEmployee.js        # Détails employé
│   ├── viewTeams.js           # Détails équipe
│   ├── planningAdmin.js       # Planning admin
│   ├── templatePlanning.js    # Template planning
│   └── viewPlanning.js        # Vue planning
│
├── components/
│   ├── ui/                    # Composants Radix UI / shadcn
│   │   └── ...
│   ├── Home.js                # Composant Home
│   ├── Meteo.js               # Composant météo
│   ├── HeaderAdminSignUp.js   # En-tête admin
│   ├── ActionButton.js        # Bouton d'action
│   ├── CTCard.js              # Carte CT
│   ├── ServiceCard.js         # Carte service
│   ├── ServiceWithRolesCard.js # Carte service avec rôles
│   ├── TeamCard.js            # Carte équipe
│   ├── CreateTeams.js         # Création équipe
│   ├── ModalOnboarding.js     # Modal d'onboarding
│   ├── EmailChangePassword.js # Changement mot de passe
│   └── ForgetPassword.js      # Mot de passe oublié
│
├── reducers/
│   ├── business.js           # Reducer organisation
│   ├── employee.js            # Reducer employés
│   ├── instructions.js        # Reducer instructions
│   ├── services.js           # Reducer services
│   ├── teams.js               # Reducer équipes
│   └── users.js               # Reducer utilisateurs
│
├── hooks/                     # Hooks personnalisés
│   └── ...
│
├── lib/                       # Utilitaires
│   └── ...
│
├── modules/                   # Modules
│   └── ...
│
├── public/                    # Fichiers statiques
│   └── ...
│
├── styles/                    # Styles globaux
│   └── ...
│
└── node_modules/              # Dépendances installées
```

---

## 🔌 Configuration Backend

L'application nécessite un backend fonctionnel. Par défaut, elle se connecte à :

```
http://localhost:4000
```

**Pour utiliser un backend déployé :**

1. Lancer le [UniTable Backend](../unitable-backend/README.md) ou utiliser l'URL déployée
2. Mettre à jour `.env` :
   ```env
   NEXT_PUBLIC_API_URL=https://unitable-backend.vercel.app
   ```

---

## 🎨 Personnalisation

### Thème

L'application utilise **Tailwind CSS v4** avec une configuration moderne. Tu peux personnaliser :

- Les couleurs dans `tailwind.config.js`
- Les polices et tailles
- Les espaces et bordures
- Les animations et transitions

### Composants

Les composants **Radix UI** et **shadcn/ui** offrent :

- Accessibilité intégrée
- Personnalisation complète via props
- Styles cohérents avec Tailwind

### Calendrier

Le composant **React Big Calendar** peut être configuré pour :

- Changer la vue par défaut (jour/semaine/mois)
- Personnaliser les couleurs des événements
- Ajouter des vues personnalisées
- Configurer les horaires affichés

### Graphiques

Les composants **Recharts** permettent de créer :

- Graphiques en barres
- Graphiques en lignes
- Graphiques circulaires
- Graphiques en aires
- Graphiques composites

---

## 🚀 Déploiement sur Vercel

### Déploiement automatique

1. Pousser le code sur un dépôt GitHub
2. Importer le projet sur [Vercel](https://vercel.com/)
3. Configurer les **Environment Variables** :
   - `NEXT_PUBLIC_API_URL` = URL de ton backend (ex: `https://unitable-backend.vercel.app`)
4. Vercel détectera automatiquement Next.js et configurera le déploiement

### Configuration recommandée

- **Node.js Version** : 18+
- **Build Command** : `yarn build` ou `npm run build`
- **Output Directory** : `.next`
- **Development Command** : `yarn dev` ou `npm run dev`

---

## 📜 Licence

Ce projet est sous **[Business Source License 1.1 (BSL 1.1)](https://mariadb.com/bsl11)**.

### 🆓 Utilisation gratuite autorisée

- Usage **personnel** et **non-commercial**
- Éducation, formation et tests
- Évaluation du produit

### 💰 Utilisation commerciale

Toute utilisation **commerciale** nécessite une **licence payante** :

- Déploiement en production
- Intégration dans un produit ou service payant
- Utilisation dans un contexte générant des revenus (directement ou indirectement)

### ⏳ Transition vers l'open source

Ce projet passera automatiquement sous **licence Apache 2.0** le **1er janvier 2030** (4 ans après la première publication).

### 📄 Obtenir une licence commerciale

Pour une licence commerciale, contactez-nous : </br>
📧 **contact@unitable.fr**
🌐 [**unitable.fr**](https://www.unitable.fr)

---

## 👤 Auteurs

| 📌 **Romain Authier** </br> 📧 [dankysten](https://github.com/dankysten) | 📌 **Fabien D.** </br> 📧 [tunguskha](https://github.com/tunguskha) | 📌 **Yécine H.** </br> 📧 [yecinepro-dot](https://github.com/yecinepro-dot) |
| ------------------------------------------------------------------------ | ------------------------------------------------------------------- | --------------------------------------------------------------------------- |

---

> _"Gérez votre organisation avec précision et élégance."_ 💻✨
