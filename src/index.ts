import { isJSONok, getNlatestVersions } from "./json.utilities.js";
import { sendRequest } from "./request.js";
import * as core from "@actions/core";

export async function run(language: string, numOfVersions: number) {
    /**
     * @param {string} language - name of the language.
     * @param {number} numOfVersions - how many LTS versions to retrieve. If it exceeds supported versions,
     * then return max supported number of versions.
     * @returns {Array} is returned to GitHub Actions runner environment.
     */

    if (!language || numOfVersions <= 0) {
        throw new Error("Invalid input parameters");
    }

    try {
        const returnedJSON: string = await sendRequest(language);

        if (!isJSONok(returnedJSON)) {
            throw new Error("Returned JSON has incorrect/new structure.");
        }

        core.setOutput("lts_versions", getNlatestVersions(returnedJSON, numOfVersions));
    } catch (error) {
        console.error(`Error in run function: ${error}`);
        throw error;
    }
}

run(core.getInput("language"), Number(core.getInput("versions_to_fetch")));