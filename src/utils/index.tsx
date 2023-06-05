import {
    IBulkUserGrid,
    IFileRecordDetail,
    IUpdateFileRecordDetail,
} from "../components/interface";
import { AMOUNT_OF_DATA } from "../constants";

export const generateDummyDataOld = (count: number): IBulkUserGrid[] => {
    const dummyData: IBulkUserGrid[] = [];

    for (let i = 0; i < count; i++) {
        const fileRecordId = i + 1;
        const fileRecordDetailLength = Math.floor(Math.random() * 10) + 1; // Random length between 1 and 5
        const fileRecordDetail: IFileRecordDetail[] = generateFileRecordDetail(
            fileRecordDetailLength,
            fileRecordId
        );

        const user: IBulkUserGrid = {
            id: fileRecordId,
            email: `user${i + 1}@example.com`,
            displayName: `User ${i + 1}`,
            firstName: `First Name ${i + 1}`,
            lastName: `Last Name ${i + 1}`,
            fileRecordDetail: fileRecordDetail,
            localAccount: i % 2 === 0, // alternate between true and false
            active: i % 2 === 0, // alternate between true and false
            inEdit: undefined,
        };

        dummyData.push(user);
    }

    return dummyData;
};

function generateFileRecordDetail(
    length: number,
    fileRecordId: number
): IFileRecordDetail[] {
    const fileRecordDetail: IFileRecordDetail[] = [];

    for (let i = 1; i <= length; i++) {
        const randomRemoveSFValue =
            Math.random() < 0.5 ? null : generateRandomString();
        const randomAddSFValue =
            Math.random() < 0.5 ? null : generateRandomString();
        const record: IFileRecordDetail = {
            id: generateRandomString(),
            fileRecordId: fileRecordId,
            hierarchy: `Hierarchy ${i + 1}`,
            roles: `Role ${i + 1}`,
            addSF: randomAddSFValue,
            removeSF: randomRemoveSFValue,
        };

        fileRecordDetail.push(record);
    }

    return fileRecordDetail;
}

export const getRandomNumber = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

const generateRandomString = () => {
    const chars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let randomString = "";
    for (let j = 0; j < 10; j++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        randomString += chars.charAt(randomIndex);
    }
    return randomString;
};

export const convertToChipValue = (data: string[]) => {
    if (!data) return [{ text: "text", value: "value" }];

    return data.map((item) => {
        return {
            text: item,
            value: item,
        };
    });
};

export const convertToChipValueForFileRecordDetail = (
    data: IUpdateFileRecordDetail[]
) => {
    if (!data) return [{ text: "text", value: "value" }];

    return data.map((item) => {
        return {
            text: item.value,
            value: item,
        };
    });
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
