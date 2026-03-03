import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

export function ServiceCard({
  timeToMinutes,
  minutesToTime,
  name,
  startTime,
  endTime,
  onUpdate,
  dayOfWeek,
}) {
  const services = useSelector((state) => state.services.value);
  return (
    <>
      <Card className="w-1/3 h-1/2 border border-primary m-6">
        <CardHeader>
          <CardTitle className="flex flex-col items-center justify-center">
            <Input
              placeholder="Donner un nom au service"
              value={name || ""}
              onChange={(e) => onUpdate({ name: e.target.value })}
            />
          </CardTitle>
        </CardHeader>
        <div className="flex flex-row justify-between items-center">
          <CardContent className="flex flex-col justify-evenly items-center">
            <Label>Heure de début</Label>
            <Input
              type="time"
              value={minutesToTime(startTime || 0)}
              onChange={(e) =>
                onUpdate({ startTime: timeToMinutes(e.target.value) })
              }
            />
          </CardContent>
          <CardContent className="flex flex-col justify-evenly items-center">
            <Label>Heure de fin</Label>
            <Input
              type="time"
              value={minutesToTime(endTime || 0)}
              onChange={(e) =>
                onUpdate({ endTime: timeToMinutes(e.target.value) })
              }
            />
          </CardContent>
          <CardContent className="flex flex-col justify-evenly items-center">
            <Label>Jour de la semaine</Label>
            <Input
              type="text"
              value={dayOfWeek?.join(", ") || ""}
              onChange={(e) =>
                onUpdate({
                  dayOfWeek: e.target.value.split(", ").map((d) => d.trim()),
                })
              }
            />
          </CardContent>
        </div>
      </Card>
    </>
  );
}
