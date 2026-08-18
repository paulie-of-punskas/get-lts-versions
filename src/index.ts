import { isJSONok, getNltsVersionsAndCheckEOdates } from './json.utilities.js';
import { sendRequest } from './request.js';
import { getFileAgeInDays } from './cache.utilities.js';
import * as core from '@actions/core';
import * as cache from '@actions/cache';
import * as fs from 'fs/promises';
import * as path from 'path';
import { unifyName } from './utilities.js';

const CACHE_DIR = path.join(process.env.GITHUB_WORKSPACE || '.', '.cache');
const CACHE_MAX_AGE_DAYS = 7;

export async function run(language: string, numOfVersions: number) {
    /**
     * @param {string} language - name of the language.
     * @param {number} numOfVersions - how many LTS versions to retrieve. If it exceeds supported versions,
     * then return max supported number of versions.
     * @returns {Array} is returned to GitHub Actions runner environment.
     */

    if (!language || numOfVersions <= 0) {
        throw new Error('Invalid input parameters');
    }

    const parsedLanguage = unifyName(language);
    const cacheKey = `lts-versions-${parsedLanguage}-${numOfVersions}`;
    const cacheFile = path.join(CACHE_DIR, `${parsedLanguage}-${numOfVersions}.json`);
    const cachePaths = [cacheFile];

    try {
        // Check for existing cache for a lts-versions-`language`-`numOfVersions`
        const restored = await cache.restoreCache(cachePaths, cacheKey);
        if (restored) {
            const fileAge = await getFileAgeInDays(cacheFile);
            if (fileAge <= CACHE_MAX_AGE_DAYS) {
                console.log(`Found cache for ${parsedLanguage} and its ${numOfVersions} LTS versions.`);
                const cachedData = await fs.readFile(cacheFile, 'utf-8');
                core.setOutput(
                    'lts_versions',
                    getNltsVersionsAndCheckEOdates(cachedData, numOfVersions)
                );
            } else {
                // Cache should be renewed every week, thus if cache is older than 6 days, then it's renewed
                console.log(`Cache for ${parsedLanguage} and ${numOfVersions} LTS versions, is older than ${CACHE_MAX_AGE_DAYS} days (${fileAge}). Renewing it...`);
                const returnedJSON: string = await sendRequest(parsedLanguage);

                if (!isJSONok(returnedJSON)) {
                    throw new Error('Returned JSON has incorrect/new structure.');
                }

                await fs.writeFile(cacheFile, returnedJSON);
                core.setOutput(
                    'lts_versions',
                    getNltsVersionsAndCheckEOdates(returnedJSON, numOfVersions)
                );

                await cache.saveCache(cachePaths, cacheKey);
                console.log(`Cache renewed for ${parsedLanguage} and requested ${numOfVersions} versions!`);
            }
        } else {
            console.log(`Couldn't find cache for ${parsedLanguage} and ${numOfVersions} LTS versions. Creating one...`);
            const returnedJSON: string = await sendRequest(parsedLanguage);

            if (!isJSONok(returnedJSON)) {
                throw new Error('Returned JSON has incorrect/new structure.');
            }

            await fs.mkdir(CACHE_DIR, { recursive: true });
            await fs.writeFile(cacheFile, returnedJSON);

            core.setOutput(
                'lts_versions',
                getNltsVersionsAndCheckEOdates(returnedJSON, numOfVersions)
            );

            // Save to GitHub Actions cache for future runs
            await cache.saveCache(cachePaths, cacheKey);
            console.log(`Cache saved for ${parsedLanguage} and requested ${numOfVersions} versions!`);
        }
    } catch (error) {
        console.log(`::error::Error in run function: ${error}`);
        throw error;
    }
}

run(core.getInput('language'), Number(core.getInput('versions_to_fetch')));
