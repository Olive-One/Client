import { useCallback } from "react";
import useAxiosPrivate from "../authentication/useAxioxPrivate";
import { type PaginationState } from "@tanstack/react-table";
import { createQueryString } from "@/utils/queryString.utils";
import API_URLS from "@/services/apiUrls";
import { postData } from "@/services/api";
import { type DropdownFilter, type DropdownRequest, type DropdownResponse, FilterMethods } from "@/types/dropDown.types";
import { useQuery } from "@tanstack/react-query";


export function useDropdownData<T>(
	key: string,
	pagination: PaginationState = { pageIndex: 0, pageSize: 100 },
	requestBody?: DropdownRequest,
	enabled: boolean = true,
) {
	const authAxiosInstance = useAxiosPrivate();
	const queryString = createQueryString(pagination);
	const fullUrl = `${API_URLS.SHARED.DROPDOWN}/${key}?${queryString}`;
	return useQuery({
		queryKey: ['dropdown', key, pagination.pageIndex, pagination.pageSize, requestBody],
		queryFn: () => postData<DropdownResponse<T>>(`${fullUrl}`, requestBody || {}, authAxiosInstance),
		retry: false,
		enabled: !!key && enabled,
	});
}

export function useStaticDropdownData<T>(key: string) {
	const authAxiosInstance = useAxiosPrivate();
	return useQuery({
		queryKey: ['staticDropdown', key],
		queryFn: () => postData<DropdownResponse<T>>(`${API_URLS.SHARED.STATIC_DROPDOWN}/${key}`, {}, authAxiosInstance),
		retry: false,
		enabled: !!key,
	});
}

export const useAsyncDropdownLoadOptions = (key: string, dropdownFilters?: DropdownFilter[]) => {
	const authAxiosInstance = useAxiosPrivate();
	const loadOptions = useCallback(
		async (inputValue: string) => {
			const requestPayload: DropdownRequest = {
				filter: [
					{
						field: 'name',
						value: inputValue,
						method: FilterMethods.SEARCH,
					},
					...(dropdownFilters || []),
				],
			};

			const pagination: PaginationState = { pageIndex: 0, pageSize: 100 };
			const queryString = createQueryString(pagination);
			const fullUrl = `${API_URLS.SHARED.DROPDOWN}/${key}?${queryString}`;

			try {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				const response = await postData<DropdownResponse<any>>(fullUrl, requestPayload, authAxiosInstance);
				return response.data;
			} catch (error) {
				console.error(`Failed to load ${key} options`, error);
				return [];
			}
		},
		[key, dropdownFilters, authAxiosInstance],
	);

	return loadOptions;
};

// Context-aware dropdown hooks for user management
type DropdownOption = {
	id: string;
	label: string;
	value: string;
};

export function useContextDioceseDropdown() {
	const authAxiosInstance = useAxiosPrivate();
	return useQuery({
		queryKey: ['context-dioceses'],
		queryFn: () => postData<DropdownResponse<DropdownOption>>(`${API_URLS.DROPDOWN_CONTEXT.DIOCESES}`, {}, authAxiosInstance),
		retry: false,
	});
}

export function useContextChurchDropdown(dioceseId?: string) {
	const authAxiosInstance = useAxiosPrivate();
	return useQuery({
		queryKey: ['context-churches', dioceseId],
		queryFn: () => postData<DropdownResponse<DropdownOption>>(`${API_URLS.DROPDOWN_CONTEXT.CHURCHES}`, { dioceseId }, authAxiosInstance),
		retry: false,
		enabled: !!dioceseId,
	});
}

export function useContextFamilyDropdown(churchId?: string, enabled: boolean = true) {
	const authAxiosInstance = useAxiosPrivate();
	return useQuery({
		queryKey: ['context-families', churchId],
		queryFn: () => postData<DropdownResponse<DropdownOption>>(`${API_URLS.DROPDOWN_CONTEXT.FAMILIES}`, { churchId }, authAxiosInstance),
		retry: false,
		enabled: !!churchId && enabled,
	});
}