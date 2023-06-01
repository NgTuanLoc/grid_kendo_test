import {
    useContext,
    createContext,
    ReactNode,
    useState,
    useRef,
    useEffect,
} from "react";
import { PagerTargetEvent } from "@progress/kendo-react-data-tools";
import {
    GridPageChangeEvent,
    GridItemChangeEvent,
    GridSortChangeEvent,
} from "@progress/kendo-react-grid";

import {
    calculateStartAndEndPageIndex,
    fakeBackendApiCall,
    findAndUpdateData,
    getDataIndexFromPageIndex,
} from "./utils";
import { EDIT_FIELD, PAGINATION_OPTIONS } from "./constants";
import { IBulkUserGrid, IBulkUserGridResponse } from "./components/interface";
import { SortDescriptor } from "@progress/kendo-data-query";

interface PageState {
    skip: number;
    take: number;
}

export type GridColumnType =
    | "id"
    | "email"
    | "displayName"
    | "firstName"
    | "firstName"
    | "lastName"
    | "licensedSolutions"
    | "localAccount"
    | "hierarchy"
    | "roles";

// InitialState
const initialPageState: PageState = { skip: 0, take: 5 };

export type IBulkUserGridContent = {
    data: IBulkUserGridResponse;
    gridRef: React.RefObject<HTMLDivElement> | null;
    page: PageState;
    pageSizeValue: number | string | undefined;
    changes: boolean;
    sort: SortDescriptor[];
    dataIndex: number;
    isLoading: boolean;
    sortChange: (event: GridSortChangeEvent) => void;
    pageChange: (event: GridPageChangeEvent) => void;
    enterEdit: (dataItem: IBulkUserGrid, field: string | undefined) => void;
    exitEdit: () => void;
    saveChanges: () => void;
    cancelChanges: () => void;
    itemChange: (event: GridItemChangeEvent) => void;
    removeSolutionFamilyHandler: (id: number, value: string) => void;
    onSubmitHandler: () => void;
};

const AppContext = createContext<IBulkUserGridContent>({
    data: {
        data: [],
        totalPage: 1,
        startPage: 1,
        endPage: 1,
        pageSize: 1,
        pageCached: 1,
    },
    dataIndex: 0,
    isLoading: false,
    gridRef: null,
    page: initialPageState,
    pageSizeValue: "All",
    changes: false,
    sort: [],
    sortChange: (event: GridSortChangeEvent) => {
        console.log(event);
    },
    pageChange: (event: GridPageChangeEvent) => {
        console.log(event);
    },
    enterEdit: (dataItem: IBulkUserGrid, field: string | undefined) => {
        console.log(dataItem);
        console.log(field);
    },
    exitEdit: () => {
        console.log("exitEdit");
    },
    saveChanges: () => {
        console.log("saveChanges");
    },
    cancelChanges: () => {
        console.log("saveChanges");
    },
    itemChange: (event: GridItemChangeEvent) => {
        console.log(event);
    },
    removeSolutionFamilyHandler: (id: number, value: string) => {
        console.log(id);
        console.log(value);
    },
    onSubmitHandler: () => {
        console.log("Submit Handler");
    },
});

interface IBulkUserGridProvider {
    children: ReactNode;
}

const testData = await fakeBackendApiCall(
    1,
    PAGINATION_OPTIONS.PAGE_SIZE,
    PAGINATION_OPTIONS.PAGE_CACHED
);

