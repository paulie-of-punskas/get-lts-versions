import { isJSONok, getNlatestVersions } from './json.utilities.js';
import { sendRequest } from './request.js';
import * as core from '@actions/core';
import * as cache from '@actions/cache';
import * as fs from 'fs/promises';
import * as path from 'path';
import { unifyName } from './utilities.js';

const CACHE_DIR = path.join(process.env.GITHUB_WORKSPACE || '.', '.cache');

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
    const cacheKey = `lts-versions-${parsedLanguage}`;
    const cacheFile = path.join(CACHE_DIR, `${parsedLanguage}.json`);
    const cachePaths = [cacheFile];

    try {
        // Check for existing cache for a `language`
        const restored = await cache.restoreCache(cachePaths, cacheKey);
        if (restored) {
            const cachedData = await fs.readFile(cacheFile, 'utf-8');
            core.setOutput(
                'lts_versions',
                getNlatestVersions(cachedData, numOfVersions)
            );
            core.info(`Found cache for ${parsedLanguage}.`);
        } else {
            const returnedJSON: string = await sendRequest(parsedLanguage);

            if (!isJSONok(returnedJSON)) {
                throw new Error('Returned JSON has incorrect/new structure.');
            }

            await fs.mkdir(CACHE_DIR, { recursive: true });
            await fs.writeFile(cacheFile, returnedJSON);

            core.setOutput(
                'lts_versions',
                getNlatestVersions(returnedJSON, numOfVersions)
            );

            // Save to GitHub Actions cache for future runs
            await cache.saveCache(cachePaths, cacheKey);
            core.info(`Cache saved for ${parsedLanguage}!`);
        }
    } catch (error) {
        console.error(`Error in run function: ${error}`);
        throw error;
    }
}

run(core.getInput('language'), Number(core.getInput('versions_to_fetch')));
