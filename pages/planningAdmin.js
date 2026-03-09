import HeaderAdminSignUp from "@/components/HeaderAdminSignUp";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { convertMinutesToTime } from "@/modules/timeConversion";

import CTCard from "../components/CTCard";
import { useEffect, useState } from "react";
import { setEmployeesInStore } from "@/reducers/employee";
import { useSelector, useDispatch } from "react-redux";
const dayjs = require("dayjs");
require("dayjs/locale/fr");
const localizedFormat = require("dayjs/plugin/localizedFormat");
dayjs.locale("fr");
dayjs.extend(localizedFormat);

export default function planningAdmin() {
  const business = useSelector((state) => state.business.value);
  const staff = useSelector((state) => state.employee.value.employees);
  const dispatch = useDispatch();
  const restaurantId = business[0]?.id;
  const [allCTs, setAllCTs] = useState([null]);
  //   const [allStaff, setAllStaff] = useState([null]);
  const [currentDate, setCurrentDate] = useState(dayjs());

  const hoursInADay = Array.from({ length: 24 }).map((day, i) => {
    return (
      <div className="border text-left col-span-4" key={i}>
        {`${i.toString().padStart(2, "0")}h`}
      </div>
    );
  });

  const getAllCTs = async (restaurantId) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL_BACKEND}/planning/all/${restaurantId}`,
    );
    const foundCTs = await response.json();
    setAllCTs(foundCTs.response);
    // console.log("CTs récupérés: ", foundCTs.response);
  };

  const getAllStaff = async (restaurantId) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL_BACKEND}/employee/${restaurantId}`,
    );
    const foundStaff = await response.json();
    // setAllStaff(foundStaff.employees);
    dispatch(setEmployeesInStore(foundStaff.employees));
    // console.log("Employé.es récupéré.es: ", foundStaff.employees);
  };

  useEffect(() => {
    getAllCTs(restaurantId);
    getAllStaff(restaurantId);
    // console.log("Staff: ", staff);
  }, []);

  const staffToDisplay = staff.map((employee) => {
    // console.log("Employee sur lequel on map:", employee);
    return (
      <div
        className="grid grid-cols-[repeat(100,1fr)] w-375 h-20"
        key={employee.id}
      >
        <div className="flex flex-col col-span-4 w-40">
          <span>{employee.firstName}</span>
          <span>{employee.lastName}</span>
          <span>{employee.hourVolum ? employee.hourVolum : ""}</span>
        </div>
        <div className="grid grid-cols-[repeat(96,1fr)] relative h-20 col-span-96">
          {allCTs
            .filter(
              (CT) =>
                CT?.worker._id === employee._id &&
                dayjs(currentDate).isSame(dayjs(CT.date), "day"),
            )
            .map((CT) => {
              //   console.log("CT sur lequel on map:", CT);
              return (
                <CTCard
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

  return (
    <div className="min-h-screen min-w-fit bg-white flex rounded-lg flex-col overflow-x-auto">
      <HeaderAdminSignUp />
      <div className="m-4 text-accent-foreground text-xl">
        {currentDate.format("dddd D MMMM YYYY")}
      </div>
      <div className="grid grid-cols-[repeat(100,1fr)] w-375">
        <div className="col-span-4 w-40"></div>
        {hoursInADay}
      </div>
      {staffToDisplay}
      {/* <CTCard style={{ gridColumnStart: 45, gridColumnEnd: 65 }} /> */}
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
