import * as core from '@actions/core';
import * as cache from '@actions/cache';

import { stat, mkdir, writeFile } from 'node:fs/promises';
import { isJSONok, getNltsVersionsAndCheckEOdates } from './json.utilities.js';
import { sendRequest } from './request.js';

// Used for destructuring
interface CachingParameters {
    parsedLanguage: string;
    numOfVersions: number;
    fileAge: number;
    CACHE_DIR: string;
    CACHE_MAX_AGE_DAYS: number;
    cacheFile: string;
    cachePaths: string[];
    cacheKey: string;
}

export async function getFileAgeInDays(fullFilePath: string): Promise<number> {
    try {
        const fileStats = await stat(fullFilePath);
        const ageInMS = Date.now() - fileStats.ctimeMs;
        return Math.floor(ageInMS / (1000 * 60 * 60 * 24));
    } catch (error) {
        throw new Error(`${fullFilePath} was not found.`);
    }
}

export async function writeRenewCache(action: "renew" | "create", cacheParams: CachingParameters): Promise<void | Error> {
    const { parsedLanguage, numOfVersions, fileAge, CACHE_DIR, CACHE_MAX_AGE_DAYS, cacheFile, cachePaths, cacheKey } = cacheParams;

    if (action !== "renew" && action !== "create") {
        throw new Error(`"renew" or "create" are acceptible values for action`);
    }

    const messagesToPrint = {
        renew: {
            needsUpdate: `Cache for ${parsedLanguage} and ${numOfVersions} LTS versions, is older than ${CACHE_MAX_AGE_DAYS} days (${fileAge}). Renewing it...`,
            updateSuccess: `Cache renewed for ${parsedLanguage} and requested ${numOfVersions} versions!`
        },
        create: {
            needsUpdate: `Couldn't find cache for ${parsedLanguage} and ${numOfVersions} LTS versions. Creating one...`,
            updateSuccess: `Cache saved for ${parsedLanguage} and requested ${numOfVersions} versions!`
        }
    };

    console.log(messagesToPrint[action].needsUpdate);
    const returnedJSON: string = await sendRequest(parsedLanguage);

    if (!isJSONok(returnedJSON)) {
        throw new Error('Returned JSON has incorrect/new structure.');
    }
    if (action === "create") {
        await mkdir(CACHE_DIR, { recursive: true });
    }
    await writeFile(cacheFile, returnedJSON);
    core.setOutput(
        'lts_versions',
        getNltsVersionsAndCheckEOdates(returnedJSON, numOfVersions)
    );

    await cache.saveCache(cachePaths, cacheKey);
    console.log(messagesToPrint[action].updateSuccess);
}