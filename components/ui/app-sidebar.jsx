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
    avatar: "/avatars/shadcn.jpg",
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
      url: "/templatePlanning",
      icon: IconDatabase,
    },
    {
      title: "Services",
      url: "/services",
      icon: IconChartBar,
    },
    {
      title: "RH",
      url: "#rh",
      icon: IconFolder,
    },
    {
      title: "Mes équipes",
      url: "/createTeams",
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
                <span className="text-base font-semibold">
                  Nom du Restaurant
                </span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="flex flex-col">
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={sidebarUser} onLogout={handleLogOut} />

        <SidebarMenuButton onClick={handleLogOut}>
          <IconLogout />
          Log out
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  );
}
