# 💻 UniTable — Back-office (desktop)

Application web des managers d'UniTable, une solution de gestion du personnel pour la restauration : création de l'établissement, gestion des employés, des services et des équipes, et construction des plannings.

Réalisé en équipe de 3, en sprint de 10 jours.

| Repo | Rôle |
| ---- | ---- |
| [unitable-backend](https://github.com/romainauthier-1/unitable-backend) | API REST |
| **unitable-frontend-desktop** (ce repo) | back-office web des managers · [démo](https://unitable-frontend-desktop.vercel.app) |
| [unitable-frontend-mobile](https://github.com/romainauthier-1/unitable-frontend-mobile) | application mobile des employés · [démo](https://unitable-mobile.vercel.app) |

![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-2-764ABC?logo=redux&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?logo=tailwind-css&logoColor=white)
![shadcn/ui](https://img.shields.io/badge/shadcn/ui-Radix-000000)

---

## Fonctionnalités

- **Inscription du manager et onboarding** : création de l'établissement à partir de son **SIRET**. Les informations légales et l'adresse sont pré-remplies via l'API (données INSEE).
- **Employés** : création de fiches complètes (contrat, volume horaire, contact d'urgence), modification, suppression, envoi d'une invitation par e-mail.
- **Services et équipes** : services par jour de la semaine (midi, soir…), équipes et rôles avec effectifs requis.
- **Planning** : création, modification et suppression des créneaux de travail de chaque employé, avec calcul du volume horaire hebdomadaire.
- **Tableau de bord** : vue d'accueil avec la météo du jour (OpenWeatherMap).
- **Mot de passe oublié** : demande de lien par e-mail et page de réinitialisation.
- **Accès réservé aux managers** : seuls les comptes administrateurs peuvent se connecter au back-office, et les pages sont protégées tant que l'utilisateur n'est pas connecté.

## Stack technique

| Domaine | Choix |
| ------- | ----- |
| Framework | Next.js 16 (Pages Router), React 19 |
| État | Redux Toolkit + redux-persist |
| UI | shadcn/ui (Radix), Tailwind CSS 4, Tabler et Lucide icons, Sonner |
| Formulaires et dates | react-hook-form, Zod, Day.js / date-fns, react-day-picker |
| Déploiement | Vercel |

## Installation

Prérequis : Node.js 20+, [corepack](https://nodejs.org/api/corepack.html) (active la bonne version de Yarn), et l'[API UniTable](https://github.com/romainauthier-1/unitable-backend) lancée en local (ou l'URL déployée).

```bash
git clone https://github.com/romainauthier-1/unitable-frontend-desktop.git
cd unitable-frontend-desktop
corepack enable
yarn install
cp .env.example .env.local   # renseigner les variables ci-dessous
yarn dev                     # http://localhost:3001
```

| Variable | Rôle |
| -------- | ---- |
| `NEXT_PUBLIC_URL_BACKEND` | URL de l'API (ex. `http://localhost:3000`) |
| `NEXT_PUBLIC_OPENWEATHERMAP_API_KEY` | clé OpenWeatherMap (météo du tableau de bord, optionnelle) |

## Structure

```
pages/            login, signup, businessForm (onboarding), dashboard,
                  createEmployee / viewEmployee, services / viewServices,
                  createTeams / viewTeams, planningAdmin, viewPlanning,
                  forgetPassword / sendEmailPassword
components/       composants métier (cartes service, équipe, créneau, onboarding…)
components/ui/    composants shadcn/ui et layout (sidebar, header, formulaires)
reducers/         utilisateur, établissement, employés, services, équipes
modules/          conversion des horaires
```

---

## 👤 Auteurs

| 📌 **Romain Authier** </br> 📧 [dankysten](https://github.com/dankysten) | 📌 **Fabien D.** </br> 📧 [tunguskha](https://github.com/tunguskha) | 📌 **Yécine H.** </br> 📧 [yecinepro-dot](https://github.com/yecinepro-dot) |
| ------------------------------------------------------------------------ | ------------------------------------------------------------------- | --------------------------------------------------------------------------- |
