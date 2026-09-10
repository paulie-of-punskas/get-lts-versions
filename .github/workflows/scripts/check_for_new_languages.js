import LANGUAGE_NAMES from "../../../src/assets/language_names.json" with { type: "json" };

async function getAllEOLProducts() {
    const header = new Headers();
    const url = "https://endoflife.date/api/v1/products/";
    header.append('Content-Type', 'application/json');

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: header
        });
        if (!response.ok && response.status != 404) {
            console.error(`Response status: ${response.status}`);
            return [];
        }
        const result = await response.json();
        return result.result;
    } catch (error) {
        if (error instanceof Error) {
            console.error(`Caught an unexpected error: ${error.message}`);
        }
        return [];
    }
}

async function returnLanguageNamesFromEOL() {
    let languageNames = [];
    const returnedJSON = await getAllEOLProducts();
    const languages = returnedJSON.result;
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

export async function areLanguageNamesUpToDate() {
    const languageNames = await returnLanguageNamesFromEOL();
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
