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
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Clock, ClockFading, ClockCheck } from "lucide-react";
import { convertMinutesToTime } from "@/modules/timeConversion";

export default function CTCard({ style, CT, employee }) {
  return (
    <Card
      style={style}
      className="flex flex-col justify-center p-1 gap-0 overflow-hidden h-full"
    >
      <CardHeader className="flex flex-row justify-evenly w-full p-1 ">
        <p className="min-w-0">
          {employee.firstName}
          {/* <span>{`${employee.lastName[0].toUpperCase()}.`}</span> */}
        </p>
        <p className="min-w-0">{convertMinutesToTime(CT.startTime)}</p>
        <p className="min-w-0">{convertMinutesToTime(CT.endTime)}</p>
      </CardHeader>
      <div className="flex flex-row flex-wrap justify-evenly min-w-0 text-overflow: ellipsis">
        {CT.role?.map((role) => (
          <Badge className="justify-center " variant="outline">
            {role}
          </Badge>
        ))}
      </div>
      <CardDescription className="flex flex-row justify-evenly text-xs min-w-0">
        <ClockFading size={10} />
        <p className="min-w-0">{`${CT.pause}min`}</p>
        <ClockCheck size={10} />
        <p className="min-w-0">
          {convertMinutesToTime(CT.endTime - CT.startTime - CT.pause)}
        </p>
      </CardDescription>
    </Card>
  );
}
