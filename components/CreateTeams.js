import { useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";

import { Button } from "./ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardFooter,
} from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

export default function CreateTeams() {
	const user = useSelector((state) => state.user.value);
	const business = useSelector((state) => state.business.value);
	const router = useRouter();
	const organizationId = business ? business[0]?.id : null;

	const [teams, setTeams] = useState([]);

	const handleSave = async () => {
		if (!teams.length)
			return alert("Ajoute au moins une équipe !" + organizationId);
		if (!organizationId) return alert("Organisation non définie !");

		try {
			const res = await fetch("http://localhost:3000/teams", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ organizationId, equipes: teams }),
			});

			const data = await res.json();
			if (data.success) {
				alert("Équipes enregistrées !");
				router.push("/index");
			} else {
				alert("Erreur : " + data.message);
			}
		} catch (err) {
			console.error(err);
			alert("Erreur lors de l'enregistrement");
		}
	};

	// Liste des rôles disponibles
	const ROLE_OPTIONS = [
		{ value: "runner", label: "Runner" },
		{ value: "serveur", label: "Serveur.se" },
		{ value: "chefRang", label: "Chef.fe de rang" },
		{ value: "manager", label: "Manager" },
		{ value: "barman", label: "Barman/Barmaid" },
		{ value: "chefCuisine", label: "Chef.fe de cuisine" },
		{ value: "secondCuisine", label: "Second.e de cuisine" },
		{ value: "chefPartie", label: "Chef.fe de partie" },
		{ value: "commisCuisine", label: "Commis de cuisine" },
		{ value: "plongeur", label: "Plongeur" },
		{ value: "direction", label: "Direction" },
	];

	const addTeam = () => {
		setTeams([...teams, { name: "", roles: [] }]);
	};

	const removeTeam = (index) => {
		const updated = [...teams];
		updated.splice(index, 1);
		setTeams(updated);
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

	return (
		<div className="min-h-screen bg-background p-6">
			<div className="max-w-3xl mx-auto space-y-6">
				<h2 className="text-2xl font-semibold">Créer une équipe</h2>

				<p className="text-muted-foreground">
					Connecté en tant que : {user.email}
				</p>

				<Button onClick={addTeam}>Ajouter une équipe</Button>

				{teams.map((team, teamIndex) => (
					<Card key={teamIndex}>
						<CardHeader className="flex flex-row justify-between items-center">
							<CardTitle>Équipe</CardTitle>
							<Button
								variant="destructive"
								size="sm"
								onClick={() => removeTeam(teamIndex)}
							>
								Supprimer
							</Button>
						</CardHeader>

						<CardContent className="space-y-4">
							<Input
								placeholder="Nom de l'équipe (ex: cuisine)"
								value={team.name}
								onChange={(e) =>
									updateTeamName(teamIndex, e.target.value)
								}
							/>

							<Button
								variant="secondary"
								size="sm"
								onClick={() => addRole(teamIndex)}
							>
								Ajouter un rôle
							</Button>

							{team.roles.map((role, roleIndex) => (
								<div
									key={roleIndex}
									className="flex gap-4 items-end"
								>
									<div className="flex-1 space-y-2">
										<Label>Rôle / poste</Label>

										<Select
											value={role.name}
											onValueChange={(value) =>
												updateRole(
													teamIndex,
													roleIndex,
													"name",
													value,
												)
											}
										>
											<SelectTrigger>
												<SelectValue placeholder="Sélectionner un emploi" />
											</SelectTrigger>

											<SelectContent>
												<SelectGroup>
													{ROLE_OPTIONS.map(
														(roleOption) => (
															<SelectItem
																key={
																	roleOption.value
																}
																value={
																	roleOption.value
																}
															>
																{
																	roleOption.label
																}
															</SelectItem>
														),
													)}
												</SelectGroup>
											</SelectContent>
										</Select>
									</div>

									<div className="w-24 space-y-2">
										<Label>Nombre</Label>
										<Input
											type="number"
											min="0"
											value={role.need}
											onChange={(e) =>
												updateRole(
													teamIndex,
													roleIndex,
													"need",
													Number(e.target.value),
												)
											}
										/>
									</div>

									<Button
										variant="ghost"
										size="icon"
										onClick={() =>
											removeRole(teamIndex, roleIndex)
										}
									>
										✕
									</Button>
								</div>
							))}
						</CardContent>
					</Card>
				))}
			</div>
			<Button variant="outline" onClick={handleSave}>
				Suivant
			</Button>
		</div>
	);
}
