export interface IBulkUserGrid {
    id: int;
    email: string;
    displayName: string;
    firstName: string;
    lastName: string;
    licensedSolutions: string;
    localAccount: boolean;
    hierarchy: string;
    roles: string;
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
