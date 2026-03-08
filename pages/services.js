import Link from "next/link";
import { get } from "node:http";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ServiceCard } from "../components/ServiceCard";
import {
  updateService,
  updateIdRestaurant,
  addService,
  deleteService,
} from "@/reducers/services";
import { Button } from "@/components/ui/button";
import { Toaster } from "sonner";
import { toast } from "sonner";
import { useRouter } from "next/router";
import HeaderAdminSignUp from "@/components/HeaderAdminSignUp";
import { toggleInstructions } from "@/reducers/instructions";
const uid2 = require("uid2");

export default function Services() {
  const business = useSelector((state) => state.business.value);
  const services = useSelector((state) => state.services.value);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    // console.log(
    //   "Equipes dans le store au chargement: ",
    //   business[0]?.referenceTeams,
    // );
    const serviceDejDefault = {
      id: uid2(10),
      name: "Déjeuner",
      startTime: 720,
      endTime: 840,
      dayOfWeek: ["mercredi", "jeudi", "vendredi", "samedi", "dimanche"],
      restaurant: business[0]?.id,
      teams: [],
    };
    const serviceDinerDefault = {
      id: uid2(10),
      name: "Dîner",
      startTime: 1140,
      endTime: 1260,
      dayOfWeek: ["mercredi", "jeudi", "vendredi", "samedi"],
      restaurant: business[0]?.id,
      teams: [],
    };
    if (services.length === 0) {
      dispatch(addService(serviceDejDefault));
      dispatch(addService(serviceDinerDefault));
    }
  }, []);

  // Transformer l'heure (format 12:30) en 'minutes depuis minuit' pour l'envoyer à la BDD
  const convertTimeToMinutes = (timeString) => {
    const [hours, minutes] = timeString.split(":").map(Number);
    return hours * 60 + minutes;
  };

  // Transformer les 'minutes depuis minuit' de la BDD en heure lisible
  const convertMinutesToTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}`;
  };

  const serviceCards = services.map((service, i) => {
    // console.log("Service :", service);
    return (
      <ServiceCard
        key={i}
        timeToMinutes={convertTimeToMinutes}
        minutesToTime={convertMinutesToTime}
        name={service.name}
        dayOfWeek={service.dayOfWeek}
        startTime={service.startTime}
        endTime={service.endTime}
        onUpdate={(newData) =>
          dispatch(updateService({ id: service.id, ...newData }))
        }
        onDelete={() => dispatch(deleteService(service.id))}
      />
    );
  });

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
    if (services.length < 8) {
      dispatch(addService(newService));
    } else {
      toast.warning("Limite de 8 services atteinte.");
    }
  };

  // Envoi des services à la BDD
  // const handleValidation = async (services) => {
  //   // On extrait l'id du reducer avant d'envoyer en BDD
  //   for (const service of services) {
  //     const { id, ...servicesWithoutId } = service;
  //     const response = await fetch(
  //       `${process.env.NEXT_PUBLIC_URL_BACKEND}/services`,
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify(servicesWithoutId),
  //       },
  //     );

  //     const data = await response.json();
  //     if (data.result) {
  //       toast.success(data.message);
  //       // On attend 2 secondes avant la redirection
  //       setTimeout(() => {
  //         router.push("/templatePlanning");
  //       }, 2000);
  //     } else {
  //       toast.error(data.message);
  //       return;
  //     }
  //   }
  // };

  // Les données sont enregistrées au fur et à mesure dans le store, on passe à la page suivante
  const handleValidation = () => {
    toast.success("Services enregistrés");
    setTimeout(() => {
      router.push("templatePlanning");
    }, 1000);
  };

  return (
    <div className="min-h-screen min-w-screen bg-white flex rounded-lg flex-col items-center p-4">
      <HeaderAdminSignUp />
      <div className="flex flex-row flex-wrap w-full justify-center mb-6">
        {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-7xl justify-items-center mt-10"> */}
        {serviceCards}
      </div>
      <Button variant="outline" className="mt-6" onClick={handleNewService}>
        Ajouter un service
      </Button>
      <Button
        onClick={() =>
          dispatch(toggleInstructions(instructionStatus[router.pathname]))
        }
      >
        Voir instructions
      </Button>
      <Button
        variant="outline"
        className="mt-6"
        onClick={() => handleValidation(services)}
      >
        Valider
      </Button>
    </div>
  );
}

export async function getStaticProps() {
  return {
    props: {
      title: "Services",
      description:
        "Déterminez vos différents services. Si vous avez un service spécifique (en horaire, besoin de personnel), créez un service à part entière.",
    },
  };
}
