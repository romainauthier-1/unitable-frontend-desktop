import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Trash2, Clock } from "lucide-react";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Toggle } from "@radix-ui/react-toggle";

export function ServiceCard({
  timeToMinutes,
  minutesToTime,
  name,
  startTime,
  endTime,
  onUpdate,
  dayOfWeek,
  onDelete,
}) {
  const services = useSelector((state) => state.services.value);
  return (
    <>
      <Card className="w-full max-w-100 border border-slate-300 m-6 ">
        <CardHeader>
          <CardTitle className="flex flex-row items-center justify-between">
            <Input
              type="text"
              className="w-3/4 border-none bg-slate-50"
              placeholder="Donner un nom au service"
              value={name}
              onChange={(e) => onUpdate({ name: e.target.value })}
            />
            <Trash2
              className="text-destructive cursor-pointer w-1/4"
              size={18}
              onClick={onDelete}
            />
          </CardTitle>
        </CardHeader>
        <div className="flex flex-row justify-evenly items-center">
          <div className="flex flex-col justify-evenly items-center bg-slate-50 rounded-lg">
            <CardContent className="flex flex-col justify-evenly items-center">
              <Label className="align-middle text-center p-3">Début</Label>
              <Input
                className="cursor-pointer border-none"
                type="time"
                value={minutesToTime(startTime || 0)}
                onChange={(e) =>
                  onUpdate({ startTime: timeToMinutes(e.target.value) })
                }
              />
            </CardContent>
            <Clock className="text-primary" size={18} />
            <CardContent className="flex flex-col justify-evenly items-center">
              <Label className="align-middle text-center p-3">Fin</Label>
              <Input
                className="cursor-pointer border-none"
                type="time"
                value={minutesToTime(endTime || 0)}
                onChange={(e) =>
                  onUpdate({ endTime: timeToMinutes(e.target.value) })
                }
              />
            </CardContent>
          </div>
          <CardContent className="flex flex-col justify-evenly items-center">
            <Label className="text-lg">Jour de la semaine</Label>
            <ToggleGroup
              type="multiple"
              className="grid w-max grid-cols-2"
              value={dayOfWeek}
              onValueChange={(value) => onUpdate({ dayOfWeek: value })}
            >
              <ToggleGroupItem className="text-sm" value="lundi">
                Lun
              </ToggleGroupItem>
              <ToggleGroupItem className="text-sm" value="mardi">
                Mar
              </ToggleGroupItem>
              <ToggleGroupItem className="text-sm" value="mercredi">
                Mer
              </ToggleGroupItem>
              <ToggleGroupItem className="text-sm" value="jeudi">
                Jeu
              </ToggleGroupItem>
              <ToggleGroupItem className="text-sm" value="vendredi">
                Ven
              </ToggleGroupItem>
              <ToggleGroupItem className="text-sm" value="samedi">
                Sam
              </ToggleGroupItem>
              <ToggleGroupItem className="text-sm" value="dimanche">
                Dim
              </ToggleGroupItem>
            </ToggleGroup>
          </CardContent>
        </div>
      </Card>
    </>
  );
}
