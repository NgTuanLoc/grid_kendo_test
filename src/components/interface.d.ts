export interface IBulkUserGrid {
    id: int;
    email: string;
    displayName: string;
    firstName: string;
    lastName: string;
    licensedSolutions: string[];
    hierarchy: string;
    roles: string;
    localAccount: boolean;
    active: boolean;
    inEdit: string | undefined;
}

export interface columnInterface {
    title?: string;
    field?: string;
    show?: boolean;
    filter?: "boolean" | "numeric" | "text" | "date" | undefined;
    minWidth?: number;
    minGridWidth?: number;
    locked?: boolean;
    width?: string | number;
}

// Cached 5 page
// Page 1 : [1, 2, 3, 4, 5]
// Page 1 : [1, 2, 3, 4, 5]
// Page 4 : [1, 2, 3, 4, 5]
// Page 7 : [6, 7, 8, 9, 10]

export interface IBulkUserGridResponse {
    data: IBulkUserGrid[][];
    totalPage: number;
    totalRecords: number;
    pageSize: number;
    pageCached: number;
    startPage: number;
    endPage: number;
}
