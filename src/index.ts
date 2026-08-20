import { getNltsVersionsAndCheckEOdates } from './json.utilities.js';
import { getFileAgeInDays, writeRenewCache } from './cache.utilities.js';
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
                // Cache should be renewed every week, thus if cache is older than 7 days, then it's renewed
                await writeRenewCache("renew", { parsedLanguage, numOfVersions, fileAge, CACHE_DIR, CACHE_MAX_AGE_DAYS, cacheFile, cachePaths, cacheKey });
            }
        } else {
            const fileAge = 0;
            await writeRenewCache("create", { parsedLanguage, numOfVersions, fileAge, CACHE_DIR, CACHE_MAX_AGE_DAYS, cacheFile, cachePaths, cacheKey });
        }
    } catch (error) {
        console.log(`::error::Error in run function: ${error}`);
        throw error;
    }
}

run(core.getInput('language'), Number(core.getInput('versions_to_fetch')));
