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

export default function CreateEmployee() {
	const [formData, setFormData] = useState({
		firstName: "",
		lastName: "",
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
	});

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

	const handleSubmit = (event) => {
		event.preventDefault();
		console.log("Données de l'employé :", formData);
		alert("Employé créé avec succès (voir console) !");
	};

	return (
		<div className="container mx-auto py-10 flex justify-center">
			<Card className="w-full max-w-2xl">
				<CardHeader>
					<CardTitle>Ajout d'un nouvel employé</CardTitle>
					<CardDescription>
						Remplissez les informations pour ajouter un nouvel
						employé.
					</CardDescription>
				</CardHeader>

				<form onSubmit={handleSubmit}>
					<CardContent className="space-y-4">
						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="firstName">
									Prénom
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
							<div className="space-y-2">
								<Label htmlFor="lastName">
									Nom<span className="text-red-500">*</span>
								</Label>
								<Input
									id="lastName"
									placeholder="Dupont"
									value={formData.lastName}
									onChange={handleChange}
									required
								/>
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="email">
								Email<span className="text-red-500">*</span>
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
							<Label htmlFor="phone">
								Numéro de téléphone
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
								<Label htmlFor="street">
									Rue<span className="text-red-500">*</span>
								</Label>
								<Input
									id="street"
									placeholder="1 rue de Paris"
									value={formData.address.street}
									onChange={handleAddressChange}
									required
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="zipCode">
									Code postal
									<span className="text-red-500">*</span>
								</Label>
								<Input
									id="zipCode"
									inputMode="numeric"
									pattern="[0-9]{5}"
									placeholder="75000"
									value={formData.address.zipCode}
									onChange={handleAddressChange}
									required
								/>
							</div>
							<div className="space-y-2 col-span-3">
								<Label htmlFor="city">
									Ville<span className="text-red-500">*</span>
								</Label>
								<Input
									id="city"
									placeholder="Paris"
									value={formData.address.city}
									onChange={handleAddressChange}
									required
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
								pattern="[1-2][0-9]{14}"
								value={formData.secuNumber}
								onChange={handleChange}
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
								Type de contrat
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
								Emploi<span className="text-red-500">*</span>
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
							<Label htmlFor="hourVolume">
								Volume horaire hebdomadaire
							</Label>
							<Input
								id="hourVolume"
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
								Rôle de l'employé.e
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
					</CardContent>

					<CardFooter className="flex justify-between border-t px-6 py-4">
						<Button variant="outline" type="button">
							Annuler
						</Button>
						<Button type="submit">Créer l'employé</Button>
					</CardFooter>
				</form>
			</Card>
		</div>
	);
}
