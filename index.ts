import { isJSONok, getNlatestVersions } from "./json.utilities";

function run(language: string, numOfVersions: number): Array<string> {

    let returnedJSON = String(sendRequest(language)).valueOf();

    if (!isJSONok(returnedJSON)) {
        console.error("Could not find required attributes within JSON file.");
        return new Array<string>;
    }
    return getNlatestVersions(returnedJSON, numOfVersions);
};

run("python", 3);