const BulkUserGridProvider = ({ children }: IBulkUserGridProvider) => {
    const [originalData, setOriginalData] =
        useState<IBulkUserGridResponse>(testData);
    const [data, setData] = useState<IBulkUserGridResponse>(testData);
    // This data will be send to update api
    const [updatedData, setUpdatedData] = useState<IBulkUserGrid[]>([]);
    const [saveUpdatedData, setSaveUpdatedData] = useState<IBulkUserGrid[]>([]);
    const gridRef = useRef<HTMLDivElement>(null);
    const [page, setPage] = useState(initialPageState);
    const [pageSizeValue, setPageSizeValue] = useState(
        PAGINATION_OPTIONS.PAGE_SIZE
    );
    const [dataIndex, setDataIndex] = useState(0);
    const [sort, setSort] = useState<SortDescriptor[]>([]);
    const [isSortChange, setIsSortChange] = useState(false);
    const [changes, setChanges] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState(false);

    // On navigate cell handler
    const pageChange = (event: GridPageChangeEvent) => {
        const targetEvent = event.targetEvent as PagerTargetEvent;

        if (targetEvent.value) {
            setPageSizeValue(targetEvent.value);
        }
        setPage({
            ...event.page,
        });
    };

    const handleFetchDataAsync = async () => {
        const tempDataIndex = page.skip / page.take;
        const [pageRangeStartFe, pageRangeEndFe] =
            calculateStartAndEndPageIndex(tempDataIndex + 1, data.pageCached);

        if (data.pageSize !== pageSizeValue) {
            setIsLoading(true);
            const newData = await fakeBackendApiCall(
                pageRangeStartFe,
                pageSizeValue,
                data.pageCached
            );
            setData({ ...newData, data: updateNewDataToUpdateData(newData) });
        }

        if (isSortChange) {
            setIsLoading(true);
            const newData = await fakeBackendApiCall(
                pageRangeStartFe,
                pageSizeValue,
                data.pageCached,
                sort[0]
            );
            setData({ ...newData, data: updateNewDataToUpdateData(newData) });
            setIsSortChange(false);
        }

        if (tempDataIndex + 1 < data.startPage) {
            setIsLoading(true);
            const newData = await fakeBackendApiCall(
                pageRangeStartFe,
                pageSizeValue,
                data.pageCached,
                sort[0]
            );
            setData({ ...newData, data: updateNewDataToUpdateData(newData) });
        }
        if (tempDataIndex >= data.endPage) {
            setIsLoading(true);
            const newData = await fakeBackendApiCall(
                pageRangeEndFe,
                pageSizeValue,
                data.pageCached,
                sort[0]
            );
            setData({ ...newData, data: updateNewDataToUpdateData(newData) });
        }
        setDataIndex(getDataIndexFromPageIndex(tempDataIndex, data.pageCached));
        setIsLoading(false);
    };

    useEffect(() => {
        handleFetchDataAsync();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page.skip, page.take, pageSizeValue, sort]);

    const updateNewDataToUpdateData = (newData: IBulkUserGridResponse) => {
        // return newData.data;
        const tempData = newData.data.map((userList) => {
            return userList.map((user) => {
                const temp = updatedData.find((item) => item.id === user.id);
                if (temp) {
                    return temp;
                }
                return user;
            });
        });
        return tempData;
    };

    // CRUD
    const enterEdit = (dataItem: IBulkUserGrid, field: string | undefined) => {
        const tempData = data.data[dataIndex].map((item) => {
            if (item.id !== dataItem.id) return item;
            return {
                ...item,
                [EDIT_FIELD]: item.id === dataItem.id ? field : undefined,
            };
        });

        const newData = [...data.data];
        newData[dataIndex] = tempData;
        setData({ ...data, data: newData });
    };

    const exitEdit = () => {
        const tempData = data.data[dataIndex].map((item) => ({
            ...item,
            [EDIT_FIELD]: undefined,
        }));

        const newData = [...data.data];
        newData[dataIndex] = tempData;
        setData({ ...data, data: newData });
    };

    const saveChanges = () => {
        setOriginalData(data);
        setSaveUpdatedData(updatedData);
        setChanges(false);
    };

    const cancelChanges = () => {
        setPage({
            ...page,
            skip: 0,
        });
        setData(originalData);
        setUpdatedData([...saveUpdatedData]);
        setChanges(false);
    };

    const itemChange = (event: GridItemChangeEvent) => {
        const field = event.field as GridColumnType;
        event.dataItem[field] = event.value;
        const tempData = data.data[dataIndex].map((item) => {
            if (item.id === event.dataItem.id) {
                if (field === "localAccount") {
                    item[field] = Boolean(event.value);
                } else {
                    item[field] = event.value;
                }
                addItemToUpdateData(item);
            }
            return item;
        });

        const newData = [...data.data];
        newData[dataIndex] = tempData;
        setData({ ...data, data: newData });
        setChanges(true);
    };

    // Sort
    const sortChange = (event: GridSortChangeEvent) => {
        setSort(event.sort);
        setIsSortChange(true);
    };

    // Other Feature
    const removeSolutionFamilyHandler = (id: number, value: string) => {
        const tempData = data.data[dataIndex].map((item) => {
            if (item.id === id) {
                const filteredCustomField = item.licensedSolutions.filter(
                    (field) => field !== value
                );
                const newItem = {
                    ...item,
                    licensedSolutions: filteredCustomField,
                };
                addItemToUpdateData(newItem);
                return newItem;
            }
            return item;
        });

        const newData = [...data.data];
        newData[dataIndex] = tempData;
        setData({ ...data, data: newData });
        setChanges(true);
    };

    const addItemToUpdateData = (item: IBulkUserGrid) => {
        const tempData = findAndUpdateData(updatedData, item);
        setUpdatedData([...saveUpdatedData, ...tempData]);
    };

    const onSubmitHandler = () => {
        console.log(saveUpdatedData);
    };

    return (
        <AppContext.Provider
            value={{
                data,
                dataIndex,
                gridRef,
                changes,
                pageChange,
                page,
                pageSizeValue,
                enterEdit,
                exitEdit,
                saveChanges,
                cancelChanges,
                itemChange,
                sort,
                isLoading,
                removeSolutionFamilyHandler,
                onSubmitHandler,
                sortChange,
            }}
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
