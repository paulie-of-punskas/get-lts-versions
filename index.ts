import { LanguageLTS } from "./classes";

function run(language: string) {
    const languageLTS = new LanguageLTS(language, new Array<number>);
    let returnedJSON = sendRequest("python");

    // if isJSONok(returnedJSON);
    // languageLTS.validateJSONinput(returnedJSON);
};