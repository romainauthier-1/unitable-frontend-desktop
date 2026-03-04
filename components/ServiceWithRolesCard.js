import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Clock, Trash2 } from "lucide-react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import {
  convertTimeToMinutes,
  convertMinutesToTime,
} from "../modules/timeConversion";

export default function ServiceWithRolesCard({ service }) {
  const teamsToDisplay = service.equipes?.map((team) => {
    return (
      <CardContent key={team.teamName}>
        <p className="text-sm font-bold">{team.teamName}</p>
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
            />
          </div>
        ))}
      </CardContent>
    );
  });

  return (
    <>
      <Card className="border border-primary mb-2">
        <CardHeader>
          <CardTitle className="flex flex-row items-center justify-evenly">
            <p className="text-md">{service.name}</p>
            <Trash2 className="text-destructive cursor-pointer " size={16} />
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-row justify-evenly">
          <p className="text-sm">
            {convertMinutesToTime(service.startTime || 0)}
          </p>
          <Clock className="text-primary" size={15} />
          <p className="text-sm">
            {convertMinutesToTime(service.endTime || 0)}
          </p>
        </CardContent>
        {teamsToDisplay}
      </Card>
    </>
  );
}
