import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Clock, Trash2, PlusCircle, MinusCircle } from "lucide-react";
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
  addTeamToService,
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
import { deleteTeamFromService } from "@/reducers/services";

export default function ServiceWithRolesCard({ service }) {
  const dispatch = useDispatch();
  const services = useSelector((state) => state.services.value);
  const teamAvailable = useSelector(
    (state) => state.business.value[0]?.referenceTeams,
  );
  //const teamAvailable = useSelector((state) => state.teams.value);
  console.log("Teams disponibles pour ajout : ", teamAvailable);
  const teamDropdown = teamAvailable?.map((equipe) => (
    <DropdownMenuItem
      key={equipe.name}
      onClick={() => {
        // recuperer l'id du service concerné pour l'ajout de l'équipe
        const serviceId = service.id || service._id;
        console.log(equipe);
        dispatch(
          addTeamToService({
            id: serviceId,
            teamName: equipe.name,
            roles: equipe.roles,
          }),
        );
      }}
    >
      {equipe.name}
    </DropdownMenuItem>
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

  const teamsToDisplay =
    // service.teams.length > 1 &&
    service.teams?.map((team, teamIndex) => {
      const roleDropdown = team.roles?.map((role) => (
        <DropdownMenuItem key={role.name}>{role.name}</DropdownMenuItem>
      ));
      return (
        <div key={`${team.teamName}-${teamIndex}`} className="p-1">
          <div className="flex flex-row justify-between">
            <p className="text-sm font-bold">{team.teamName.split(" {")[0]}</p>
            <MinusCircle
              className="text-primary cursor-pointer"
              size={16}
              onClick={() =>
                warnAndDeleteTeam(service._id || service.id, team.teamName)
              }
            />
          </div>
          {team.roles.map((role) => (
            <div
              key={role.name}
              className="flex flex-row items-center justify-between"
            >
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <p className="text-sm truncate">{role.name}</p>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{role.name}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
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

  const warnAndDeleteTeam = (serviceId, teamName) => {
    toast.warning("Êtes-vous sûr de vouloir supprimer cette équipe ?", {
      description: "Cette action supprimera l'équipe sur tous les services.",
      action: {
        label: "Confirmer la suppression",
        onClick: () =>
          dispatch(deleteTeamFromService({ id: serviceId, teamName })),
      },
    });
  };

  return (
    <>
      <Toaster richColors position="top-right" />
      <Card className="border border-primary mb-2 w-full overflow-hidden">
        <CardHeader>
          <CardTitle className="flex flex-row items-center justify-between">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <p className="text-md text-ellipsis text-center">
                    {service.name}
                  </p>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{service.name}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardTitle>
          <Trash2
            className="text-destructive cursor-pointer hover:scale-110"
            size={16}
            onClick={() => warnAndDeleteService(service._id || service.id)}
          />
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
