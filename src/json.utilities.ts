import { EOLresponse, EOLresponseResult, LanguageLatestRelease, LanguageReleases } from './classes.js';
import { getFullLanguageName } from './utilities.js';

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
            jsonData.result.releases[j].isLts,
            jsonData.result.releases[j].isEol,
            jsonData.result.releases[j].eolFrom || "",
            jsonData.result.releases[j].eoasFrom || "",
            new LanguageLatestRelease(
                jsonData.result.releases[j].latest.name,
                jsonData.result.releases[j].latest.date,
                jsonData.result.releases[j].latest.link
            ))

        if (releaseData.isEol == false && releaseData.latest.name !== null && releaseData.latest.name !== undefined) {
            ltsVersions.push(releaseData.version)
        };

        if (checkEOL) {
            releaseData.checkEOL(getFullLanguageName(jsonData.result.name), releaseData.version, releaseData.eolFrom)
        };
    }

    return JSON.stringify(ltsVersions);
}