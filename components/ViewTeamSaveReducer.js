import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { Button } from "./ui/button";
import TeamCard from "./TeamCard";
import { addBusiness, addReferenceTeams } from "@/reducers/business";
import { Toaster } from "sonner";
import { toast } from "sonner";
import HeaderAdminSignUp from "@/components/HeaderAdminSignUp";

export default function ViewTeamSaveReducer() {
	const user = useSelector((state) => state.user.value);
	const business = useSelector((state) => state.business.value) || [];
	const storeTeams = useSelector(
		(state) => state.business.value.referenceTeams,
	);
	const router = useRouter();
	const dispatch = useDispatch();
	const organizationId = business?.[0]?.id || null;

	// State local pour l'édition du formulaire
	const [teams, setTeams] = useState([]);
	const [services, setServices] = useState([]);
	const [hasLoadedFromBusiness, setHasLoadedFromBusiness] = useState(false);

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

	const deleteTeamFromDB = async (serviceId, teamName) => {
		try {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_URL_BACKEND}/services/${serviceId}/teams/${encodeURIComponent(teamName)}`,
				{ method: "DELETE" },
			);
			const data = await response.json();
			if (!data.result) {
				toast.error(data.message || "Suppression impossible");
			} else {
				toast.success("Équipe supprimée avec succès");
			}
		} catch (error) {
			console.error("Erreur lors de la suppression de l'équipe :", error);
			toast.error("Erreur lors de la suppression de l'équipe");
		}
	};

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
		if (!Array.isArray(teams) || teams.length === 0) {
			toast.error("Ajoute au moins une équipe !");
			return;
		}

		if (!organizationId) {
			toast.error("Organisation non définie !");
			return;
		}

		try {
			const hasbusiness =
				Array.isArray(business) &&
				business.some((item) => item.id === organizationId);
			if (!hasbusiness) {
				const sourceBusiness = business.find(
					(item) => item.id === organizationId,
				);
				dispatch(
					addBusiness({
						businessCommercialName:
							sourceBusiness?.businessCommercialName || "",
						owner: sourceBusiness?.owner || user?.name || "",
						id: organizationId,
						referenceTeams: [],
					}),
				);
			}

			dispatch(addReferenceTeams({ businessId: organizationId, teams }));
			toast.success("Équipes sauvegardées avec succès dans Redux !");
			router.push("/dashboard");
		} catch (error) {
			console.error("Erreur lors de la sauvegarde :", error);
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

		if (!organizationId) {
			setTeams(defaultTeams);
			return;
		}

		// Ne pas refetch si on a déjà chargé les referenceTeams depuis business
		if (hasLoadedFromBusiness) {
			return;
		}

		fetch(
			`${process.env.NEXT_PUBLIC_URL_BACKEND}/services/` + organizationId,
		)
			.then((response) => response.json())
			.then((data) => {
				if (!data.result) {
					console.error("Reponse invalide pour les équipes :", data);
					setTeams(defaultTeams);
					return;
				}

				// Extraire toutes les équipes non vides depuis chaque service
				if (Array.isArray(data.services) && data.services.length > 0) {
					setServices(data.services);
					const teamsFromServices = data.services.flatMap(
						(service) =>
							Array.isArray(service.teams)
								? service.teams
										.filter(
											(team) =>
												Array.isArray(team.roles) &&
												team.roles.length > 0,
										)
										.map((team) => ({
											// concatener name et 3 derniers caractères de l'id du service pour différencier les équipes de même nom sur différents services
											name: `${team.teamName || team.name || ""}-${(service.id || service._id)?.slice(-3)}`,
											serviceId:
												service.id || service._id,
											roles: Array.isArray(team.roles)
												? team.roles.map((role) => ({
														name: role.name,
														need: role.need,
													}))
												: [],
										}))
								: [],
					);

					if (teamsFromServices.length > 0) {
						setTeams(teamsFromServices);
						return;
					}
				}

				const referenceTeams = business[0]?.referenceTeams;
				if (referenceTeams?.length > 0) {
					setTeams(referenceTeams);
					return;
				}

				// BDD vide : utiliser les équipes par défaut
				setTeams(defaultTeams);
			})
			.catch((error) => {
				console.error(
					"Erreur lors de la récupération des équipes :",
					error,
				);
				setTeams(defaultTeams);
			});
	}, [organizationId, dispatch, hasLoadedFromBusiness]);

	// UseEffect sans dépendances pour ne charger qu'au montage du composant.

	// Charger les referenceTeams depuis le reducer business quand elles deviennent disponibles
	useEffect(() => {
		if (
			!hasLoadedFromBusiness &&
			business &&
			business[0]?.referenceTeams &&
			Array.isArray(business[0].referenceTeams) &&
			business[0].referenceTeams.length > 0
		) {
			console.log(
				"Chargement des referenceTeams depuis business:",
				business[0].referenceTeams,
			);
			setTeams(business[0].referenceTeams);
			setHasLoadedFromBusiness(true);
		}
	}, [business, hasLoadedFromBusiness]);

	return (
		//ajout du component header HeaderAdminSignUp

		<div className="min-h-screen bg-background p-6">
			<HeaderAdminSignUp />
			<div className="max-w-3xl mx-auto space-y-6">
				<h2 className="text-2xl font-semibold">Créer une équipe</h2>
				<p className="text-muted-foreground">
					Connecté en tant que : {user?.email || "Chargement..."}
				</p>
				<div className="flex justify-between">
					<Button onClick={addTeamLocal}>Ajouter une équipe</Button>

					<Button
						variant="outline"
						onClick={handleSave}
						disabled={
							!Array.isArray(teams) ||
							teams.length === 0 ||
							!organizationId
						}
					>
						Sauvegarder
					</Button>
				</div>
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					{Array.isArray(teams) &&
						teams.map((team, teamIndex) => (
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
								serviceId={team.serviceId}
								onDeleteTeamFromDB={deleteTeamFromDB}
							/>
						))}
				</div>
			</div>
		</div>
	);
}
