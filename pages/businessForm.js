import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { addBusiness, resetBusiness } from "../reducers/business";
import { updateIdRestaurant } from "@/reducers/services";
import { addName } from "@/reducers/users";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Store, User } from "lucide-react";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Field,
	FieldContent,
	FieldDescription,
	FieldLabel,
	FieldTitle,
	FieldError,
} from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Toaster } from "sonner";
import { toast } from "sonner";
import HeaderAdminSignUp from "@/components/HeaderAdminSignUp";

export default function BusinessForm() {
	const router = useRouter();
	const [siret, setSiret] = useState("");
	const [businessName, setBusinessName] = useState("");
	const [businessCommercialName, setBusinessCommercialName] = useState("");
	const [category, setCategory] = useState("");
	const [streetNumber, setStreetNumber] = useState("");
	const [streetType, setStreetType] = useState("");
	const [streetName, setStreetName] = useState("");
	const [zipCode, setZipCode] = useState("");
	const [city, setCity] = useState("");
	const [phoneNumber, setPhoneNumber] = useState("0612345678");
	const [error, setError] = useState({});
	const [logo, setLogo] = useState(null);
	const dispatch = useDispatch();
	const business = useSelector((state) => state.business.value);
	const user = useSelector((state) => state.user.value);

	const getUserName = async () => {
		try {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_URL_BACKEND}/users/${user.email}`,
			);
			const data = await response.json();

			if (!data.result) {
				toast.error(data.message);
			}

			if (data.user.firstName) {
				dispatch(addName(data.user.firstName));
			}
		} catch (err) {
			toast.error(err.message);
		}
	};

	useEffect(() => {
		getUserName();
		dispatch(resetBusiness());
	}, []);

	useEffect(() => {
		if (siret.length === 14) {
			getRestaurantInfos(siret);
		}

		// Le formulaire est automatiquement remis à zéro
		// si la plupart des inputs contiennent une info (résultat de recherche)
		// et que le siret ne contient plus que 12 chiffres (a commencé à être effacé)
		if (
			city &&
			businessName &&
			streetNumber &&
			streetName &&
			streetType &&
			zipCode &&
			siret.length <= 12
		) {
			emptyForm();
		}
	}, [siret]);

	const validationSiret = (value) => {
		const pattern = /^[0-9]{14}$/;
		if (!pattern.test(value)) {
			setError((prev) => ({
				...prev,
				siret: "Le SIRET doit comporter 14 chiffres",
			}));
		} else {
			setError((prev) => ({ ...prev, siret: null }));
		}
	};

	const validationPhoneNumber = (value) => {
		const pattern = /^0[1-9][0-9]{8}$/;
		if (!pattern.test(value)) {
			setError((prev) => ({
				...prev,
				phoneNumber:
					"Le format du numéro de téléphone doit être 0612345678 ou 0712345678",
			}));
		} else {
			setError((prev) => ({ ...prev, phoneNumber: null }));
		}
	};

	const validationBusinessName = (value) => {
		if (value === "" || !value) {
			setError((prev) => ({
				...prev,
				businessName: "Merci de remplir le nom de votre société",
			}));
		} else {
			setError((prev) => ({ ...prev, businessName: null }));
		}
	};

	const validationBusinessCommercialName = (value) => {
		if (value === "" || !value) {
			setError((prev) => ({
				...prev,
				businessCommercialName:
					"Merci de remplir le nom de votre établissement",
			}));
		} else {
			setError((prev) => ({ ...prev, businessCommercialName: null }));
		}
	};

	const validationZipCode = (value) => {
		const pattern = /^[0-9]{5}$/;
		if (!pattern.test(value)) {
			setError((prev) => ({
				...prev,
				zipCode: "Le code postal doit comporter 5 chiffres",
			}));
		} else {
			setError((prev) => ({ ...prev, zipCode: null }));
		}
	};

	const getRestaurantInfos = async (siret) => {
		try {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_URL_BACKEND}/organizations/${siret}`,
			);
			const data = await response.json();

			if (!data.result) {
				toast.error(err.message);
				console.error("Erreur: ", err.message);
			}

			const restaurant = data.restaurant;
			setBusinessName(
				restaurant.businessName ? restaurant.businessName : "",
			);
			setBusinessCommercialName(
				restaurant.businessCommercialName
					? restaurant.businessCommercialName
					: restaurant.businessName,
			);
			setStreetNumber(
				restaurant.businessAddress.number
					? restaurant.businessAddress.number
					: "",
			);
			setStreetType(
				restaurant.businessAddress.streetType
					? restaurant.businessAddress.streetType
					: "",
			);
			setStreetName(
				restaurant.businessAddress.streetName
					? restaurant.businessAddress.streetName
					: "",
			);
			setZipCode(
				restaurant.businessAddress.zipCode
					? restaurant.businessAddress.zipCode
					: "",
			);
			setCity(
				restaurant.businessAddress.city
					? restaurant.businessAddress.city
					: "",
			);
		} catch (err) {
			toast.error(err.message);
			console.error("Erreur: ", err.message);
		}
	};

	//   const addLogo = () => {
	//     formData = new FormData();
	//     formData.append("logo", logo);
	//   };

	const handleSubmit = async (
		e,
		siret,
		businessName,
		businessCommercialName,
		streetNumber,
		streetType,
		streetName,
		zipCode,
		city,
		phoneNumber,
		owner,
		category,
	) => {
		e.preventDefault();
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_URL_BACKEND}/organizations`,
			{
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					siret: siret,
					businessName: businessName,
					businessCommercialName: businessCommercialName,
					businessAddress: {
						number: streetNumber,
						streetType: streetType,
						streetName: streetName,
						zipCode: zipCode,
						city: city,
					},
					phoneNumber: phoneNumber,
					token: owner,
					category: category,
					referenceTeams: [],
				}),
			},
		);
		const data = await response.json();

		if (!data.result) {
			toast.warning(data.message);
			console.error(data.message);
		} else {
			// Ajout au reducer business
			dispatch(
				addBusiness({
					businessCommercialName,
					owner: user.name,
					id: data.id,
					referenceTeams: [],
				}),
				// Ajout dans la bdd l'id du restaurant sur la route put users/organization avec email et organizationId dans le body pour faire le lien entre les deux
				fetch(
					`${process.env.NEXT_PUBLIC_URL_BACKEND}/users/organization`,
					{
						method: "PUT",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({
							email: user.email,
							organizationId: data.id,
						}),
					},
				),
			);

			// Ajout de l'id du restaurant aux services par défaut du reducer services
			// dispatch(updateIdRestaurant({ id: 1, restaurant: data._id }));
			emptyForm();
			toast.success(data.message);

			// Redirection vers page services après 2 secondes
			setTimeout(() => {
				router.push("/createEmployee");
			}, 2000);
		}
	};

	const emptyForm = () => {
		setSiret("");
		setBusinessName("");
		setBusinessCommercialName("");
		setCategory("");
		setStreetNumber("");
		setStreetType("");
		setStreetName("");
		setZipCode("");
		setCity("");
		setPhoneNumber("");
	};

	return (
		<div className="min-h-screen min-w-screen bg-background flex rounded-lg flex-col items-center  p-4">
			<HeaderAdminSignUp />
			<div className="w-full m-10 max-w-2xl bg-background p-8 rounded-xl shadow-xl border border-salte-200">
				<h1 className="text-xl font-bold text-slate-800 mb-6 text-center">
					Renseignez les informations de votre établissement
				</h1>
				<form
					onSubmit={(e) =>
						handleSubmit(
							e,
							siret,
							businessName,
							businessCommercialName,
							streetNumber,
							streetType,
							streetName,
							zipCode,
							city,
							phoneNumber,
							user.token,
							category,
						)
					}
					className="space-y-6"
				>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="flex flex-col gap-2">
							<Label>
								SIRET<span className="text-destructive">*</span>
							</Label>
							<Input
								className="mt-1"
								placeholder="Numéro SIRET"
								type="text"
								inputMode="numeric"
								onChange={(e) => setSiret(e.target.value)}
								value={siret}
								onBlur={(e) => validationSiret(e.target.value)}
								required
							/>

							{error.siret && (
								<FieldError>{error.siret}</FieldError>
							)}
						</div>

						<div className="flex flex-col gap-2">
							<Label>
								Nom de la société
								<span className="text-destructive">*</span>
							</Label>
							<Input
								className="mt-1"
								required
								placeholder="Nom de la société"
								onChange={(e) =>
									setBusinessName(e.target.value)
								}
								value={businessName}
							/>
							{error.businessName && (
								<FieldError>{error.businessName}</FieldError>
							)}
						</div>

						<div className="flex flex-col gap-2">
							<Label>
								Nom de l'établissement
								<span className="text-destructive">*</span>
							</Label>
							<Input
								className="mt-1"
								required
								placeholder="Nom de l'établissement"
								onChange={(e) =>
									setBusinessCommercialName(e.target.value)
								}
								value={businessCommercialName}
							/>
							{error.businessCommercialName && (
								<FieldError>
									{error.businessCommercialName}
								</FieldError>
							)}
						</div>
						<div className="flex flex-col gap-2">
							<Label>Catégorie</Label>
							<Select
								onValueChange={(value) => setCategory(value)}
								value={category}
							>
								<SelectTrigger className="mt-1">
									<SelectValue placeholder="Choisir une catégorie"></SelectValue>
								</SelectTrigger>
								<SelectContent className="bg-white">
									<SelectGroup>
										<SelectItem value="Restaurant traditionnel">
											Restaurant traditionnel
										</SelectItem>
										<SelectItem value="Brasserie">
											Brasserie
										</SelectItem>
										<SelectItem value="Restaurant à thème">
											Restaurant à thème
										</SelectItem>
										<SelectItem value="Restaurant gastronomique">
											Restaurant gastronomique
										</SelectItem>
										<SelectItem value="Fast-food">
											Fast-food
										</SelectItem>
										<SelectItem value="Bar">Bar</SelectItem>
										<SelectItem value="Café">
											Café
										</SelectItem>
									</SelectGroup>
								</SelectContent>
							</Select>
						</div>
					</div>
					<div className="grid grid-cols-4 gap-2">
						<div className="col-span-1">
							<Label>N°</Label>
							<Input
								placeholder="478"
								inputMode="numeric"
								onChange={(e) =>
									setStreetNumber(e.target.value)
								}
								value={streetNumber}
							/>
						</div>

						<div className="col-span-1">
							<Label>Type de voie</Label>
							<Input
								placeholder="Rue, allée..."
								onChange={(e) => setStreetType(e.target.value)}
								value={streetType}
							/>
						</div>
						<div className="col-span-2">
							<Label>Nom de la voie</Label>
							<Input
								placeholder="Jean Monnet"
								onChange={(e) => setStreetName(e.target.value)}
								value={streetName}
							/>
						</div>
						<div className="col-span-1">
							<Label>Code Postal</Label>
							<Input
								placeholder="13005"
								inputMode="numeric"
								onChange={(e) => setZipCode(e.target.value)}
								onBlur={(e) =>
									validationZipCode(e.target.value)
								}
								value={zipCode}
							/>
							{error.zipCode && (
								<FieldError>{error.zipCode}</FieldError>
							)}
						</div>
						<div className="col-span-1">
							<Label>Ville</Label>
							<Input
								placeholder="Marseille"
								onChange={(e) => setCity(e.target.value)}
								value={city}
							/>
						</div>
						<div className="col-span-2">
							<Label>
								Numéro de téléphone
								<span className="text-destructive">*</span>
							</Label>
							<Input
								required
								inputMode="numeric"
								placeholder="0612345678"
								onChange={(e) => setPhoneNumber(e.target.value)}
								onBlur={(e) =>
									validationPhoneNumber(e.target.value)
								}
								value={phoneNumber}
							/>
							{error.phoneNumber && (
								<FieldError>{error.phoneNumber}</FieldError>
							)}
						</div>
					</div>

					{/* <input
            id="logo"
            className={styles.formInput}
            type="file"
            accept="image/*"
            onChange={(e) => setLogo(e.target.files[0])}
            ></input> */}
					<div className="flex w-full flex-row items-center justify-between gap-4 pt-4 border-t border-t-slate-500 ">
						<Button
							type="button"
							variant="ghost"
							onClick={emptyForm}
							className="text-slate-400 transition-colors hover:text-destructive"
						>
							Réinitialiser
						</Button>
						<Button
							type="submit"
							className="px-8  bg-brand-dark shadow-md transition-all active:scale-95 hover:bg-accent hover:text-accent-foreground"
						>
							Enregistrer
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
}

export async function getStaticProps() {
	return {
		props: {
			title: "Enregistrement du restaurant",
			description:
				"Renseignez les informations de base de votre établissement.",
		},
	};
}
