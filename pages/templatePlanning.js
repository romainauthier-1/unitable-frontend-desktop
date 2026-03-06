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
import { addService } from "@/reducers/services";
import { addReferenceTeams } from "@/reducers/business";
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

export default function templatePlanning() {
  const business = useSelector((state) => state.business.value);
  const services = useSelector((state) => state.services.value);
  const user = useSelector((state) => state.user.value);
  const dispatch = useDispatch();
  const router = useRouter();
  const [newServiceName, setNewServiceName] = useState("");
  const [newServiceStartTime, setNewServiceStartTime] = useState("");
  const [newServiceEndTime, setNewServiceEndTime] = useState("");
  const [newServiceDay, setNewServiceDay] = useState("");

  const days = [
    "lundi",
    "mardi",
    "mercredi",
    "jeudi",
    "vendredi",
    "samedi",
    "dimanche",
  ];

  const getDefaultTeamsAndRoles = async (businessId) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_URL_BACKEND}/teams/${businessId}`,
      );
      const data = await response.json();
      const equipes = data.equipes;
      // console.log("Équipes et rôles par défaut récupérés :", equipes);
      dispatch(addReferenceTeams({ businessId, equipes }));
    } catch (err) {
      toast.error(
        err.message ||
          "Erreur lors de la récupération des équipes et rôles par défaut",
      );
    }
  };

  useEffect(() => {
    if (business[0]?.id) {
      getDefaultTeamsAndRoles(business[0]?.id);
    } else {
      toast.warning(
        "Aucun restaurant trouvé. Veuillez créer un restaurant pour continuer.",
      );
    }
  }, []);

  const dayServices = (day) => {
    return services
      .filter((service) => service.dayOfWeek?.includes(day))
      .sort((a, b) => a.startTime - b.startTime)
      .map((service) => (
        <ServiceWithRolesCard key={service.id} service={service} />
      ));
  };

  const handleSubmit = (day) => {
    dispatch(
      addService({
        id: Date.now(),
        name: newServiceName,
        startTime: convertTimeToMinutes(newServiceStartTime),
        endTime: convertTimeToMinutes(newServiceEndTime),
        dayOfWeek: [day],
        equipes: [],
      }),
    );
    setNewServiceName("");
    setNewServiceStartTime("");
    setNewServiceEndTime("");
    toast.success("Service ajouté avec succès !");
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <HeaderAdminSignUp />
      <div className="flex flex-1">
        <div className="mx-auto max-w-10xl grid grid-cols-7 w-full h-full gap-4 ">
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
      <div className="justify-between w-full flex p-4">
        <Button
          className="ml-15 cursor-pointer"
          onClick={() => router.push("/services")}
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
