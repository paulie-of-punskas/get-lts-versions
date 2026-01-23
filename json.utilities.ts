import { EOLresponse, EOLresponseResult, LanguageReleases, LanguageLatestRelease } from "./classes";

export function isJSONok(jsonInput: string): boolean {
    /**
     * Function checks if returned JSON has expected attributes and structure.
     *
     * @param {Object} jsonInput - JSON file containing data returned by https://endoflife.date API.
    */

    if (typeof jsonInput !== 'string' || jsonInput === null) return false;

    const jsonFile: EOLresponse = JSON.parse(jsonInput) as EOLresponse;
    if (!jsonFile.hasOwnProperty("result")) return false;

    try {
        new EOLresponse(jsonFile.schemaVersion, jsonFile.generatedAt, jsonFile.lastModified, jsonFile.result);
    } catch (error) {
        if (error instanceof Error) {
            console.error(`Caught an error while instantiating EOLresponse: ${error.message}`);
        }
        return false;
    }

    try {
        new EOLresponseResult(jsonFile.result.releases);
    } catch (error) {
        if (error instanceof Error) {
            console.error(`Caught an error while instantiating EOLresponseResult: ${error.message}`);
        }
        return false;
    }

    return true;
}

export function getNlatestVersions(jsonInput: string, numOfVersions: number): Array<string> {
    /**
     * @param {Object} jsonInput - JSON file containing data returned by https://endoflife.date API.
     * @param {number} numOfVersions - how many LTS versions to retrieve. If it exceeds supported versions,
     * then return max supported number of versions.
     */
    let ltsVersions: Array<string> = [];
    let maxAvailableVersions: number;

    const jsonFile: EOLresponse = JSON.parse(jsonInput) as EOLresponse;
    const responseJson: EOLresponse = new EOLresponse(jsonFile.schemaVersion, jsonFile.generatedAt, jsonFile.lastModified, jsonFile.result);

    const responseResultJson: EOLresponseResult = new EOLresponseResult(responseJson.result.releases);
    const responseJsonLanguageReleases: Array<LanguageReleases> = new Array<LanguageReleases>;

    // If numOfVersions is greater than available, then loop through available
    if (numOfVersions > responseJsonLanguageReleases.length) {
        maxAvailableVersions = numOfVersions;
    } else {
        maxAvailableVersions = responseJsonLanguageReleases.length;
    }

    for (let j = 0; j < maxAvailableVersions; j++ ) {
        if (responseResultJson.releases[j]?.latest.name !== null && responseResultJson.releases[j]?.latest.name !== undefined && responseResultJson.releases[j]?.isEol == false) {
            ltsVersions.push(String(responseResultJson.releases[j]?.latest.name).valueOf());
        }
    };

    return ltsVersions;
};