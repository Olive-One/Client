import { useQuery } from "@tanstack/react-query";
import useAxiosPrivate from "./authentication/useAxioxPrivate";
import { fetchData } from "@/services/api";
import type { UserMenuPermissionsApiResponse } from "@/types/user.types";
import API_URLS from "@/services/apiUrls";

export function useUserMenuConfig() {
    const authAxiosInstance = useAxiosPrivate();
    return useQuery({
      queryKey: ['userMenuConfig'],
      queryFn: () => fetchData<UserMenuPermissionsApiResponse>(API_URLS.USER.MENU_CONFIG, authAxiosInstance),
      retry: true,
      gcTime: 0,
      staleTime: 0,
    });
  }