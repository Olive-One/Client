import React, { type ReactNode, useEffect, useMemo, useRef } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import useAuth from "@/hooks/authentication/useAuth";
import Navbar from "../navbar/Navbar";
import Header from "../header/Header";
import useStateStore from "@/store/store-index";
import { setLanguage } from "@/translation/i18n";
import ScrollToTop from "@/components/scrollToTop/ScrollToTop";
import AppLoader from "../AppLoader";
import { useUserMenuConfig } from "@/hooks/useUsers";
import { useThemeConfig } from "@/hooks/useThemeConfig";
import { filterAndOrderNavbarRoutes } from "@/utils/menu.utils";
import { navbarRoutesMap } from "@/routes/menuConfig";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Search } from "../Search";

type LayoutProps = {
  children?: ReactNode;
};

const AppLayout: React.FC<LayoutProps> = () => {
  const scrollableDivRef = useRef<HTMLDivElement | null>(null);
  const {
    setRoles,
    setMenu,
    setRolesLoading,
    isLoginExpired,
    setTimezone,
    setCountryCode,
    setProfile,
    profile,
  } = useStateStore();
  const { data, isLoading, isError, isFetched } = useUserMenuConfig();
  const {
    data: themeData,
    isLoading: isThemeLoading,
    isFetched: isThemeFetched,
  } = useThemeConfig();
  const navigate = useNavigate();
  const { accessToken } = useAuth();

  const routes = useMemo(() => {
    return filterAndOrderNavbarRoutes(data?.data?.menu || [], navbarRoutesMap);
  }, [data?.data?.menu]);

  useEffect(() => {
    if (isFetched && data?.data) {
      setMenu(data.data?.menu || null);
      setRoles(data.data?.permissions || null);
      setProfile(data.data?.profile || null);
      setRolesLoading(false);
    }
  }, [
    isFetched,
    setMenu,
    setTimezone,
    setRoles,
    data?.data,
    setRolesLoading,
    setCountryCode,
    setProfile,
  ]);

  useEffect(() => {
    if (isLoginExpired) {
      navigate("/login");
    }
  }, [isLoginExpired, navigate]);

  useEffect(() => {
    if (isThemeFetched && themeData) {
      const { translationConfig } = themeData;
      setLanguage(
        translationConfig?.activeLanguage || "en",
        translationConfig?.translations
      );
    }
  }, [isThemeFetched, themeData]);

  // Only show loader if we're loading and don't have an access token
  if ((isLoading || isError) && !accessToken && !isThemeLoading) {
    return (
      <div className="w-screen h-screen bg-background text-foreground">
        <AppLoader containerClassName="w-screen h-screen" />
      </div>
    );
  }

  // If we have an access token but still loading menu data, show a minimal layout
  if (isLoading && accessToken) {
    return (
      <SidebarProvider>
        <div className="flex h-screen w-full">
          <div className="w-64 bg-sidebar border-r border-border">
            <AppLoader />
          </div>
          <SidebarInset>
            <Header>
              <SidebarTrigger
                variant="outline"
                className="scale-125 sm:scale-100"
              />
              <Separator orientation="vertical" className="h-6" />
            </Header>
            <div className="flex-1 overflow-y-auto overflow-x-hidden p-4">
              <AppLoader />
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <Navbar routes={routes} user={profile || undefined} />
      <SidebarInset>
        <Header>
          <SidebarTrigger
            variant="outline"
            className="scale-125 sm:scale-100"
          />
          <Separator orientation="vertical" className="h-6" />
          <Search />
        </Header>
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          <div className="h-full" ref={scrollableDivRef}>
            <ScrollToTop scrollableDivRef={scrollableDivRef}>
              <Outlet />
            </ScrollToTop>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AppLayout;
