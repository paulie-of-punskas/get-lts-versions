import { stat } from 'node:fs/promises';

export async function getFileAgeInDays(fullFilePath: string): Promise<number> {
    try {
        const fileStats = await stat(fullFilePath);
        const ageInMS = Date.now() - fileStats.ctimeMs;
        return Math.floor(ageInMS / (1000 * 60 * 60 * 24));
    } catch (error) {
        throw new Error(`${fullFilePath} was not found.`);
    }
}