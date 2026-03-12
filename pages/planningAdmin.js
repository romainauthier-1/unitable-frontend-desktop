import HeaderAdminSignUp from "@/components/HeaderAdminSignUp";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup } from "@/components/ui/field";
import {
  convertMinutesToTime,
  convertTimeToMinutes,
} from "@/modules/timeConversion";
import {
  ChevronLeft,
  ChevronsLeft,
  ChevronRight,
  ChevronsRight,
  PlusCircle,
  Edit,
  PlusSquare,
  LoaderPinwheel,
  ChevronDownIcon,
} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { fr } from "date-fns/locale";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import CTCard from "../components/CTCard";
import { useEffect, useState } from "react";
import { setEmployeesInStore } from "@/reducers/employee";
import { useSelector, useDispatch } from "react-redux";
import { Toaster } from "sonner";
import { toast } from "sonner";
const dayjs = require("dayjs");
require("dayjs/locale/fr");
const localizedFormat = require("dayjs/plugin/localizedFormat");
dayjs.locale("fr");
dayjs.extend(localizedFormat);

export default function planningAdmin() {
  const user = useSelector((state) => state.user.value);
  const business = useSelector((state) => state.business.value);
  const staff = useSelector((state) => state.employee.value.employees);
  const dispatch = useDispatch();
  const restaurantId = business[0]?.id;
  const [allCTs, setAllCTs] = useState([]);
  //   const [allStaff, setAllStaff] = useState([null]);
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [workingDate, setWorkingDate] = useState(dayjs());
  const [editMode, setEditMode] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newCTStartTime, setNewCTStartTime] = useState("11:30");
  const [newCTEndTime, setNewCTEndTime] = useState("15:30");
  const [newCTBreakTime, setNewCTBreakTime] = useState(0);
  const [worker, setWorker] = useState(null);
  const [newCTDate, setNewCTDate] = useState(new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [startHour, setStartHour] = useState(8);
  const [endHour, setEndHour] = useState(24);
  const referenceTeams = business[0]?.referenceTeams;
  const [services, setServices] = useState([]);

  const resetLocalStates = () => {
    setNewCTStartTime("11:30");
    setNewCTEndTime("15:30");
    setNewCTBreakTime(0);
    setWorker(null);
    setNewCTDate(new Date());
    setSelectedRoles([]);
  };

  const hoursInADay = Array.from({ length: endHour - startHour }).map(
    (day, i) => {
      const correctHour = i + startHour;
      return (
        <div
          className="text-left col-span-4 h-16 border-l border-slate-200 flex-none"
          key={i}
        >
          <span className="text-slate-400 font-light text-[15px]">{`${correctHour > 24 ? (correctHour - 24).toString().padStart(2, "0") : correctHour.toString().padStart(2, "0")}h`}</span>
        </div>
      );
    },
  );

  const getAllCTs = async (restaurantId) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL_BACKEND}/planning/all/${restaurantId}`,
    );
    const foundCTs = await response.json();
    setAllCTs(foundCTs.foundCTs);
    // console.log("CTs récupérés: ", foundCTs.foundCTs);
  };

  const getAllStaff = async (restaurantId) => {
    if (!restaurantId) return;

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL_BACKEND}/employee/${restaurantId}`,
    );

    const foundStaff = await response.json();

    if (!foundStaff.result) {
      toast.info(foundStaff.message);
      return;
    }
    // setAllStaff(foundStaff.employees);
    dispatch(setEmployeesInStore(foundStaff.employees));
    // console.log("Employé.es récupéré.es: ", foundStaff.employees);
  };

  const getAllServices = async (restaurantId) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL_BACKEND}/services/${restaurantId}`,
    );
    const data = await response.json();
    const foundServices = await data.services;
    setServices(foundServices);
    console.log("Services récupérés: ", foundServices);
  };

  useEffect(() => {
    if (restaurantId) {
      getAllCTs(restaurantId);
      getAllStaff(restaurantId);
      getAllServices(restaurantId);
    }
    console.log("Staff: ", staff);
  }, []);

  const updateCT = async (CTToUpdate) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL_BACKEND}/planning/update/${CTToUpdate._id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: dayjs(CTToUpdate.date).toISOString(),
          startTime: CTToUpdate.startTime,
          endTime: CTToUpdate.endTime,
          role: CTToUpdate.role,
          pause: CTToUpdate.pause,
          worker: CTToUpdate.worker,
          // restaurant: CTToUpdate.restaurant._id,
        }),
      },
    );

    const dataCT = await response.json();

    if (dataCT.result) {
      toast.success(dataCT.message);
      getAllCTs(restaurantId);
    } else {
      toast.error(dataCT.message);
    }
  };

  const deleteCT = async (idCT) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL_BACKEND}/planning/delete/${idCT}`,
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      },
    );

    const deletedCT = await response.json();

    if (deletedCT.result) {
      toast.success(deletedCT.message);
      getAllCTs(restaurantId);
    } else {
      toast.error(deletedCT.message);
    }
  };

  const openEditModal = async (CT) => {
    console.log("Etat du CT à modifier :", CT);
    setEditMode(CT);
    setNewCTStartTime(convertMinutesToTime(CT.startTime));
    setNewCTEndTime(convertMinutesToTime(CT.endTime));
    setNewCTBreakTime(CT.pause);
    setWorker(CT.worker._id);
    setNewCTDate(new Date(CT.date));
    setSelectedRoles(CT.role);
    setIsModalOpen(true);
    toast.info("Vous modifiez un créneau existant");
  };

  const todayCTs = allCTs.filter((CT) =>
    dayjs(workingDate).isSame(dayjs(CT.date), "day"),
  );

  const dailyHours = (employeeId) => {
    const todayEmployeeCTs = todayCTs.filter(
      (CT) => CT.worker._id === employeeId,
    );

    let hoursCount = 0;
    todayEmployeeCTs.map((CT) => {
      hoursCount += CT.endTime - CT.startTime - CT.pause;
    });

    return hoursCount;
  };

  const getWeeklyHours = (workerId) => {
    const startOfWeek = dayjs(workingDate).startOf("week");
    const endOfWeek = dayjs(workingDate).endOf("week");

    const weeklyMinutes = allCTs
      .filter((CT) => {
        const CTDate = dayjs(CT.date);
        return (
          CT.worker._id === workerId &&
          (CTDate.isSame(startOfWeek, "day") || CTDate.isAfter(startOfWeek)) &&
          (CTDate.isSame(endOfWeek, "day") || CTDate.isBefore(endOfWeek))
        );
      })
      .reduce((acc, CT) => {
        const duration = CT.endTime - CT.startTime - (Number(CT.pause) || 0);
        return acc + duration;
      }, 0);

    const hours = Math.floor(weeklyMinutes / 60);
    const minutes = weeklyMinutes % 60;
    return `${hours}h${minutes.toString().padStart(2, "0")}`;
  };

  const roleNeedForService = (serviceId) => {
    const targetService = services.find((service) => service._id === serviceId);
    if (!targetService) {
      toast.error("Aucun service trouvé");
      return [];
    }

    const allRolesInService = targetService.teams.flatMap((team) => team.roles);

    const rolesNeeded = allRolesInService.map((role) => {
      const CTsInService = todayCTs.filter(
        (CT) =>
          CT.startTime < targetService.endTime &&
          CT.endTime > targetService.startTime,
      );

      const planned = CTsInService.reduce((acc, CT) => {
        if (CT.role.includes(role.name)) {
          return acc + 1 / CT.role.length;
        }
        return acc;
      }, 0);
      return {
        name: role.name,
        need: role.need,
        planned: Number(planned.toFixed(2)),
      };
    });
    // console.log(
    //   `Résultat de roleNeed pour le service ${serviceId}:`,
    //   rolesNeeded,
    // );
    return rolesNeeded;
  };

  const totalColumns = (endHour - startHour) * 4;

  const staffToDisplay = staff.map((employee, i) => {
    const weeklyStr = getWeeklyHours(employee._id); // Format "35h15"
    const [wHours, wMins] = weeklyStr.split("h").map(Number);
    const totalWeeklyMinutes = wHours * 60 + wMins;

    const contractHours = Number(employee.hourVolumn) || 0;
    const totalContractMinutes = contractHours * 60;

    const hasContract = contractHours > 0;
    const isOver = hasContract && totalWeeklyMinutes > totalContractMinutes;
    const isUnder = hasContract && totalWeeklyMinutes < totalContractMinutes;

    const statusClasses = isOver
      ? "bg-red-50 text-red-700 border-red-200"
      : isUnder
        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
        : "bg-slate-50 text-slate-600 border-slate-200";

    return (
      <div
        className={` cursor-pointer w-full flex flex-row border-b border-slate-200 items-stretch min-h-16 ${i % 2 === 0 ? "bg-white" : "bg-slate-50"}`}
        key={employee?._id}
        onClick={() => {
          setWorker(employee._id);
          setNewCTStartTime(convertMinutesToTime(startHour * 60));
          setIsModalOpen(true);
        }}
      >
        <div className="sticky left-0 z-20 w-32 shrink-0 bg-inherit border-r flex flex-col justify-center px-3 py-2 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
          <span className="text-xs font-bold text-slate-800 truncate">
            {employee.firstName}
          </span>
          <div className="flex flex-col gap-1">
            <div
              className={`flex items-center justify-between px-1.5 py-0.5 rounded border font-mono text-[10px] font-bold ${statusClasses}`}
            >
              <span>{weeklyStr}</span>
              {hasContract && (
                <span className="text-[8px] opacity-60">
                  / {contractHours}h
                </span>
              )}
            </div>

            {hasContract && (
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all rounded-full duration-500 ${isOver ? "bg-red-500" : "bg-emerald-500"}`}
                  style={{
                    width: `${Math.min((totalWeeklyMinutes / totalContractMinutes) * 100, 100)}%`,
                  }}
                />
              </div>
            )}

            {!hasContract && (
              <span className="text-[8px] text-slate-400 italic">
                Contrat non défini
              </span>
            )}
          </div>
        </div>
        <div
          className="relative flex-1"
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${totalColumns}, 1fr)`,
          }}
        >
          {allCTs
            .filter(
              (CT) =>
                CT?.worker._id === employee._id &&
                dayjs(workingDate).isSame(dayjs(CT.date), "day"),
            )
            .map((CT) => {
              //   console.log("CT sur lequel on map:", CT);
              return (
                <CTCard
                  key={CT._id}
                  CT={CT}
                  employee={employee}
                  onDelete={deleteCT}
                  onUpdate={openEditModal}
                  restaurantId={restaurantId}
                  style={{
                    gridColumnStart:
                      Math.round((CT.startTime - startHour * 60) / 15) + 1,
                    gridColumnEnd:
                      Math.round((CT.endTime - startHour * 60) / 15) + 1,
                    gridRowStart: 1,
                  }}
                />
              );
            })}
        </div>
      </div>
    );
  });

  const createCT = async () => {
    // if (!editionMode) {
    //   toast.info("Activez le mode édition pour continuer");
    //   return;
    // }

    setIsLoading(true);

    const newCT = {
      date: dayjs(newCTDate).toISOString(),
      startTime: convertTimeToMinutes(newCTStartTime),
      endTime: convertTimeToMinutes(newCTEndTime),
      role: selectedRoles,
      pause: Number(newCTBreakTime),
      worker: worker,
      restaurant: restaurantId,
      createdBy: user?.id,
    };

    // console.log("CT à envoyer :", defaultCT);
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL_BACKEND}/planning/create`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCT),
      },
    );

    const data = await response.json();
    if (data.result) {
      toast.success(data.message);
      getAllCTs(restaurantId);
    } else {
      toast.error(data.message);
    }
    resetLocalStates();
    setIsLoading(false);
  };

  const toggleRole = (roleName) => {
    setSelectedRoles((prev) =>
      prev.includes(roleName)
        ? prev.filter((r) => r !== roleName)
        : [...prev, roleName],
    );
  };

  const handleModalSubmit = async () => {
    if (editMode) {
      const CTToUpdate = {
        _id: editMode._id,
        date: dayjs(newCTDate).toISOString(),
        startTime: convertTimeToMinutes(newCTStartTime),
        endTime: convertTimeToMinutes(newCTEndTime),
        role: selectedRoles,
        pause: Number(newCTBreakTime),
        worker: worker,
      };
      //   console.log("Etat du CT avant envoi BDD : ", CTToUpdate);
      updateCT(CTToUpdate);
      setIsModalOpen(false);
    } else {
      createCT();
      setIsModalOpen(false);
    }
  };

  //   const hoursToDisplay = convertMinutesToTime(dailyHours(employeeId))

  return (
    <div
      className={`h-screen w-full bg-white flex rounded-lg flex-col overflow-x-auto overflow-y-visible`}
    >
      <Toaster richColors position="top-right" />
      <HeaderAdminSignUp />
      <div className="flex flex-none flex-row justify-evenly items-center bg-slate-50/50 border-b border-b-slate-300">
        <div className="flex flex-row w-1/5">
          <Label>Début journée</Label>
          <Input
            value={startHour}
            onChange={(e) => setStartHour(Number(e.target.value))}
            type="number"
          />
          <Label>Fin journée</Label>
          <Input
            value={endHour}
            onChange={(e) => setEndHour(Number(e.target.value))}
            type="number"
          />
        </div>
        <Dialog
          open={isModalOpen}
          onOpenChange={(open) => {
            if (!open) {
              resetLocalStates();
              setEditMode(null);
            }
            setIsModalOpen(open);
          }}
        >
          <DialogTrigger asChild>
            <Button variant="ghost" className="mb-2">
              <Edit className="mr-2" size={20} />
              Planifier
            </Button>
          </DialogTrigger>
          <DialogContent className="w-full p-2">
            <DialogHeader>
              <DialogTitle className="text-center">
                Ajouter un créneau de travail
              </DialogTitle>
            </DialogHeader>
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-between text-left font-normal"
                  data-empty={!newCTDate}
                >
                  {newCTDate
                    ? dayjs(newCTDate).format("DD/MM/YYYY")
                    : "Choisir la date"}
                  <ChevronDownIcon className="h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                // className="w-100 p-0 shadow-md z-50"
                className="w-auto p-2 h-auto bg-white opacity-100 shadow-2xl border border-slate-200 z-100"
                align="center"
                side="bottom"
                sideOffset={4}
                portal={true}
              >
                <Calendar
                  mode="single"
                  locale={fr}
                  selected={newCTDate}
                  onSelect={(date) => {
                    setNewCTDate(date);
                    setIsCalendarOpen(false);
                  }}
                  defaultMonth={newCTDate}
                  classNames={{
                    months: "flex flex-col space-y-4",
                    month: "space-y-4",
                    caption:
                      "flex justify-center pt-2 relative items-center w-full min-h-[40px]",
                    caption_label: "text-sm font-medium",
                    nav: "static",
                    nav_button:
                      "h-7 w-full bg-transparent p-0 opacity-50 hover:opacity-100 flex items-center justify-between",
                    nav_button_previous: "absolute left-2 top-2 z-10",
                    nav_button_next: "absolute right-2 top-2 z-10",
                    table: "w-full border-collapse space-y-1",
                    head_row: "flex justify-between",
                    head_cell:
                      "text-slate-500 rounded-md w-9 font-normal text-[0.8rem]",
                    row: "flex w-full mt-2 justify-between",
                    cell: "h-9 w-9 text-center text-sm p-0 relative focus-within:relative focus-within:z-20",
                    day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-slate-100 rounded-md transition-all",
                    day_selected:
                      "bg-teal-500 text-white hover:bg-teal-600 focus:bg-teal-500 focus:text-white",
                    day_today: "bg-slate-100 text-slate-900",
                  }}
                  className="bg-white"
                />
              </PopoverContent>
            </Popover>
            <FieldGroup className="grid grid-cols-2 gap-4">
              <Field>
                <Label htmlFor="list">Employé.e</Label>
                <Select
                  id="list"
                  name="list"
                  onValueChange={(value) => setWorker(value)}
                  value={worker}
                >
                  <SelectTrigger id="worker-select" className="w-full">
                    <SelectValue placeholder="Choisir un.e employé.e" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectGroup>
                      {staff?.map((employee) => {
                        const formattedEmployee = `${employee?.firstName || ""} ${employee?.lastName || ""} (${employee?.position ? employee.position : "Poste non défini"})`;
                        return (
                          <SelectItem
                            key={employee?._id}
                            value={employee?._id || 12345}
                          >
                            {formattedEmployee}
                          </SelectItem>
                        );
                      })}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <Label htmlFor="startTime">Heure de début</Label>
                <Input
                  id="startTime"
                  name="startTime"
                  type="time"
                  step="900" // 900 secondes = 15min
                  value={newCTStartTime}
                  onChange={(e) => setNewCTStartTime(e.target.value)}
                />
              </Field>
              <Field>
                <Label htmlFor="endTime">Heure de fin</Label>
                <Input
                  id="endTime"
                  name="endTime"
                  type="time"
                  step="900" // 900 secondes = 15min
                  value={newCTEndTime}
                  onChange={(e) => setNewCTEndTime(e.target.value)}
                />
              </Field>
              <Field>
                <Label htmlFor="breakTime">Temps de pause (min)</Label>
                <Input
                  id="breakTime"
                  name="breakTime"
                  type="number"
                  step="15"
                  min="0"
                  max="120"
                  value={newCTBreakTime}
                  onChange={(e) => setNewCTBreakTime(e.target.value)}
                />
              </Field>
              <Field className="col-span-2">
                <Label>Poste(s) pour le service</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start font-normal h-auto min-h-10 flex-wrap gap-1 p-2"
                    >
                      {selectedRoles.length > 0 ? (
                        selectedRoles.map((role) => (
                          <span
                            key={role}
                            className="bg-blue-100 text-blue-700 text-[10px] px-2 py-0.5 rounded-full border border-blue-200"
                          >
                            {role}
                          </span>
                        ))
                      ) : (
                        <span className="text-muted-foreground">
                          Aucun rôle assigné
                        </span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-80 p-3"
                    align="start"
                    onWheel={(e) => e.stopPropagation()}
                  >
                    <div className="space-y-4 max-h-75 overflow-y-auto">
                      {referenceTeams?.map((team) => (
                        <div key={team.name} className="space-y-2">
                          {/* Nom de la Team (Cuisine, Salle...) */}
                          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b pb-1">
                            {team.name}
                          </h4>

                          <div className="grid grid-cols-1 gap-1">
                            {team.roles.map((role) => (
                              <div
                                key={role.name}
                                className={`flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors ${
                                  selectedRoles.includes(role.name)
                                    ? "bg-slate-100"
                                    : "hover:bg-slate-50"
                                }`}
                                onClick={() => toggleRole(role.name)}
                              >
                                <span className="text-sm">{role.name}</span>
                                {selectedRoles.includes(role.name) && (
                                  <div className="h-2 w-2 rounded-full bg-blue-500" />
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              </Field>
            </FieldGroup>
            <DialogFooter>
              <DialogClose asChild>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditMode(null);
                  }}
                >
                  Annuler
                </Button>
              </DialogClose>
              <DialogClose asChild>
                <Button onClick={handleModalSubmit}>Terminé</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Button
          variant="ghost"
          onClick={() => setWorkingDate(workingDate.subtract(1, "week"))}
        >
          <ChevronsLeft size={30} />
        </Button>
        <Button
          variant="ghost"
          onClick={() => setWorkingDate(workingDate.subtract(1, "day"))}
        >
          <ChevronLeft size={30} />
        </Button>
        <div
          className="m-4 text-accent-foreground text-xl text-center"
          onClick={() => setWorkingDate(currentDate)}
        >
          <p>{`Aujourd'hui : ${currentDate.format("dddd D MMMM YYYY")}`}</p>
          <p>{`Planning affiché : ${workingDate.format("dddd D MMMM YYYY")}`}</p>
        </div>
        <Button
          variant="ghost"
          onClick={() => setWorkingDate(workingDate.add(1, "day"))}
        >
          <ChevronRight size={30} />
        </Button>
        <Button
          variant="ghost"
          onClick={() => setWorkingDate(workingDate.add(1, "week"))}
        >
          <ChevronsRight size={30} />
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="flex flex-row w-full border-b border-slate-300 bg-white">
          <div className="w-32 shrink-0 border-r border-slate-200" />

          <div
            className="w-full"
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${totalColumns}, 1fr)`,
            }}
          >
            {hoursInADay}
          </div>
        </div>
        {staffToDisplay}
      </div>
      <footer className=" flex-none sticky bottom-0 z-50 w-full h-12 bg-white/80 backdrop-blur-md border-t border-slate-200 flex items-center px-4 overflow-visible">
        <div className="flex gap-2 items-center">
          {services
            ?.filter((service) =>
              service.dayOfWeek.includes(
                dayjs(workingDate).format("dddd").toLowerCase(),
              ),
            )
            .map((service) => (
              <div
                key={service._id}
                className="group relative min-w-fit cursor-pointer"
              >
                <p className="text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-md bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors">
                  {service.name}
                </p>
                <div
                  className="absolute bottom-full left-0 mb-2 z-9999 
                  opacity-0 scale-95 pointer-events-none 
                  transition-all duration-150 
                  group-hover:opacity-100 group-hover:scale-100 
                  group-hover:pointer-events-auto group-hover:-translate-y-1"
                >
                  <div className="bg-white border z-50 rounded-lg shadow-2xl p-3 min-w-37.5">
                    <p className="text-xs font-semibold mb-2">{service.name}</p>
                    <div className="space-y-1">
                      {roleNeedForService(service._id).map((role) => (
                        <div
                          key={role.name}
                          className="flex justify-between text-[11px]"
                        >
                          <span>{role.name}</span>
                          <span
                            className={
                              role.planned < role.need
                                ? "text-red-500 font-semibold"
                                : "text-green-600"
                            }
                          >
                            {role.planned} / {role.need}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </footer>
    </div>
  );
}

export async function getStaticProps() {
  return {
    props: {
      title: "Planning",
      description: "Planifier les journées de vos équipes.",
    },
  };
}
