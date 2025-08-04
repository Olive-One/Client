export const PAGE_SIZE_OPTIONS = [5, 10, 20, 50, 100] as const;

export const DEFAULT_PAGE_SIZE = 10;
export const DEFAULT_PAGE_INDEX = 0;

export const DEFAULT_PAGINATION = {
  pageIndex: DEFAULT_PAGE_INDEX,
  pageSize: DEFAULT_PAGE_SIZE,
};