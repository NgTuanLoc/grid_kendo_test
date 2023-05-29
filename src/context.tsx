import { useContext, createContext, ReactNode, useState, useRef } from "react";
import { PagerTargetEvent } from "@progress/kendo-react-data-tools";
import { GridPageChangeEvent } from "@progress/kendo-react-grid";
import { getRandomNumber } from "./utils";

interface PageState {
    skip: number;
    take: number;
}

export type GridColumnType =
    | "id"
    | "email"
    | "displayName"
    | "firstName"
    | "displayName"
    | "firstName"
    | "lastName"
    | "licensedSolutions"
    | "localAccount"
    | "hierarchy"
    | "roles";

// InitialState
const initialPageState: PageState = { skip: 0, take: 10 };

export type IBulkUserGridContent = {
    gridRef: React.RefObject<HTMLDivElement> | null;
    page: PageState;
    pageSizeValue: number | string | undefined;
    navigateCellTo: (cellIndex: number) => void;
    pageChange: (event: GridPageChangeEvent) => void;
};

const AppContext = createContext<IBulkUserGridContent>({
    gridRef: null,
    page: initialPageState,
    pageSizeValue: "All",
    navigateCellTo: (cellIndex: number) => {
        console.log(cellIndex);
    },
    pageChange: (event: GridPageChangeEvent) => {
        console.log(event);
    },
});

interface IBulkUserGridProvider {
    children: ReactNode;
}

const BulkUserGridProvider = ({ children }: IBulkUserGridProvider) => {
    const gridRef = useRef<HTMLDivElement>(null);
    const [page, setPage] = useState<PageState>(initialPageState);
    const fieldRef = useRef<HTMLTableCellElement | null>(null);
    const [pageSizeValue, setPageSizeValue] = useState<
        number | string | undefined
    >();

    const pageChange = (event: GridPageChangeEvent) => {
        const targetEvent = event.targetEvent as PagerTargetEvent;
        const take = targetEvent.value === "All" ? 50 : event.page.take;

        if (targetEvent.value) {
            setPageSizeValue(targetEvent.value);
        }
        setPage({
            ...event.page,
            take,
        });
    };

    const onClickPageChangeHandler = async (pageNumber: number) => {
        setPage(() => {
            return { ...page, skip: (pageNumber - 1) * page.take };
        });
    };

    const navigateCellTo = async (cellIndex: number) => {
        const productIndex = cellIndex;

        if (gridRef && gridRef.current) {
            const pageNumber = Math.ceil(productIndex / page.take);
            await onClickPageChangeHandler(pageNumber);

            const targetRowIndex = productIndex - (pageNumber - 1) * page.take;
            const selectedRow =
                gridRef.current?.querySelectorAll("tr")[targetRowIndex];

            if (!selectedRow) return;
            const getSpecificFieldFromARow = getRandomNumber(1, 9);
            const selectedField =
                selectedRow.querySelectorAll("td")[getSpecificFieldFromARow];

            if (fieldRef.current !== selectedField) {
                fieldRef.current?.classList.remove("my-div");
            }
            fieldRef.current = selectedField;
            selectedField.scrollIntoView({
                behavior: "smooth",
                block: "center",
                inline: "nearest",
            });
            selectedField.classList.add("my-div");
        }
    };

    return (
        <AppContext.Provider
            value={{ gridRef, navigateCellTo, pageChange, page, pageSizeValue }}
        >
            {children}
        </AppContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useBulkUserGridContext = () => {
    return useContext(AppContext);
};

export { BulkUserGridProvider };
