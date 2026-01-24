import { isJSONok, getNlatestVersions } from "./json.utilities";
import { sendRequest } from "./request";
import * as core from "@actions/core";

async function run(language: string, numOfVersions: number): Promise<string[]> {

    let returnedJSON: Promise<string> = sendRequest(language);

    const returnedJSONasString :string = JSON.stringify(returnedJSON);

    if (!isJSONok(returnedJSONasString)) {
        console.error("Could not find required attributes within JSON file.");
        return new Array<string>;
    }
    return getNlatestVersions(returnedJSONasString, numOfVersions);
};

run(core.getInput("language"), Number(core.getInput("versions_number")));