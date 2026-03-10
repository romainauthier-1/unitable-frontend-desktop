import HeaderAdminSignUp from "@/components/HeaderAdminSignUp";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { convertMinutesToTime } from "@/modules/timeConversion";
import {
  ChevronLeft,
  ChevronsLeft,
  ChevronRight,
  ChevronsRight,
  PlusCircle,
  Edit,
  LoaderPinwheel,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  const [allCTs, setAllCTs] = useState([null]);
  //   const [allStaff, setAllStaff] = useState([null]);
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [workingDate, setWorkingDate] = useState(dayjs());
  const [editionMode, setEditionMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
                  key={employee._id}
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

  const createCT = async (employee) => {
    if (!editionMode) {
      toast.info("Activez le mode édition pour continuer");
      return;
    }

    setIsLoading(true);

    const defaultCT = {
      date: dayjs(workingDate),
      startTime: 660,
      endTime: 960,
      role: null,
      pause: 0,
      worker: employee._id,
      restaurant: restaurantId,
      createdBy: user?._id,
    };

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL_BACKEND}/create`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(defaultCT),
      },
    );

    const data = await response.json();
    if (data.result) {
      toast.success(data.message);
      getAllCTs(restaurantId);
    } else {
      toast.error(data.message);
    }
    setIsLoading(false);
  };

  const staffAvailable = staff?.map((employee) => {
    const formattedEmployee = `${employee.firstName} ${employee.lastName} (${employee.position ? employee.position : "Poste non défini"})`;
    return (
      <DropdownMenuItem
        key={employee._id}
        onClick={() => {
          console.log("Clic sur ajout employé");
          createCT(employee);
        }}
      >
        {formattedEmployee}
      </DropdownMenuItem>
    );
  });

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
      className={`min-h-screen min-w-fit bg-white flex rounded-lg flex-col overflow-x-auto`}
    >
      <Toaster richColors position="top-right" />
      <HeaderAdminSignUp />
      <div className="flex flex-row justify-evenly items-center">
        <Button onClick={toggleEditionMode}>
          <Edit />
        </Button>
        {editionMode && (
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
        )}
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
