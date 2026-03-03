import Link from "next/link";
import { get } from "node:http";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ServiceCard } from "./ServiceCard";
import {
  updateService,
  updateIdRestaurant,
  addService,
} from "@/reducers/services";
import { Button } from "./ui/button";

export default function Services() {
  const business = useSelector((state) => state.business.value);
  const services = useSelector((state) => state.services.value);
  const dispatch = useDispatch();

  //   useState(() => {
  //     console.log("Etat du store: ", business);
  //   }, [business]);

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

  const serviceCards = services.map((service) => {
    return (
      <ServiceCard
        key={service.id}
        timeToMinutes={convertTimeToMinutes}
        minutesToTime={convertMinutesToTime}
        name={service.name}
        dayOfWeek={service.dayOfWeek}
        startTime={service.startTime}
        endTime={service.endTime}
        onUpdate={(newData) =>
          dispatch(updateService({ id: service.id, ...newData }))
        }
      />
    );
  });

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

  return (
    <div className="min-h-screen bg-background flex rounded-lg flex-col items-center  p-4">
      <div className=" rounded-lg bg-accent shadow-lg flex flex-row w-full justify-between h-28 items-center p-6">
        <div className=" text-accent-foreground">
          {business[0].businessCommercialName}
        </div>
        <div className=" text-accent-foreground">NOM USER</div>
      </div>
      <div className="flex flex-row flex-wrap w-full justify-center flex-1 items-center">
        {serviceCards}
        <Button variant="outline" className="mt-6" onClick={handleNewService}>
          Ajouter un service
        </Button>
      </div>
    </div>
  );
}
