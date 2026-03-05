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

export default function Services() {
  const business = useSelector((state) => state.business.value);
  const services = useSelector((state) => state.services.value);
  const user = useSelector((state) => state.user.value);
  const dispatch = useDispatch();
  const router = useRouter();

  // Ajout de l'id du restaurant aux services par défaut du reducer services
  useEffect(() => {
    dispatch(updateIdRestaurant(business[0]?.id));
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
    console.log("Service :", service);
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
      id: services.length + 1,
      name: "Nouveau service",
      startTime: 720,
      endTime: 900,
      dayOfWeek: [""],
      restaurant: business[0]?.id,
    };
    dispatch(addService(newService));
  };

  // Suppression des services du reducer services
  const handleDeleteService = (id) => {
    dispatch(deleteService(id));
  };

  // Envoi des services à la BDD
  const handleValidation = async (services) => {
    // On extrait l'id du reducer avant d'envoyer en BDD
    for (const service of services) {
      const { id, ...servicesWithoutId } = service;
      const response = await fetch(
        `http://${process.env.NEXT_PUBLIC_URL_BACKEND}/services`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(servicesWithoutId),
        },
      );

      const data = await response.json();
      if (data.result) {
        toast.success(data.message);
        // On attend 2 secondes avant la redirection
        setTimeout(() => {
          router.push("/createTeam");
        }, 2000);
      } else {
        toast.error(data.message);
        return;
      }
    }
  };

  return (
    <div className="min-h-screen bg-background flex rounded-lg flex-col items-center  p-4">
      <div className=" rounded-lg bg-accent shadow-lg flex flex-row w-full justify-between h-28 items-center p-6">
        <div className=" text-accent-foreground">
          {business[0]?.businessCommercialName ||
            "PAS DE RESTAURANT DANS LE STORE"}
        </div>
        <div className=" text-accent-foreground">{user?.email}</div>
      </div>
      <Toaster richColors position="top-right" />
      <div className="flex flex-row flex-wrap w-full justify-center flex-1 items-center">
        {serviceCards}
      </div>
      <Button variant="outline" className="mt-6" onClick={handleNewService}>
        Ajouter un service
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
