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

export function getNlatestVersions(jsonFile: EOLresponse, numOfVersions: number): Array<number> {
    /**
     * @param {EOLresponse} jsonFile - JSON file containing data returned by https://endoflife.date API.
     * @param {number} numOfVersions - how many LTS versions to retrieve. If it exceeds supported versions,
     * then return max supported number of versions.
     */
    let ltsVersions: Array<number> = [];



    const releases: Array<LanguageReleases> = jsonFile.result;

    for (var j = 0; j < releases.length; j++) {

    }
    return ltsVersions;
};