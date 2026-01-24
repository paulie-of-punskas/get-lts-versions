import { LanguageLTS } from "./classes";

function run(language: string, numOfVersions: number): Array<number> {
    const languageLTS = new LanguageLTS(language, new Array<number>);
    let returnedJSON = sendRequest("python");

    if (!isJSONok(returnedJSON)) {
        console.error("Could not find required attributes within JSON file.");
        return new Array<number>;
    }

    //
};