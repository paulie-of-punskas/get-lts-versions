import { isJSONok, getNlatestVersions } from "./json.utilities";
import { sendRequest } from "./request";
import * as core from "@actions/core";

export async function run(language: string, numOfVersions: number): Promise<string[]> {

    if (!language || numOfVersions <= 0) {
        throw new Error("Invalid input parameters");
    }

    try {
        const returnedJSON: string = await sendRequest(language);

        if (!isJSONok(returnedJSON)) {
            throw new Error("Returned JSON has incorrect/new structure.");
        }

        return getNlatestVersions(returnedJSON, numOfVersions);
    } catch (error) {
        console.error(`Error in run function: ${error}`);
        throw error;
    }
}

run(core.getInput("language"), Number(core.getInput("versions_number")));