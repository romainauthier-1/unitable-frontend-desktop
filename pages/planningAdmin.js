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
  const [editionMode, setEditionMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newCTStartTime, setNewCTStartTime] = useState("11:30");
  const [newCTEndTime, setNewCTEndTime] = useState("15:30");
  const [newCTBreakTime, setNewCTBreakTime] = useState(0);
  const [worker, setWorker] = useState(null);
  const [newCTDate, setNewCTDate] = useState(new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const referenceTeams = business[0]?.referenceTeams;
  const hoursInADay = Array.from({ length: 24 }).map((day, i) => {
    return (
      <div className="text-left col-span-4" key={i}>
        {`${i.toString().padStart(2, "0")}h`}
      </div>
    );
  });

  const getAllCTs = async (restaurantId) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL_BACKEND}/planning/all/${restaurantId}`,
    );
    const foundCTs = await response.json();
    setAllCTs(foundCTs.foundCTs);
    // console.log("CTs récupérés: ", foundCTs.response);
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

  useEffect(() => {
    if (restaurantId) {
      getAllCTs(restaurantId);
      getAllStaff(restaurantId);
    }
    // console.log("Staff: ", staff);
  }, []);

  const staffToDisplay = staff.map((employee) => {
    // console.log("Employee sur lequel on map:", employee);
    return (
      <div
        className="grid grid-cols-[repeat(100,1fr)] w-375 h-20"
        key={employee.id}
      >
        <div className="grid grid-cols-[repeat(96,1fr)] relative h-20 col-span-96">
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
                  style={{
                    gridColumnStart: Math.round(CT.startTime / 15) + 1,
                    gridColumnEnd: Math.round(CT.endTime / 15) + 1,
                    gridRowStart: 1,
                  }}
                />
              );
            })}
        </div>
      </div>
    );
  });

  const toggleEditionMode = async () => {
    if (editionMode === true) {
    }
    setEditionMode(!editionMode);
  };

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
      pause: newCTBreakTime,
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
    setNewCTStartTime("11:30");
    setNewCTEndTime("15:30");
    setNewCTBreakTime(0);
    setWorker(null);
    setNewCTDate(new Date());
    setSelectedRoles([]);
    setIsLoading(false);
  };

  const toggleRole = (roleName) => {
    setSelectedRoles((prev) =>
      prev.includes(roleName)
        ? prev.filter((r) => r !== roleName)
        : [...prev, roleName],
    );
  };

  const editModeStyle = editionMode
    ? {
        backgroundColor: "#f8fafc",
        backgroundImage: `linear-gradient(to right, #e2e8f0 1px, transparent 1px)`,
        transition: "all 0.3s ease",
      }
    : {
        transition: "all 0.3s ease",
      };
  return (
    <div
      style={editModeStyle}
      className={`h-screen w-fit bg-white flex rounded-lg flex-col overflow-x-auto`}
    >
      <Toaster richColors position="top-right" />
      <HeaderAdminSignUp />
      <div className="flex flex-row justify-evenly items-center">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" className="mb-2">
              <Edit className="mr-2" size={20} />
              Planifier
            </Button>
          </DialogTrigger>
          <DialogContent className="w-full p-4">
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
                className="w-100 p-0 shadow-md"
                align="center"
                side="bottom"
                position="popper"
              >
                <Calendar
                  mode="single"
                  selected={newCTDate}
                  onSelect={(date) => {
                    setNewCTDate(date);
                    setIsCalendarOpen(false);
                  }}
                  defaultMonth={newCTDate}
                  className="bg-white h-full w-full"
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
                        const formattedEmployee = `${employee.firstName} ${employee.lastName} (${employee.position ? employee.position : "Poste non défini"})`;
                        return (
                          <SelectItem key={employee._id} value={employee._id}>
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
                  value={newCTBreakTime}
                  onChange={(e) => setNewCTBreakTime(e.target.value)}
                />
              </Field>
              <Field className="col-span-2">
                <Label>Missions / Postes</Label>
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
                  <PopoverContent className="w-80 p-3" align="start">
                    <div className="space-y-4 max-h-[300px] overflow-y-auto">
                      {referenceTeams.map((team) => (
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
                <Button variant="outline">Annuler</Button>
              </DialogClose>
              <DialogClose asChild>
                <Button onClick={() => createCT()}>Terminé</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        {/* {editionMode && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="">
                <PlusCircle className="text-primary text-sm" size={16} />
                Employé.es
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Planifier l'employé.e</DropdownMenuLabel>
              {staffAvailable}
            </DropdownMenuContent>
          </DropdownMenu>
        )} */}
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
          <p>{workingDate.format("dddd D MMMM YYYY")}</p>
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
      <div className="grid grid-cols-[repeat(100,1fr)] w-375">
        {hoursInADay}
      </div>
      {staffToDisplay}
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
