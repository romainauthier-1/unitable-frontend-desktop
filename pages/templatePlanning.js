import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusSquare } from "lucide-react";
import { Toaster } from "sonner";
import { toast } from "sonner";
import ServiceWithRolesCard from "@/components/ServiceWithRolesCard";

export default function templatePlanning() {
  const business = useSelector((state) => state.business.value);
  const services = useSelector((state) => state.services.value);
  const user = useSelector((state) => state.user.value);
  const dispatch = useDispatch();
  const router = useRouter();

  const days = [
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
    "Samedi",
    "Dimanche",
  ];

  const servicesToDisplay = services.map((service) => {
    return <ServiceWithRolesCard key={service.id} service={service} />;
  });
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="m-5 rounded-lg bg-accent shadow-lg flex flex-row w-full justify-between h-28 items-center p-6">
        <div className=" text-accent-foreground">
          {business[0]?.businessCommercialName ||
            "PAS DE RESTAURANT DANS LE STORE"}
        </div>
        <div className=" text-accent-foreground">
          {user?.email || "AUCUN UTILISATEUR CONNECTÉ"}
        </div>
      </div>
      <div className="flex flex-1">
        <div className="mx-auto max-w-10xl grid grid-cols-7 w-full h-full gap-4 ">
          {days.map((day) => (
            <div key={day} className="flex flex-col  p-4">
              <h2 className="text-lg font-bold mb-4 text-center">{day}</h2>
              {/* Affichage des services pour chaque jour */}
              {servicesToDisplay}
              <Button variant="ghost" className="mb-2">
                <PlusSquare className="mr-2" size={20} />
                AJOUTER SERVICE
              </Button>
            </div>
          ))}
        </div>
      </div>
      <div className="justify-between w-full flex p-4">
        <Button
          className="ml-15 cursor-pointer"
          onClick={() => router.push("/createTeam")}
        >
          PRÉCÉDENT
        </Button>
        <Button
          className="mr-15 cursor-pointer"
          onClick={() => router.push("/confirmPage")}
        >
          SUIVANT
        </Button>
      </div>
      <Toaster richColors position="top-right" />
    </div>
  );
}
