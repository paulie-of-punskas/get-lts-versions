import { EOLresponse, EOLresponseResult, LanguageLatestRelease, LanguageReleases } from './classes.js';
import { getFullLanguageName, unifyName } from './utilities.js';
import * as core from '@actions/core';

export function isJSONok(jsonInput: string): boolean {
    /**
     * Function checks if returned JSON has expected attributes and structure.
     *
     * @param {Object} jsonInput - JSON file containing data returned by https://endoflife.date API.
     */

    if (typeof jsonInput !== 'string' || jsonInput === null) return false;

    const jsonFile: EOLresponse = JSON.parse(jsonInput) as EOLresponse;
    if (!jsonFile.hasOwnProperty('result')) return false;

    try {
        new EOLresponse(
            jsonFile.schemaVersion,
            jsonFile.generatedAt,
            jsonFile.lastModified,
            jsonFile.result
        );
    } catch (error) {
        if (error instanceof Error) {
            console.error(
                `Caught an error while instantiating EOLresponse: ${error.message}`
            );
        }
        return false;
    }

    try {
        new EOLresponseResult(jsonFile.result.name, jsonFile.result.releases);
    } catch (error) {
        if (error instanceof Error) {
            console.error(
                `Caught an error while instantiating EOLresponseResult: ${error.message}`
            );
        }
        return false;
    }

    return true;
}

export function getNltsVersionsAndCheckEOdates(jsonInput: string, numOfVersions = 3, checkEOL = true): string {
    let maxAvailableVersions: number;
    let ltsVersions: Array<string> = [];

    const jsonData = JSON.parse(jsonInput);

    if (numOfVersions > jsonData.result.releases.length) {
        maxAvailableVersions = jsonData.result.releases.length;
    } else {
        maxAvailableVersions = numOfVersions;
    }

    // retrieve and push LTS versions to an array
    for (let j = 0; j < maxAvailableVersions; j++) {
        let releaseData = new LanguageReleases(
            jsonData.result.releases[j].latest.name,
            jsonData.result.releases[j].latest.isLts,
            jsonData.result.releases[j].latest.isEol,
            jsonData.result.releases[j].latest.eolFrom,
            jsonData.result.releases[j].latest.eoasFrom,
            new LanguageLatestRelease(jsonData.result.releases[j].latest.name, jsonData.result.releases[j].latest.date, jsonData.result.releases[j].latest.link)
        );

        if (releaseData) {
            ltsVersions.push(String(jsonData.result.releases[j]!.latest.name).valueOf())
        };

        if (checkEOL) {
            releaseData.checkEOL(getFullLanguageName(jsonData.result.name), releaseData.version, releaseData.eolFrom)
        };
    }

    // const jsonFile: EOLresponse = JSON.parse(jsonInput) as EOLresponse;
    // console.log(jsonFile);
    return JSON.stringify(ltsVersions);
}

export function getNlatestVersions(
    jsonInput: string,
    numOfVersions: number,
): string {
    /**
     * @param {Object} jsonInput - JSON file containing data returned by https://endoflife.date API.
     * @param {number} numOfVersions - how many LTS versions to retrieve. If it exceeds supported versions,
     * then return max supported number of versions.
     */
    let ltsVersions: Array<string> = [];
    let maxAvailableVersions: number;

    const jsonFile: EOLresponse = JSON.parse(jsonInput) as EOLresponse;

    const responseJson: EOLresponse = new EOLresponse(
        jsonFile.schemaVersion,
        jsonFile.generatedAt,
        jsonFile.lastModified,
        jsonFile.result
    );

    const responseResultJson: EOLresponseResult = new EOLresponseResult(
        responseJson.result.name,
        responseJson.result.releases
    );

    // If numOfVersions is greater than available, then loop through available
    if (numOfVersions > responseResultJson.releases.length) {
        maxAvailableVersions = responseResultJson.releases.length;
    } else {
        maxAvailableVersions = numOfVersions;
    }

    for (let j = 0; j < maxAvailableVersions; j++) {
        if (
            responseResultJson.releases[j]?.latest.name !== null &&
            responseResultJson.releases[j]?.latest.name !== undefined &&
            responseResultJson.releases[j]?.isEol == false
        ) {
            ltsVersions.push(
                String(responseResultJson.releases[j]?.latest.name).valueOf()
            );
        }
    }

    if (numOfVersions != ltsVersions.length) {
        core.notice(
            `Requested (${numOfVersions}) number of versions is not available for ${getFullLanguageName(responseResultJson.name)}. Returning max available: ${ltsVersions.length}.`
        );
    }

    return JSON.stringify(ltsVersions);
}
