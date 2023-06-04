import { SortDescriptor, orderBy } from "@progress/kendo-data-query";
import { IBulkUserGrid } from "../components/interface";
import { AMOUNT_OF_DATA } from "../constants";

export const generateDummyDataOld = (count: number): IBulkUserGrid[] => {
    const dummyData: IBulkUserGrid[] = [];

    for (let i = 0; i < count; i++) {
        const user: IBulkUserGrid = {
            id: i + 1,
            email: `user${i + 1}@example.com`,
            displayName: `User ${i + 1}`,
            firstName: `First Name ${i + 1}`,
            lastName: `Last Name ${i + 1}`,
            licensedSolutions: generateRandomStringArray(getRandomNumber(3, 5)),
            hierarchy: `Hierarchy ${i + 1}`,
            roles: `Role ${i + 1}`,
            localAccount: i % 2 === 0, // alternate between true and false
            active: i % 2 === 0, // alternate between true and false
            inEdit: undefined,
        };

        dummyData.push(user);
    }

    return dummyData;
};

export const getRandomNumber = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

function generateRandomStringArray(length: number): string[] {
    const chars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const result: string[] = [];

    for (let i = 0; i < length; i++) {
        let randomString = "";
        for (let j = 0; j < 10; j++) {
            const randomIndex = Math.floor(Math.random() * chars.length);
            randomString += chars.charAt(randomIndex);
        }
        result.push(randomString);
    }

    return result;
}

export const convertToChipValue = (data: string[]) => {
    if (!data) return [{ text: "text", value: "value" }];

    return data.map((item) => {
        return {
            text: item,
            value: item,
        };
    });
};

export const getSortedData = (
    data: IBulkUserGrid[],
    sort: SortDescriptor[]
): IBulkUserGrid[] => {
    const copyData = [...data];
    if (sort.length && sort[0].field === "licensedSolutions") {
        const ascendingOrder = sort[0].dir;
        return copyData.sort((a, b) => {
            const result =
                a.licensedSolutions.length - b.licensedSolutions.length;
            return ascendingOrder === "asc" ? result : -result;
        });
    }
    return orderBy(data, sort);
};

export const dummyUserData = generateDummyDataOld(AMOUNT_OF_DATA);

// FE Utils for paging
export const getDataIndexFromPageIndex = (
    pageIndex: number,
    pageCached: number
) => {
    let temp = pageIndex;

    while (temp > pageCached - 1) {
        temp = temp - pageCached;
    }

    return temp;
};

export const calculateStartAndEndPageIndex = (
    pageIndex: number,
    pageCached: number
) => {
    const temp = pageIndex / pageCached;

    let pageRangeStart = pageCached * Math.floor(temp) + 1;
    let pageRangeEnd = pageRangeStart + pageCached - 1;

    if (Number.isInteger(temp)) {
        pageRangeStart = pageCached * (temp - 1) + 1;
        pageRangeEnd = pageRangeStart + pageCached - 1;
    }
    return [pageRangeStart, pageRangeEnd];
};

export const findAndUpdateData = (
    updatedData: IBulkUserGrid[],
    updateItem: IBulkUserGrid
): IBulkUserGrid[] => {
    const tempUpdatedData: IBulkUserGrid[] = [...updatedData];
    const index = tempUpdatedData.findIndex(
        (item) => item.id === updateItem.id
    );

    if (index !== -1) {
        tempUpdatedData[index] = updateItem;
    } else {
        tempUpdatedData.push(updateItem);
    }
    return tempUpdatedData;
};

export const calculateNumberOfRecords = (data: IBulkUserGrid[][]) => {
    let count = 0;
    for (let i = 0; i < data.length; i++) {
        count += data[i].length;
    }
    return count;
};
