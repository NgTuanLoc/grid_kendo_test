import * as faker from "@faker-js/faker";
import { IBulkUserGrid } from "../components/interface";

export const generateDummyData = (count: number): IBulkUserGrid[] => {
    const dummyData: IBulkUserGrid[] = [];

    for (let i = 0; i < count; i++) {
        const user: IBulkUserGrid = {
            id: i + 1,
            email: faker.allFakers.en.internet.email(),
            displayName: faker.allFakers.en.internet.userName(),
            firstName: faker.allFakers.en.person.firstName(),
            lastName: faker.allFakers.en.person.lastName(),
            licensedSolutions: faker.allFakers.en.commerce.productName(),
            localAccount: i % 2 === 0, // alternate between true and false
            hierarchy: faker.allFakers.en.commerce.department(),
            roles: faker.allFakers.en.person.jobArea(),
        };

        dummyData.push(user);
    }

    return dummyData;
};

export const getRandomNumber = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};
