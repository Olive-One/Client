
export type DropDownItem<T> = {
	id: string;
	name: string;
	label: string;
	value?: string;
	meta?: T;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
};

export type DropdownResponse<T> = {
	success: boolean;
	data: DropDownItem<T>[];
};

export enum FilterMethods {
	EQUALS = 'eq',
	LIKE = 'like',
	STARTS_WITH = 'startsWith',
	ENDS_WITH = 'endsWith',
	SEARCH = 'search',
	IN = 'in',
}

export type DropdownFilter = {
	field: string;
	value: string | string[];
	method?: FilterMethods;
};

export type DropdownRequest = {
	filter: DropdownFilter[];
};
