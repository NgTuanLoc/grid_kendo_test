export interface IBulkUserGrid {
    id: int;
    email: string;
    displayName: string;
    firstName: string;
    lastName: string;
    localAccount: boolean;
    active: boolean;
    inEdit: string | undefined;
    fileRecordDetail: IFileRecordDetail[];
}

export interface IFileRecordDetail {
    id: string;
    fileRecordId: int;
    hierarchy: string;
    roles: string;
    addSF: string | null;
    removeSF: string | null;
    isUpdated?: boolean;
}

export interface IUpdateFileRecordDetail {
    id: string;
    fileRecordId: int;
    value: string;
    field: string;
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

export interface IBulkUserGridFinal {
    id: string;
    email: string;
    displayName: string;
    firstName: string;
    lastName: string;
    addLicensedSolutions: string[];
    removeLicensedSolutions: string[];
    // ???
    hierarchy: string;
    roles: string;
    // ???
    localAccount: boolean;
    active: boolean; // Sphera Cloud Status
    inEdit: string | undefined;
}
