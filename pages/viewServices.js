import Link from "next/link";
import { get } from "node:http";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ServiceCard } from "../components/ServiceCard";
import {
	updateService,
	updateIdRestaurant,
	addService,
	setServices,
	deleteService,
} from "@/reducers/services";
import { Button } from "@/components/ui/button";
import { Toaster } from "sonner";
import { toast } from "sonner";
import { useRouter } from "next/router";
import HeaderAdminSignUp from "@/components/HeaderAdminSignUp";
import e from "cors";
const uid2 = require("uid2");

export default function Services() {
	const business = useSelector((state) => state.business.value);
	const services = useSelector((state) => state.services.value);
	const user = useSelector((state) => state.user.value);
	const dispatch = useDispatch();
	const router = useRouter();
	const restaurantId = business[0]?.id;

	const getAllServices = async (restaurantId) => {
		try {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_URL_BACKEND}/services/${restaurantId}`,
			);
			const data = await response.json();
			if (data.result) {
				const foundServices = await data.services;
				dispatch(setServices(foundServices));
			}
		} catch (err) {
			console.log(err);
		}
	};

	useEffect(() => {
		const serviceDejDefault = {
			id: uid2(10),
			name: "Déjeuner",
			startTime: 720,
			endTime: 840,
			dayOfWeek: ["mercredi", "jeudi", "vendredi", "samedi", "dimanche"],
			restaurant: business[0]?.id || null,
			teams: [],
		};
		const serviceDinerDefault = {
			id: uid2(10),
			name: "Dîner",
			startTime: 1140,
			endTime: 1260,
			dayOfWeek: ["mercredi", "jeudi", "vendredi", "samedi"],
			restaurant: business[0]?.id || null,
			teams: [],
		};
		// Ajout de l'id du restaurant aux services par défaut du reducer services
		// Empêche de recharger/réinitialiser si déjà présent dans le store.
		if (services != undefined || !business[0]?.id) return;

		fetch(
			`${process.env.NEXT_PUBLIC_URL_BACKEND}/services/` + business[0].id,
		)
			.then((response) => response.json())
			.then((data) => {
				if (!data.result) {
					dispatch(
						setServices([serviceDejDefault, serviceDinerDefault]),
					);
					console.error("Reponse invalide pour les services :", data);
					return;
				}

				if (Array.isArray(data.services) && data.services.length > 0) {
					dispatch(setServices(data.services));
					return;
				}

				dispatch(setServices([serviceDejDefault, serviceDinerDefault]));
			})
			.catch((error) => {
				console.error(
					"Erreur lors de la récupération des services :",
					error,
				);
			});
	}, [business[0]?.id, dispatch]);

	// Transformer l'heure (format 12:30) en 'minutes depuis minuit' pour l'envoyer à la BDD
	const convertTimeToMinutes = (timeString) => {
		const [hours, minutes] = timeString.split(":").map(Number);
		return hours * 60 + minutes;
	};

	const deleteServiceFromDB = (serviceId) => {
		try {
			fetch(
				`${process.env.NEXT_PUBLIC_URL_BACKEND}/services/${serviceId}`,
				{
					method: "DELETE",
				},
			)
				.then((response) => response.json())
				.then((data) => {
					if (data.result) {
						toast.success(data.message);
						dispatch(deleteService(serviceId));
					} else {
						toast.error(data.message || "Suppression impossible");
					}
				});
		} catch (err) {
			console.error("Erreur lors de la suppression du service :", err);
			toast.error("Erreur lors de la suppression du service");
		}
	};
	// Transformer les 'minutes depuis minuit' de la BDD en heure lisible
	const convertMinutesToTime = (minutes) => {
		const hours = Math.floor(minutes / 60);
		const mins = minutes % 60;
		return `${hours.toString().padStart(2, "0")}:${mins
			.toString()
			.padStart(2, "0")}`;
	};
	console.log("Services dans le store :", services);
	const serviceCards =
		services != undefined
			? services.map((service, i) => {
					// console.log("Service :", service);
					return (
						<ServiceCard
							key={service._id || service.id}
							timeToMinutes={convertTimeToMinutes}
							minutesToTime={convertMinutesToTime}
							name={service.name}
							dayOfWeek={service.dayOfWeek}
							startTime={service.startTime}
							endTime={service.endTime}
							onUpdate={(newData) =>
								dispatch(
									updateService({
										id: service._id || service.id,
										...newData,
									}),
								)
							}
							onDelete={() =>
								deleteServiceFromDB(service.id || service._id)
							}
						/>
					);
				})
			: [];

	// Ajout des services au reducer services
	const handleNewService = () => {
		const newService = {
			id: uid2(10),
			name: "Nouveau service",
			startTime: 720,
			endTime: 900,
			dayOfWeek: [],
			restaurant: business[0]?.id,
			teams: [],
		};
		dispatch(addService(newService));
	};

	// Les données sont enregistrées au fur et à mesure dans le store, on passe à la page suivante
	const handleValidation = async (servicesToDB) => {
		try {
			const promises = servicesToDB.map(async (service) => {
				// console.log("DEBUG SERVICE", JSON.stringify(service));
				// On extrait l'id utilisé dans le store de chaque service
				const existingService = service._id ? true : false;
				const method = existingService ? "PUT" : "POST";
				const url = existingService
					? `${process.env.NEXT_PUBLIC_URL_BACKEND}/services/${service?._id}`
					: `${process.env.NEXT_PUBLIC_URL_BACKEND}/services`;
				const { id, _id, ...serviceWithoutId } = service;
				// console.log("Voici le service en traitement: ", service);
				// console.log("serviceWithoutId.teams", serviceWithoutId.teams);

				const response = await fetch(url, {
					method: method,
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(serviceWithoutId),
				});

				const data = await response.json();

				if (!data.result) {
					throw new Error(data.message || "Un problème est survenu");
				}

				return data;
			});

			await Promise.all(promises);

			toast.success("Mise à jour réussie !");
			getAllServices(restaurantId);
		} catch (err) {
			console.log(err.message);
			toast.error(err.message);
		}
	};

	return (
		<div className="min-h-screen bg-white flex rounded-lg flex-col items-center  p-4">
			<HeaderAdminSignUp />
			<div className="flex flex-row flex-wrap w-full justify-center flex-1 items-center">
				{serviceCards}
			</div>
			<Button
				variant="outline"
				className="mt-6"
				onClick={handleNewService}
			>
				Ajouter un service
			</Button>
			<Button
				variant="outline"
				className="mt-6"
				onClick={() => handleValidation(services)}
			>
				Mettre à jour
			</Button>
		</div>
	);
}

export async function getStaticProps() {
	return {
		props: {
			title: "Services - Éditer",
			description: "Modifier vos services.",
		},
	};
}
