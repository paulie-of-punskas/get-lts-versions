"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isJSONok = isJSONok;
exports.getNlatestVersions = getNlatestVersions;
const classes_1 = require("./classes");
function isJSONok(jsonInput) {
    /**
     * Function checks if returned JSON has expected attributes and structure.
     *
     * @param {Object} jsonInput - JSON file containing data returned by https://endoflife.date API.
    */
    if (typeof jsonInput !== 'string' || jsonInput === null)
        return false;
    const jsonFile = JSON.parse(jsonInput);
    if (!jsonFile.hasOwnProperty("result"))
        return false;
    try {
        new classes_1.EOLresponse(jsonFile.schemaVersion, jsonFile.generatedAt, jsonFile.lastModified, jsonFile.result);
    }
    catch (error) {
        if (error instanceof Error) {
            console.error(`Caught an error while instantiating EOLresponse: ${error.message}`);
        }
        return false;
    }
    try {
        new classes_1.EOLresponseResult(jsonFile.result.releases);
    }
    catch (error) {
        if (error instanceof Error) {
            console.error(`Caught an error while instantiating EOLresponseResult: ${error.message}`);
        }
        return false;
    }
    return true;
}
function getNlatestVersions(jsonInput, numOfVersions) {
    var _a, _b, _c, _d;
    /**
     * @param {Object} jsonInput - JSON file containing data returned by https://endoflife.date API.
     * @param {number} numOfVersions - how many LTS versions to retrieve. If it exceeds supported versions,
     * then return max supported number of versions.
     */
    let ltsVersions = [];
    let maxAvailableVersions;
    const jsonFile = JSON.parse(jsonInput);
    const responseJson = new classes_1.EOLresponse(jsonFile.schemaVersion, jsonFile.generatedAt, jsonFile.lastModified, jsonFile.result);
    const responseResultJson = new classes_1.EOLresponseResult(responseJson.result.releases);
    const responseJsonLanguageReleases = new Array;
    // If numOfVersions is greater than available, then loop through available
    if (numOfVersions > responseJsonLanguageReleases.length) {
        maxAvailableVersions = numOfVersions;
    }
    else {
        maxAvailableVersions = responseJsonLanguageReleases.length;
    }
    for (let j = 0; j < maxAvailableVersions; j++) {
        if (((_a = responseResultJson.releases[j]) === null || _a === void 0 ? void 0 : _a.latest.name) !== null && ((_b = responseResultJson.releases[j]) === null || _b === void 0 ? void 0 : _b.latest.name) !== undefined && ((_c = responseResultJson.releases[j]) === null || _c === void 0 ? void 0 : _c.isEol) == false) {
            ltsVersions.push(String((_d = responseResultJson.releases[j]) === null || _d === void 0 ? void 0 : _d.latest.name).valueOf());
        }
    }
    ;
    return JSON.stringify(ltsVersions);
}
;
