import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusSquare } from "lucide-react";
import { Toaster } from "sonner";
import { toast } from "sonner";
import ServiceWithRolesCard from "@/components/ServiceWithRolesCard";
import {
  addService,
  deleteTeamFromService,
  setServices,
} from "@/reducers/services";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  convertMinutesToTime,
  convertTimeToMinutes,
} from "@/modules/timeConversion";
import HeaderAdminSignUp from "@/components/HeaderAdminSignUp";
const uid2 = require("uid2");

export default function ViewPlanning() {
  const business = useSelector((state) => state.business.value) || [];
  const services = useSelector((state) => state.services.value) || [];
  const user = useSelector((state) => state.user.value);
  const dispatch = useDispatch();
  const router = useRouter();
  const [newServiceName, setNewServiceName] = useState("");
  const [newServiceStartTime, setNewServiceStartTime] = useState("");
  const [newServiceEndTime, setNewServiceEndTime] = useState("");
  const [newServiceDay, setNewServiceDay] = useState("");
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
      console.log(err.message);
    }
  };

  const days = [
    "lundi",
    "mardi",
    "mercredi",
    "jeudi",
    "vendredi",
    "samedi",
    "dimanche",
  ];
  useEffect(() => {
    restaurantId && getAllServices(restaurantId);
  }, [restaurantId]);

  const dayServices = (day) => {
    return services
      .filter((service) => service.dayOfWeek?.includes(day))
      .sort((a, b) => a.startTime - b.startTime)
      .map((service) => (
        <ServiceWithRolesCard
          key={service._id || service.id}
          service={service}
        />
      ));
  };

  const handleSubmit = async (day) => {
    dispatch(
      addService({
        id: uid2(10),
        name: newServiceName,
        startTime: convertTimeToMinutes(newServiceStartTime),
        endTime: convertTimeToMinutes(newServiceEndTime),
        dayOfWeek: [day],
        restaurant: business[0]?.id,
        teams: [],
      }),
    );
    setNewServiceName("");
    setNewServiceStartTime("");
    setNewServiceEndTime("");
    toast.success("Service ajouté avec succès !");
  };

  // Envoi en BDD > Services contenant équipes & rôles
  const handlePageValidation = async (servicesToDB) => {
    // console.log(
    //   "Début de la validation, voilà ce qui est envoyé en DB :",
    //   servicesToDB,
    // );
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

      getAllServices(restaurantId);
      toast.success("Mise à jour réussie !");
      //redirection vers dashboard

      router.push("/dashboard");
    } catch (err) {
      console.log(err);
      toast.error(err.message);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen overflow-y-auto">
      <HeaderAdminSignUp />
      <div className="flex-1 w-full max-w-350 mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4 items-start">
          {days.map((day) => (
            <div key={day} className="flex flex-col  p-4">
              <h2 className="text-lg font-bold mb-4 text-center">{`${day[0].toUpperCase()}${day.slice(1)}`}</h2>
              {/* Affichage des services pour chaque jour */}
              {dayServices(day)}
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" className="mb-2">
                    <PlusSquare className="mr-2" size={20} />
                    AJOUTER SERVICE
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-sm">
                  <DialogHeader>
                    <DialogTitle>
                      Ajouter un service pour{" "}
                      {`${day[0].toUpperCase()}${day.slice(1)}`}
                    </DialogTitle>
                  </DialogHeader>
                  <FieldGroup>
                    <Field>
                      <Label htmlFor="name">Nom du service</Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="Déjeuner"
                        value={newServiceName}
                        onChange={(e) => setNewServiceName(e.target.value)}
                      />
                    </Field>
                    <Field>
                      <Label htmlFor="startTime">Heure de début</Label>
                      <Input
                        id="startTime"
                        name="startTime"
                        type="time"
                        value={newServiceStartTime}
                        onChange={(e) => setNewServiceStartTime(e.target.value)}
                      />
                    </Field>
                    <Field>
                      <Label htmlFor="endTime">Heure de fin</Label>
                      <Input
                        id="endTime"
                        name="endTime"
                        type="time"
                        value={newServiceEndTime}
                        onChange={(e) => setNewServiceEndTime(e.target.value)}
                      />
                    </Field>
                  </FieldGroup>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Annuler</Button>
                    </DialogClose>
                    <DialogClose asChild>
                      <Button onClick={() => handleSubmit(day)}>Terminé</Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          ))}
        </div>
      </div>
      <div className="justify-center w-full flex p-4">
        <Button
          className="mr-15 cursor-pointer"
          onClick={() => handlePageValidation(services)}
        >
          Mettre à jour
        </Button>
      </div>
      <Toaster richColors position="top-right" />
    </div>
  );
}

export async function getStaticProps() {
  return {
    props: {
      title: "Semaine Type - Éditer",
      description: "Modifier votre semaine type.",
    },
  };
}
