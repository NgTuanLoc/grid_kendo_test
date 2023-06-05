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
    GridFilterChangeEvent,
} from "@progress/kendo-react-grid";

import {
    calculateStartAndEndPageIndex,
    findAndUpdateData,
    getDataIndexFromPageIndex,
} from "./utils";
import { fakeBackendApiCall } from "./api";
import { EDIT_FIELD, PAGINATION_OPTIONS } from "./constants";
import {
    IBulkUserGrid,
    IBulkUserGridResponse,
    IFileRecordDetail,
    IUpdateFileRecordDetail,
} from "./components/interface";
import {
    CompositeFilterDescriptor,
    SortDescriptor,
} from "@progress/kendo-data-query";
import useDebounce from "./hooks";

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
    | "fileRecordDetail"
    | "localAccount";

export type FileRecordDetailType = "addSF" | "removeSF";

// InitialState
const initialPageState: PageState = {
    skip: 0,
    take: PAGINATION_OPTIONS.PAGE_SIZE,
};

export type IBulkUserGridContent = {
    data: IBulkUserGridResponse;
    gridRef: React.RefObject<HTMLDivElement> | null;
    page: PageState;
    pageSizeValue: number | string | undefined;
    changes: boolean;
    sort: SortDescriptor[];
    dataIndex: number;
    isLoading: boolean;
    filter: CompositeFilterDescriptor | undefined;
    sortChange: (event: GridSortChangeEvent) => void;
    filterChange: (event: GridFilterChangeEvent) => void;
    pageChange: (event: GridPageChangeEvent) => void;
    enterEdit: (dataItem: IBulkUserGrid, field: string | undefined) => void;
    exitEdit: () => void;
    saveChanges: () => void;
    cancelChanges: () => void;
    itemChange: (event: GridItemChangeEvent) => void;
    removeSolutionFamilyHandler: (
        id: number,
        value: IUpdateFileRecordDetail
    ) => void;
    onSubmitHandler: () => void;
};

const AppContext = createContext<IBulkUserGridContent>({
    data: {
        data: [],
        totalPage: 1,
        totalRecords: 1,
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
    filter: undefined,
    sortChange: (event: GridSortChangeEvent) => {
        console.log(event);
    },
    filterChange: (event: GridFilterChangeEvent) => {
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
    removeSolutionFamilyHandler: (
        id: number,
        value: IUpdateFileRecordDetail
    ) => {
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
    const [submitData, setSubmitData] = useState<IBulkUserGrid[]>([]);
    const gridRef = useRef<HTMLDivElement>(null);

    // Handle Pagination
    const [page, setPage] = useState(initialPageState);
    const [pageSizeValue, setPageSizeValue] = useState(
        PAGINATION_OPTIONS.PAGE_SIZE
    );
    const [dataIndex, setDataIndex] = useState(0);
    const [sort, setSort] = useState<SortDescriptor[]>([]);
    const [isSortChange, setIsSortChange] = useState(false);
    const [changes, setChanges] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState(false);

    // Handle Filtering
    const [filter, setFilter] = useState<CompositeFilterDescriptor>();
    const [debouncedFilterValue, previousDebouncedFilterValue] =
        useDebounce<CompositeFilterDescriptor>(filter, 2000);

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

    const handleFetchAndUpdateDataAsync = async () => {
        // Refetch data when
        // 1/ Selected page is exceeded the boundary for cached page
        // 2/ Sorting
        // 3/ Change pagesize
        const tempDataIndex = page.skip / page.take;
        const [pageRangeStartFe, pageRangeEndFe] =
            calculateStartAndEndPageIndex(tempDataIndex + 1, data.pageCached);

        if (data.pageSize !== pageSizeValue) {
            await fetchDataAsync(pageRangeStartFe);
        }

        if (
            debouncedFilterValue !== undefined &&
            debouncedFilterValue !== previousDebouncedFilterValue
        ) {
            await fetchDataAsync(pageRangeStartFe);
            setPage({
                ...page,
                skip: 0,
            });
        }

        if (isSortChange) {
            await fetchDataAsync(pageRangeStartFe);
            setIsSortChange(false);
        }

        if (tempDataIndex + 1 < data.startPage) {
            await fetchDataAsync(pageRangeStartFe);
        }
        if (tempDataIndex >= data.endPage) {
            await fetchDataAsync(pageRangeEndFe);
        }
        setDataIndex(getDataIndexFromPageIndex(tempDataIndex, data.pageCached));
        setIsLoading(false);
    };

    const fetchDataAsync = async (pageIndex: number) => {
        setIsLoading(true);
        const newData = await fakeBackendApiCall(
            pageIndex,
            pageSizeValue,
            data.pageCached,
            sort[0],
            debouncedFilterValue
        );
        setData({ ...newData, data: updateDataHandler(newData) });
    };

    useEffect(() => {
        handleFetchAndUpdateDataAsync();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page.skip, page.take, pageSizeValue, sort, debouncedFilterValue]);

    const updateDataHandler = (newData: IBulkUserGridResponse) => {
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

        changeDataHandler(tempData);
    };

    const exitEdit = () => {
        const tempData = data.data[dataIndex].map((item) => ({
            ...item,
            [EDIT_FIELD]: undefined,
        }));

        changeDataHandler(tempData);
    };

    const saveChanges = () => {
        setOriginalData(data);
        setSubmitData(updatedData);
        setChanges(false);
    };

    const cancelChanges = () => {
        setPage({
            ...page,
            skip: 0,
        });
        setData(originalData);
        setUpdatedData([...submitData]);
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

        changeDataHandler(tempData);
        setChanges(true);
    };

    const changeDataHandler = (changeData: IBulkUserGrid[]) => {
        const newData = [...data.data];
        newData[dataIndex] = changeData;
        setData({ ...data, data: newData });
    };

    // Sort
    const sortChange = (event: GridSortChangeEvent) => {
        setSort(event.sort);
        setIsSortChange(true);
    };

    // Filter
    const filterChange = (event: GridFilterChangeEvent) => {
        setFilter(event.filter);
    };

    // Other Feature
    const removeSolutionFamilyHandler = (
        id: number,
        value: IUpdateFileRecordDetail
    ) => {
        const tempData = data.data[dataIndex].map((item) => {
            if (item.id === id) {
                const updatedFileRecordDetail = updateFileRecordDetailList(
                    item.fileRecordDetail,
                    value
                );

                const newItem = {
                    ...item,
                    fileRecordDetail: updatedFileRecordDetail,
                };
                addItemToUpdateData(newItem);
                return newItem;
            }
            return item;
        });

        changeDataHandler(tempData);
        setChanges(true);
    };

    const updateFileRecordDetailList = (
        fileRecordDetailList: IFileRecordDetail[],
        value: IUpdateFileRecordDetail
    ) => {
        const updatedFileRecordDetail = fileRecordDetailList.map((frd) => {
            if (frd.id === value.id) {
                const field = value.field as FileRecordDetailType;
                frd[field] = null;
                return { ...frd, isUpdated: true };
            }
            return { ...frd };
        });

        return updatedFileRecordDetail;
    };

    const addItemToUpdateData = (item: IBulkUserGrid) => {
        const tempUpdatedData = findAndUpdateData(updatedData, item);
        setUpdatedData(tempUpdatedData);
    };

    const onSubmitHandler = () => {
        console.log(submitData);
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
                filter,
                filterChange,
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
