import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { Button } from "./ui/button";
import TeamCard from "./TeamCard";
import { setTeams as setTeamsAction } from "@/reducers/teams";
import { Toaster } from "sonner";
import { toast } from "sonner";
import HeaderAdminSignUp from "@/components/HeaderAdminSignUp";
export default function ViewTeams() {
	const user = useSelector((state) => state.user.value);
	const business = useSelector((state) => state.business.value);
	const storeTeams = useSelector((state) => state.teams.value);
	const router = useRouter();
	const dispatch = useDispatch();
	const organizationId = business ? business[0]?.id : null;

	// State local pour l'édition du formulaire
	const [teams, setTeams] = useState([]);

	const defaultTeams = [
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
		},
	];

	const addTeamLocal = () =>
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
		if (!teams.length) {
			toast.error("Ajoute au moins une équipe !");
			return;
		}

		if (!organizationId) {
			toast.error("Organisation non définie !");
			return;
		}

		try {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_URL_BACKEND}/teams/addteams`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ equipes: teams, organizationId }),
				},
			);

			const data = await response.json();
			console.log("Response from backend:", data);

			if (data.success) {
				const savedTeams = data.team?.equipes || teams;
				dispatch(setTeamsAction(savedTeams));
				toast.success("Équipes sauvegardées avec succès !");
				router.push("/dashboard");
			} else {
				console.error(
					"Erreur lors de l'enregistrement :",
					data.message,
				);
				toast.error(
					"Erreur lors de la sauvegarde des équipes : " +
						data.message,
				);
			}
		} catch (error) {
			console.error("Erreur lors de la requête :", error);
			toast.error(
				"Erreur lors de la sauvegarde des équipes : " + error.message,
			);
		}
	};

	useEffect(() => {
		// Ne charger que si le store teams est vide
		/* console.log("Equipes dans le store au chargement: ", storeTeams);
    if (storeTeams.length > 0) {
      setTeams(storeTeams);
      return;
    }*/

		fetch(`${process.env.NEXT_PUBLIC_URL_BACKEND}/teams/` + business[0].id)
			.then((response) => response.json())
			.then((data) => {
				if (!data.result) {
					console.error("Reponse invalide pour les équipes :", data);
					dispatch(setTeamsAction(defaultTeams));
					setTeams(defaultTeams);
					return;
				}

				// Si des équipes existent en BDD, on les charge
				if (data.teams && data.teams.length > 0) {
					dispatch(setTeamsAction(data.teams));
					setTeams(data.teams);
				} else {
					// BDD vide : utiliser les équipes par défaut
					dispatch(setTeamsAction(defaultTeams));
					setTeams(defaultTeams);
				}
			})
			.catch((error) => {
				console.error(
					"Erreur lors de la récupération des équipes :",
					error,
				);
				dispatch(setTeamsAction(defaultTeams));
				setTeams(defaultTeams);
			});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// UseEffect sans dépendances pour ne charger qu'au montage du composant.

	return (
		//ajout du component header HeaderAdminSignUp

		<div className="h-screen bg-background flex flex-col overflow-hidden">
			<div className="flex-none p-6 space-y-6 max-w-3xl mx-auto w-full">
				<HeaderAdminSignUp />
				<div className="space-y-6">
					<h2 className="text-2xl font-semibold">Créer une équipe</h2>
					<p className="text-muted-foreground">
						Connecté en tant que : {user.email}
					</p>
					<div className="flex justify-between">
						<Button onClick={addTeamLocal}>
							Ajouter une équipe
						</Button>

						<Button
							variant="outline"
							onClick={handleSave}
							disabled={!teams.length || !organizationId}
						>
							Sauvegarder
						</Button>
					</div>
				</div>
			</div>
			<div className="flex-1 overflow-y-auto w-full min-h-0">
				<div className="max-w-3xl mx-auto px-6 pb-10">
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
		</div>
	);
}
