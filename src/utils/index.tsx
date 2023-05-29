import { IBulkUserGrid } from "../components/BulkUserGrid";

export const generateDummyData = (count: number): IBulkUserGrid[] => {
    const dummyData: IBulkUserGrid[] = [];

    for (let i = 0; i < count; i++) {
        const user: IBulkUserGrid = {
            id: i + 1,
            email: `user${i + 1}@example.com`,
            displayName: `User ${i + 1}`,
            firstName: `First Name ${i + 1}`,
            lastName: `Last Name ${i + 1}`,
            licensedSolutions: `Solution ${i + 1}`,
            localAccount: i % 2 === 0, // alternate between true and false
            hierarchy: `Hierarchy ${i + 1}`,
            roles: `Role ${i + 1}`,
        };

        dummyData.push(user);
    }

    return dummyData;
};

export const getRandomNumber = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};
