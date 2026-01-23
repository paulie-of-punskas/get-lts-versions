import { EOLresponse, EOLresponseResult, LanguageReleases, LanguageLatestRelease } from "./classes";

export function isJSONok(jsonFile: EOLresponse): boolean {
    /**
     * Function checks if returned JSON has expected attributes and structure.
     *
     * @params {string} jsonFile - input file
    */

    if (typeof jsonFile !== 'object' || jsonFile === null) return false;

    // Check if properties are available, have correct type and are non empty
    if (!jsonFile.hasOwnProperty("result")) return false;
    if (jsonFile.result === "" || jsonFile.result === {}) return false;

    const jsonResult = jsonFile.result;
    if (!jsonResult.hasOwnProperty("releases")) return false;
    if (jsonResult.releases === "" || jsonResult.result === {}) return false;

    return true;
}

export function getNlatestVersions(jsonInput: string, numOfVersions: number): Array<number> {
    /**
     * @param {Object} jsonFile - JSON file containing data returned by https://endoflife.date API.
     * @param {number} numOfVersions - how many LTS versions to retrieve. If it exceeds supported versions,
     * then return max supported number of versions.
     */
    let ltsVersions: Array<number> = [];
    let maxAvailableVersions: number;

    const jsonFile: EOLresponse = JSON.parse(jsonInput) as EOLresponse;
    const responseJson: EOLresponse = new EOLresponse(jsonFile.schemaVersion, jsonFile.generatedAt, jsonFile.lastModified, jsonFile.result);

    const responseResultJson: EOLresponseResult = new EOLresponseResult(responseJson.result.releases);
    const responseJsonLanguageReleases: Array<LanguageReleases> = new Array<LanguageReleases>;

    // If numOfVersions is more than available, then loop through available
    if (numOfVersions > responseJsonLanguageReleases.length) {
        maxAvailableVersions = numOfVersions;
    } else {
        maxAvailableVersions = responseJsonLanguageReleases.length;
    }

    for (let j = 0; j < maxAvailableVersions; j++ ) {
        // if
        responseJsonLanguageReleases.push(responseResultJson.releases[j]);
    };

    console.log(responseJsonLanguageReleases.length);

    return ltsVersions;
};