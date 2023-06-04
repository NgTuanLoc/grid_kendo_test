import {
    CompositeFilterDescriptor,
    FilterDescriptor,
    SortDescriptor,
} from "@progress/kendo-data-query";
import { GridColumnType } from "../context";
import { IBulkUserGrid, IBulkUserGridResponse } from "../components/interface";
import { calculateStartAndEndPageIndex, dummyUserData } from "../utils";

// Fake BE
export const fakeBackendApiCall = async (
    pageIndex: number,
    pageSize: number,
    pageCached: number,
    sort?: SortDescriptor | null,
    filterParam?: CompositeFilterDescriptor
): Promise<IBulkUserGridResponse> => {
    //Fake delay api
    await fakeApiCall();
    console.log("API Called");
    let tempData = [...dummyUserData];

    // Handle Filter
    if (filterParam) {
        const filters = filterParam.filters;

        for (let i = 0; i < filters.length; i++) {
            const element = filters[i] as FilterDescriptor;

            if (!element.field) continue;

            const field = element.field as GridColumnType;
            tempData = tempData.filter((item) =>
                item[field].includes(element.value)
            );
        }
    }

    const filterData = tempData;

    // Handle Sorting
    if (sort) {
        const field = sort.field as GridColumnType;
        const dir = sort.dir === "asc" ? 1 : -1;
        tempData.sort((a, b) => {
            const valueA = a[field];
            const valueB = b[field];

            if (field === "licensedSolutions") {
                return dir * (valueA.length - valueB.length);
            }

            return (
                dir * valueA.toLowerCase().localeCompare(valueB.toLowerCase())
            );
        });
    }

    // Handle Pagination
    const totalPage = Math.ceil(tempData.length / pageSize);
    const responseData: IBulkUserGrid[][] = [];

    const [pageRangeStart, pageRangeEnd] = calculateStartAndEndPageIndex(
        pageIndex,
        pageCached
    );

    for (let i = pageRangeStart; i <= pageRangeEnd; i++) {
        const start = pageSize * (i - 1);
        const end = pageSize * i;
        const dataInSinglePage = tempData.slice(start, end);
        responseData.push(dataInSinglePage);
    }

    const response: IBulkUserGridResponse = {
        data: responseData,
        totalPage: totalPage,
        totalRecords: filterData.length,
        startPage: pageRangeStart,
        endPage: pageRangeEnd,
        pageSize,
        pageCached,
    };
    return response;
};

const fakeApiCall = (): Promise<string> => {
    return new Promise((resolve) => {
        // Simulate an API call that takes 2 seconds to complete
        setTimeout(() => {
            resolve("Fake API response");
        }, 2000);
    });
};
