import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Clock, Trash2, PlusCircle, Plus } from "lucide-react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import {
  convertTimeToMinutes,
  convertMinutesToTime,
} from "../modules/timeConversion";
import { useState } from "react";
import {
  updateService,
  updateIdRestaurant,
  addService,
  deleteService,
  updateTeamName,
  updateRoleName,
  updateRoleNeed,
} from "@/reducers/services";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Toaster } from "sonner";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";

export default function ServiceWithRolesCard({ service }) {
  const dispatch = useDispatch();
  const services = useSelector((state) => state.services.value);
  const [confirm, setConfirm] = useState(false);

  const teamDropdown = service.equipes?.map((equipe) => (
    <DropdownMenuItem key={equipe.teamName}>{equipe.teamName}</DropdownMenuItem>
  ));

  const addTeamButton = (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="w-full mt-2">
          <PlusCircle className="text-primary text-sm" size={16} />
          Équipe
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Choix de l'équipe</DropdownMenuLabel>
        {teamDropdown}
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const teamsToDisplay = service.equipes?.map((team) => {
    const roleDropdown = team.roles?.map((role) => (
      <DropdownMenuItem key={role.name}>{role.name}</DropdownMenuItem>
    ));
    return (
      <div key={team.teamName} className="p-1">
        <div className="flex flex-row justify-between">
          <p className="text-sm font-bold">{team.teamName}</p>
          <DropdownMenu>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <PlusCircle
                      className="text-primary cursor-pointer "
                      size={16}
                    />
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Ajouter un rôle</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <DropdownMenuContent>
              <DropdownMenuLabel>
                Choix du rôle ({team.teamName})
              </DropdownMenuLabel>
              {roleDropdown}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {team.roles.map((role) => (
          <div
            key={role.name}
            className="flex flex-row items-center justify-between"
          >
            <p className="text-sm">{role.name}</p>
            <Input
              className="flex shrink-0 w-10 p-1 text-center"
              type="number"
              value={role.need}
              onChange={(e) => {
                dispatch(
                  updateRoleNeed({
                    id: service.id,
                    teamName: team.teamName,
                    roleName: role.name,
                    need: e.target.value,
                  }),
                );
              }}
            />
          </div>
        ))}
      </div>
    );
  });

  const warnAndDeleteService = (serviceId) => {
    toast.warning("Êtes-vous sûr de vouloir supprimer ce service ?", {
      description:
        "Cette action est irréversible et supprimera le service de tous les jours.",
      action: {
        label: "Confirmer la suppression",
        onClick: () => dispatch(deleteService(serviceId)),
      },
    });
  };
  return (
    <>
      <Toaster richColors position="top-right" />
      <Card className="border border-primary mb-2 w-full">
        <CardHeader>
          <CardTitle className="flex flex-row items-center justify-evenly">
            <p className="text-md">{service.name}</p>
            <Trash2
              className="text-destructive cursor-pointer "
              size={16}
              onClick={() => warnAndDeleteService(service.id)}
            />
          </CardTitle>
        </CardHeader>
        <div className="flex flex-row justify-evenly">
          <p className="text-sm">
            {convertMinutesToTime(service.startTime || 0)}
          </p>
          <Clock className="text-primary" size={15} />
          <p className="text-sm">
            {convertMinutesToTime(service.endTime || 0)}
          </p>
        </div>
        {teamsToDisplay}
        {addTeamButton}
      </Card>
    </>
  );
}
