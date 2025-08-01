import { useQuery } from "@tanstack/react-query";
import useAxiosPrivate from "./authentication/useAxioxPrivate";
import { fetchData } from "@/services/api";
import type { ClientConfigType } from "@/types/config.types";
import API_URLS from "@/services/apiUrls";


export function useThemeConfig() {
	const authAxiosInstance = useAxiosPrivate();
	return useQuery({
		queryKey: ['themeConfig'],
		queryFn: () => fetchData<ClientConfigType>(API_URLS.CLIENT_CONFIG, authAxiosInstance),
		retry: (failureCount) => failureCount < 2,
	});
}
