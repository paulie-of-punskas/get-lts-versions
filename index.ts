import { isJSONok, getNlatestVersions } from "./src/json.utilities";
import { sendRequest } from "./src/request";

function run(language: string, numOfVersions: number): Array<string> {

    let returnedJSON: Promise<string> = sendRequest(language);

    const returnedJSONasString :string = JSON.stringify(returnedJSON);

    if (!isJSONok(returnedJSONasString)) {
        console.error("Could not find required attributes within JSON file.");
        return new Array<string>;
    }
    return getNlatestVersions(returnedJSONasString, numOfVersions);
};

// run("python", 3);