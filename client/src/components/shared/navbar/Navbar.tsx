"use client";

import React from "react";
import type { NavbarRoute } from "@/types/navbar.types";
import type { UserData } from "@/types/user.types";
import { NavUser } from "./NavUser";
import NavbarMenuItem from "./NavbarMenuItem";
import oliveOneLogoLight from "../../../assets/oliveone-logo-light.svg";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarRail,
} from "@/components/ui/sidebar";

interface NavbarProps {
  routes: NavbarRoute[];
  user?: UserData;
}

const Navbar: React.FC<NavbarProps> = ({ routes, user }) => {
  return (
    <Sidebar collapsible="icon" variant="sidebar">
      <SidebarHeader>
        <div className="flex items-center justify-center h-12 px-2">
          <img
            src={oliveOneLogoLight}
            alt="OliveOne Logo"
            className="h-12 w-auto object-contain group-data-[collapsible=icon]:h-6"
          />
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {routes.map((route) => (
                <NavbarMenuItem key={route.path} route={route} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        {user && (
          <NavUser
            user={{
              name: user.firstName + " " + user.lastName || "Unknown User",
              email: user.email || "unknown@example.com",
              avatar:
                user.profilePic ||
                "https://ui-avatars.com/api/?name=" +
                  user.firstName +
                  "+" +
                  user.lastName,
            }}
          />
        )}
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
};

export default Navbar;
