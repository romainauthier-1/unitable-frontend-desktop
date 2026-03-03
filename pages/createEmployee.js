import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
	CardFooter,
} from "@/components/ui/card";
import {
	Field,
	FieldContent,
	FieldDescription,
	FieldLabel,
	FieldTitle,
} from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer";

export default function CreateEmployee() {
	const initialFormState = {
		firstName: "",
		lastName: "",
		birthDate: "",
		email: "",
		secuNumber: "",
		address: {
			street: "",
			city: "",
			zipCode: "",
		},
		phone: "",
		position: "",
		profil: "user", // Valeur par défaut sur le rôle de l'employé.e
		dateContract: "",
		typeContract: "",
		hourVolumn: "",
		contact: "",
	};

	const [formData, setFormData] = useState(initialFormState);

	// Gestion des inputs standards (prénom, nom, etc.)
	const handleChange = (event) => {
		const { id, value } = event.target;
		setFormData((prev) => ({ ...prev, [id]: value }));
	};

	// Gestion pour l'adresse
	const handleAddressChange = (event) => {
		const { id, value } = event.target;
		setFormData((prev) => ({
			...prev,
			address: { ...prev.address, [id]: value },
		}));
	};

	// Gestion pour le select
	const handleSelectChange = (fieldName, value) => {
		setFormData((prev) => ({ ...prev, [fieldName]: value }));
	};

	// Gestion pour le radio group
	const handleRadioChange = (value) => {
		setFormData((prev) => ({ ...prev, profil: value }));
	};

	// Envoie des données du formulaire
	const handleSubmit = (event) => {
		// Fetch le backend http://localhost:3000/users/signup pour créer un nouvel utilisateur/employé
		event.preventDefault();
		fetch("http://localhost:3000/users/employee", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(formData),
		})
			.then((response) => {
				if (!response.ok) {
					throw new Error("Erreur lors de la création de l'employé");
				}
				return response.json();
			})
			.then((data) => {
				setFormData(initialFormState); // Reset le formulaire après création
				console.log("Employé créé :", data);
			})
			.catch((error) => {
				console.error("Erreur:", error);
			});
	};

	// Reset le formulaire
	const handleReset = () => {
		setFormData(initialFormState);
	};

	return (
		<Drawer direction="right">
			<DrawerTrigger asChild>
				<Button variant="outline">Ajouter un employé</Button>
			</DrawerTrigger>

			<DrawerContent>
				<DrawerHeader>
					<DrawerTitle>Ajout d'un nouvel employé</DrawerTitle>
					<DrawerDescription>
						Remplissez les informations pour ajouter un nouvel
						employé.
					</DrawerDescription>
				</DrawerHeader>

				<div className="no-scrollbar overflow-y-auto px-4 space-y-4">
					<form id="employeeForm" className="space-y-4">
						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="lastName">
									Nom <span className="text-red-500">*</span>
								</Label>
								<Input
									id="lastName"
									placeholder="Dupont"
									value={formData.lastName}
									onChange={handleChange}
									required
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="firstName">
									Prénom{" "}
									<span className="text-red-500">*</span>
								</Label>
								<Input
									id="firstName"
									placeholder="Jean"
									value={formData.firstName}
									onChange={handleChange}
									required
								/>
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="email">
								Email <span className="text-red-500">*</span>
							</Label>
							<Input
								id="email"
								type="email"
								placeholder="jean.dupont@exemple.com"
								value={formData.email}
								onChange={handleChange}
								required
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="birthDate">Date de naissance</Label>
							<Input
								id="birthDate"
								type="date"
								value={formData.birthDate}
								onChange={handleChange}
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="phone">
								Numéro de téléphone{" "}
								<span className="text-red-500">*</span>
							</Label>
							<Input
								id="phone"
								type="tel"
								placeholder="0123456789"
								value={formData.phone}
								onChange={handleChange}
								pattern="[0-9]{10}"
								required
							/>
						</div>

						<div className="grid grid-cols-3 gap-4">
							<div className="space-y-2 col-span-2">
								<Label htmlFor="street">Rue</Label>
								<Input
									id="street"
									placeholder="1 rue de Paris"
									value={formData.address.street}
									onChange={handleAddressChange}
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="zipCode">Code postal</Label>
								<Input
									id="zipCode"
									placeholder="75000"
									value={formData.address.zipCode}
									onChange={handleAddressChange}
									pattern="[0-9]{5}"
								/>
							</div>
							<div className="space-y-2 col-span-3">
								<Label htmlFor="city">Ville</Label>
								<Input
									id="city"
									placeholder="Paris"
									value={formData.address.city}
									onChange={handleAddressChange}
								/>
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="secuNumber">
								Numéro de sécurité social
							</Label>
							<Input
								id="secuNumber"
								placeholder="123456789"
								value={formData.secuNumber}
								onChange={handleChange}
								pattern="[1-2][0-9]{14}"
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="dateContract">
								Date d'embauche
							</Label>
							<Input
								id="dateContract"
								type="date"
								value={formData.dateContract}
								onChange={handleChange}
							/>
						</div>

						<div className="space-y-2">
							<Label>
								Type de contrat{" "}
								<span className="text-red-500">*</span>
							</Label>
							<Select
								onValueChange={(value) =>
									handleSelectChange("typeContract", value)
								}
								value={formData.typeContract}
								required
							>
								<SelectTrigger className="w-full">
									<SelectValue placeholder="Type de contrat" />
								</SelectTrigger>
								<SelectContent>
									<SelectGroup>
										<SelectItem value="cdd">CDD</SelectItem>
										<SelectItem value="cdi">CDI</SelectItem>
										<SelectItem value="intérim">
											Intérim
										</SelectItem>
										<SelectItem value="saisonnier">
											Saisonnier
										</SelectItem>
										<SelectItem value="stagiaire">
											Stagiaire
										</SelectItem>
										<SelectItem value="alternant">
											Alternant.e
										</SelectItem>
									</SelectGroup>
								</SelectContent>
							</Select>
						</div>

						<div className="space-y-2">
							<Label>
								Emploi <span className="text-red-500">*</span>
							</Label>
							<Select
								onValueChange={(value) =>
									handleSelectChange("position", value)
								}
								value={formData.position}
								required
							>
								<SelectTrigger className="w-full">
									<SelectValue placeholder="Sélectionner un emploi" />
								</SelectTrigger>
								<SelectContent>
									<SelectGroup>
										<SelectItem value="runner">
											Runner
										</SelectItem>
										<SelectItem value="serveur">
											Serveur.se
										</SelectItem>
										<SelectItem value="chefRang">
											Chef.fe de rang
										</SelectItem>
										<SelectItem value="manager">
											Manager
										</SelectItem>
										<SelectItem value="barman">
											Barman/Barmaid
										</SelectItem>
										<SelectItem value="chefCuisine">
											Chef.fe de cuisine
										</SelectItem>
										<SelectItem value="secondCuisine">
											Second.e de cuisine
										</SelectItem>
										<SelectItem value="chefPartie">
											Chef.fe de partie
										</SelectItem>
										<SelectItem value="commisCuisine">
											Commis de cuisine
										</SelectItem>
										<SelectItem value="plongeur">
											Plongeur
										</SelectItem>
										<SelectItem value="direction">
											Direction
										</SelectItem>
									</SelectGroup>
								</SelectContent>
							</Select>
						</div>

						<div className="space-y-2">
							<Label htmlFor="hourVolumn">
								Volume horaire hebdomadaire
							</Label>
							<Input
								id="hourVolumn"
								type="number"
								min="0"
								max="50"
								placeholder="35"
								value={formData.hourVolumn}
								onChange={handleChange}
							/>
						</div>

						<div className="space-y-2">
							<Label>
								Rôle de l'employé.e{" "}
								<span className="text-red-500">*</span>
							</Label>
							<RadioGroup
								value={formData.profil}
								onValueChange={handleRadioChange}
								className="max-w-sm"
								required
							>
								<FieldLabel htmlFor="admin">
									<Field orientation="horizontal">
										<FieldContent>
											<FieldTitle>Admin</FieldTitle>
											<FieldDescription>
												Idéal pour les managers.
											</FieldDescription>
										</FieldContent>
										<RadioGroupItem
											value="admin"
											id="admin"
										/>
									</Field>
								</FieldLabel>
								<FieldLabel htmlFor="user">
									<Field orientation="horizontal">
										<FieldContent>
											<FieldTitle>User</FieldTitle>
											<FieldDescription>
												Rôle par défaut pour les
												employé.es.
											</FieldDescription>
										</FieldContent>
										<RadioGroupItem
											value="user"
											id="user"
										/>
									</Field>
								</FieldLabel>
							</RadioGroup>
						</div>
					</form>
				</div>

				<DrawerFooter className="flex flex-row border-t px-4">
					<Button
						variant="outline"
						onClick={handleReset}
						className="flex-1"
					>
						Annuler
					</Button>

					<Button
						onClick={handleSubmit}
						type="button"
						className="flex-1"
					>
						Créer l'employé
					</Button>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
}
