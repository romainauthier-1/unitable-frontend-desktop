import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { Button } from "./ui/button";
import TeamCard from "./TeamCard";
import { addReferenceTeams } from "@/reducers/business";

export default function CreateTeams() {
  const user = useSelector((state) => state.user.value);
  const business = useSelector((state) => state.business.value);
  const router = useRouter();
  const dispatch = useDispatch();
  const organizationId = business ? business[0]?.id : null;

  // const [teams, setTeams] = useState([]);

  const [teams, setTeams] = useState([
    {
      name: "Cuisine",
      roles: [
        { name: "Chef.fe", need: 1 },
        { name: "Froid", need: 1 },
        { name: "Chaud", need: 1 },
        { name: "Dessert", need: 1 },
        { name: "Plonge", need: 1 },
      ],
    },
    {
      name: "Salle",
      roles: [
        { name: "Responsable", need: 1 },
        { name: "Serveur", need: 1 },
        { name: "Run", need: 1 },
        { name: "Bar", need: 1 },
      ],
    },
    {
      name: "Bureau",
      roles: [{ name: "Compta", need: 1 }],
      roles: [{ name: "RH", need: 1 }],
    },
  ]);

  // const roles = [
  // 	{ value: "runner", label: "Runner" },
  // 	{ value: "serveur", label: "Serveur.se" },
  // 	{ value: "chefRang", label: "Chef.fe de rang" },
  // 	{ value: "manager", label: "Manager" },
  // 	{ value: "barman", label: "Barman/Barmaid" },
  // 	{ value: "chefCuisine", label: "Chef.fe de cuisine" },
  // 	{ value: "secondCuisine", label: "Second.e de cuisine" },
  // 	{ value: "chefPartie", label: "Chef.fe de partie" },
  // 	{ value: "commisCuisine", label: "Commis de cuisine" },
  // 	{ value: "plongeur", label: "Plongeur" },
  // 	{ value: "direction", label: "Direction" },
  // ];

  const addTeam = () =>
    setTeams((teams) => [{ name: "", roles: [] }, ...teams]);

  const removeTeam = (index) => setTeams(teams.filter((_, i) => i !== index));

  const updateTeamName = (index, value) => {
    const updated = [...teams];
    updated[index].name = value;
    setTeams(updated);
  };

  const addRole = (teamIndex) => {
    const updated = [...teams];
    updated[teamIndex].roles.push({ name: "", need: 1 });
    setTeams(updated);
  };

  const removeRole = (teamIndex, roleIndex) => {
    const updated = [...teams];
    updated[teamIndex].roles.splice(roleIndex, 1);
    setTeams(updated);
  };

  const updateRole = (teamIndex, roleIndex, field, value) => {
    const updated = [...teams];
    updated[teamIndex].roles[roleIndex][field] = value;
    setTeams(updated);
  };

  const handleSave = async () => {
    if (!teams.length) return console.log("Ajoute au moins une équipe !");
    if (!organizationId) return console.log("Organisation non définie !");

    try {
      // const res = await fetch(`${process.env.NEXT_PUBLIC_URL_BACKEND}/teams`, {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ organizationId, teams: teams }),
      // });

      // const data = await res.json();
      // if (data.success) {
      //   console.log("Équipes enregistrées :", data.team);
      //   router.push("/services");
      // } else {
      //   console.log("Erreur lors de l'enregistrement :", data.message);
      // }
      // console.log("Info dispatch - id Business : ", organizationId);
      // console.log("Info dispatch - format teams : ", teams);
      dispatch(addReferenceTeams({ businessId: organizationId, teams }));
      router.push("/services");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <h2 className="text-2xl font-semibold">Créer une équipe</h2>
        <p className="text-muted-foreground">
          Connecté en tant que : {user.email}
        </p>
        <div className="flex justify-between">
          <Button onClick={addTeam}>Ajouter une équipe</Button>

          <Button variant="outline" onClick={handleSave}>
            Suivant
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {teams.map((team, teamIndex) => (
            <TeamCard
              key={teamIndex}
              team={team}
              teamIndex={teamIndex}
              // roles={roles}
              updateTeamName={updateTeamName}
              addRole={addRole}
              removeRole={removeRole}
              updateRole={updateRole}
              removeTeam={removeTeam}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
