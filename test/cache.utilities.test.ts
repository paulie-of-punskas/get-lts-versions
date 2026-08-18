import { getFileAgeInDays } from '../src/cache.utilities';
import { describe, test, expect } from '@jest/globals';

describe("getFileAge()", () => {
    test("expect ./test/data/example_return_go.json to be older than 5 days", async () => {
        expect(await getFileAgeInDays("./test/data/example_return_go.json")).toBeGreaterThan(5);
    });

    test("expect error if file does not exist", async () => {
        await expect(getFileAgeInDays("x")).rejects.toThrow("x was not found.");
    });
});