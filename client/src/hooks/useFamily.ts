import { fetchData } from "@/services/api";
import API_URLS from "@/services/apiUrls";
import type { DropdownResponse } from "@/types/dropDown.types";
import { useQuery } from "@tanstack/react-query";
import useAxiosPrivate from "./authentication/useAxioxPrivate";

export function useFamilyMembers(familyId?: string) {
	const authAxiosInstance = useAxiosPrivate();	
    const url = API_URLS.FAMILY.MEMBERS.replace(':familyId', familyId || '');
	return useQuery({
		queryKey: ['family-members', familyId],
		queryFn: () => {
            const response = fetchData<DropdownResponse<any>>(url, authAxiosInstance);
			return response;
		},
		retry: false,
		enabled: !!familyId,
	});
}