import { useSelector } from "react-redux";

export const onboardingInfos = {
  "/services": {
    title: "Création des services",
    description:
      "Créez les services qui rythment vos journées et semaines. Créez autant de services que de schéma dont vous avez besoin (horaires, besoin en personnel). Si vous créez un service sur plusieurs jours, chaque changement effectué pour ce service sera appliqué pour ce service sur chaque jour où il est présent.",
    exemple: `Je suis ouvert du mercredi au dimanche. J'ai 2 services par jour; Déjeuner et Dîner. 
      Le rythme change entre la semaine et le week-end. Je crée 4 services: 
      - 'Déjeuner Semaine', du mercredi au vendredi, 
      - 'Déjeuner WE', le samedi et dimanche, 
      - 'Dîner Semaine', le mercredi, jeudi, et dimanche, 
      - 'Dîner WE', le vendredi et samedi.`,
    warning: "8 services différents maximum",
  },
  "/createTeams": {
    title: "Créez vos équipes",
    description: `Pour chaque équipe, indiquez quels rôles font partie de cette équipe. 
      Un rôle est une 'responsabilité' que vous attribuez à un.e employé.e pendant un service. 
      Il peut changer d'un service à l'autre, une personne peut avoir plusieurs rôles pendant un service. 
      Les rôles peuvent changer.`,
    exemple:
      "Dans mon restaurant, j'ai 2 équipes: la cuisine et la salle. En cuisine, pour chaque service, j'ai besoin des rôles Chef / Chaud / Froid / Plonge. En salle j'ai besoin des rôles Responsable / Serveur / Run / Bar.",
    warning: "1 équipe minimum, 20 équipes différentes maximum",
  },
  "/templatePlanning": {
    title: "Créez votre semaine type",
    description: `Indiquez pour chaque service, votre besoin en personnel selon le rôle.
      Si vous modifiez un besoin en personnel sur un service appliqué à plusieurs jours, cette modification sera répercutée sur tous les jours.`,
    exemple:
      "Pour le déjeuner en semaine, j'ai besoin en cuisine de 2 personnes au chaud, 1 personne au froid, et 1 personne en plonge.",
    warning: "Vous pouvez passez cette étape pour l'instant",
  },
};
