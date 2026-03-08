import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { ChartAreaInteractive } from "@/components/ui/chart-area-interactive";
import { DataTable } from "@/components/ui/data-table";
import { SectionCards } from "@/components/ui/section-cards";
import { SiteHeader } from "@/components/ui/site-header";
import HeaderAdminSignUp from "@/components/HeaderAdminSignUp";

import data from "../../data.json";

const columns = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
  },
];

export default function Dashboard() {
  const router = useRouter();
  const dispatch = useDispatch();
  const business = useSelector((state) => state.business.value);
  const user = useSelector((state) => state.user.value);
  const email = user?.email;
  const token = user?.token;
  useEffect(() => {
    if (!token) {
      router.replace("/login");
    }
  }, [token, router]);

  useEffect(() => {
    if (!email || !token) return;

    // Ne charger que si le store business est vide
    if (business.length > 0) return;

    const fetchUserData = async () => {
      try {
        const backendUrl = process.env.URL_BACKEND || "http://localhost:3000";
        const response = await fetch(
          `http://localhost:3000/users/search/by/${email}`,
          {
            method: "GET",
          },
        );

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const contentType = response.headers.get("content-type") || "";
        if (!contentType.includes("application/json")) {
          throw new Error(
            "Expected JSON response but received non-JSON content",
          );
        }

        const data = await response.json();
        console.log(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email, token, dispatch]);
  console.log("email from dashboard:", email);

  return (
    <>
       <HeaderAdminSignUp />
      <SiteHeader />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <SectionCards />

            <DataTable columns={columns} data={data} />
          </div>
        </div>
      </div>
    </>
  );
}
