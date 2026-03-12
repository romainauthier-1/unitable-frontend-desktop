import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  TooltipProvider,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Clock, ClockFading, ClockCheck, Edit, Trash2 } from "lucide-react";
import { convertMinutesToTime } from "@/modules/timeConversion";

export default function CTCard({
  style,
  CT,
  employee,
  restaurantId,
  onDelete,
  onUpdate,
}) {
  const isSmallCard = CT.endTime - CT.startTime <= 60 ? true : false;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Card
            style={style}
            className="flex flex-col justify-center p-1 gap-0 overflow-hidden h-full shadow-sm border-l-2 border-l-accent-foreground"
          >
            <CardHeader className="flex flex-row justify-evenly w-full p-1 ">
              <p className="min-w-0 truncate text-xs">
                {isSmallCard
                  ? employee.firstName.slice(0, 3)
                  : `${employee.firstName} ${employee.lastName[0]}`}
              </p>
              <p className="min-w-0 truncate text-xs">
                {convertMinutesToTime(CT.startTime)}
              </p>
              {isSmallCard ? (
                ""
              ) : (
                <p className="min-w-0 truncate text-xs">
                  {convertMinutesToTime(CT.endTime)}
                </p>
              )}
            </CardHeader>
            <div className="flex flex-row flex-wrap justify-evenly min-w-0 text-overflow: ellipsis">
              {!isSmallCard && (
                <>
                  {CT.role?.map((role) => (
                    <Badge
                      className="justify-center truncate text-xs"
                      variant="outline"
                    >
                      {role}
                    </Badge>
                  ))}
                </>
              )}
            </div>
            <CardDescription className="flex flex-row justify-evenly text-xs min-w-0">
              {!isSmallCard && (
                <>
                  <ClockCheck size={15} />
                  <p className="min-w-0 truncate text-xs">
                    {convertMinutesToTime(CT.endTime - CT.startTime - CT.pause)}
                  </p>
                  <ClockFading size={15} />
                  <p className="min-w-0 truncate text-xs">{`${CT.pause}min`}</p>
                </>
              )}
              <Edit
                className="cursor-pointer hover:text-primary hover:scale-110 transition-all"
                size={isSmallCard ? 10 : 15}
                onClick={() => onUpdate(CT)}
              />
              <Trash2
                className="text-destructive cursor-pointer hover:scale-110 transition-all"
                size={isSmallCard ? 10 : 15}
                onClick={() => onDelete(CT._id)}
              />
            </CardDescription>
          </Card>
        </TooltipTrigger>
        <TooltipContent side="top" className="p-3">
          <div className="text-xs space-y-1">
            <p className="font-bold">
              {employee.firstName} {employee.lastName}
            </p>
            <p>
              {convertMinutesToTime(CT.startTime)} —{" "}
              {convertMinutesToTime(CT.endTime)}
            </p>
            <p className="text-white italic">Rôle(s) : {CT.role?.join(", ")}</p>
            <p className="text-white">Pause : {CT.pause} min</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
