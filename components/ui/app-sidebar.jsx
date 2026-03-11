"use client";

import * as React from "react";
import {
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconInnerShadowTop,
  IconListDetails,
  IconLogout,
  IconMenu,
  IconMenu2,
  IconReport,
  IconSearch,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { NavDocuments } from "@/components/ui/nav-documents";
import { NavMain } from "@/components/ui/nav-main";
import { NavSecondary } from "@/components/ui/nav-secondary";
import { NavUser } from "@/components/ui/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar-primitives";
import { logout } from "@/reducers/users";

const data = {
  user: {
    name: "nom de l'admin",
    email: "email de connexion de l'admin admin@gmail.com",
    icon: IconMenu2,
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Planning",
      url: "/planningAdmin",
      icon: IconReport,
    },
    {
      title: "Semaine Type",
      url: "/viewPlanning",
      icon: IconDatabase,
    },
    {
      title: "Services",
      url: "/viewServices",
      icon: IconChartBar,
    },
    {
      title: "RH",
      url: "#rh",
      icon: IconFolder,
      disabled: true,
    },
    {
      title: "Mes équipes",
      url: "/viewTeamsReducer",
      icon: IconUsers,
    },
    {
      title: "Mes employés",
      url: "/viewEmployee",
      icon: IconUsers,
    },
  ],

  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: IconSettings,
    },
    {
      title: "Get Help",
      url: "#",
      icon: IconHelp,
    },
    {
      title: "Search",
      url: "#",
      icon: IconSearch,
    },
  ],
  documents: [
    {
      name: "Document 1",
      url: "#",
      icon: IconFileDescription,
    },
  ],
};

export function AppSidebar({ user, ...props }) {
  const sidebarUser = {
    ...data.user,
    ...(user || {}),
  };
  const dispatch = useDispatch();
  const router = useRouter();
  // recuperer user Name et afficher à la place de Nom du restaurant dans le header
  const userName = sidebarUser.name || "Nom de l'utilisateur";

  const handleLogOut = () => {
    dispatch(logout());
    router.push("/login");
  };
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <a href="#">
                <IconInnerShadowTop className="size-5!" />
                <span className="text-base font-semibold">{userName}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="flex flex-col">
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenuButton onClick={handleLogOut}>
          <IconLogout />
          Se Deconnecter
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  );
}
