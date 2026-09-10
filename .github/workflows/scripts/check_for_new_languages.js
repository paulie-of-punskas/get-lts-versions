import EOL_PRODUCTS from "./end_of_life_products.json" with { type: "json" };
import LANGUAGE_NAMES from "../../../src/assets/language_names.json" with { type: "json" };

function returnLanguageNamesFromEOL() {
    let languageNames = [];
    const languages = EOL_PRODUCTS.result;
    for (let j = 0; j < languages.length; j++) {
        if (languages[j].category == "lang") {
            languageNames.push(languages[j].name);
        }
    }
    return languageNames;
}

function convertLanguageNamesToSet() {
    return new Set(Object.keys(LANGUAGE_NAMES.aliases));
}

export function areLanguageNamesUpToDate() {
    const languageNames = returnLanguageNamesFromEOL();
    const languageNamesSet = convertLanguageNamesToSet();
    let areLanguagesUpToDate = true;

    for (let j = 0; j < languageNames.length; j++) {
        if (!languageNamesSet.has(languageNames[j])) {
            console.log(`Following language is missing: ${languageNames[j]}`);
            areLanguageNamesUpToDate = false;
        }
    }
    return areLanguageNamesUpToDate;
}
