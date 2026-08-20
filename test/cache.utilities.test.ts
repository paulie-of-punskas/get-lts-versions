import { getFileAgeInDays } from '../src/cache.utilities';
import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import * as fs from 'fs/promises';
import * as path from 'path';

describe("getFileAge()", () => {
    // test("expect ./test/data/example_return_go.json to be older than 5 days", async () => {
    //     expect(await getFileAgeInDays("./test/data/example_return_go.json")).toBeGreaterThan(5);
    // });

    const testFilePath = path.join("./test/data", "test-age-file.json");
    beforeEach(async () => {
        await fs.writeFile(testFilePath, JSON.stringify({ test: true }));
    });

    afterEach(async () => {
        try {
            await fs.unlink(testFilePath);
        } catch {
        }
    });

    test("expect test file to be 0 days old", async () => {
        expect(await getFileAgeInDays(testFilePath)).toBe(0);
    });

    test("expect error if file does not exist", async () => {
        await expect(getFileAgeInDays("x")).rejects.toThrow("x was not found.");
    });
});