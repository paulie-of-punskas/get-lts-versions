import LANGUAGE_NAMES from "../../../assets/lang_names.json" with { type: "json" };
import OS_NAMES from "../../../assets/os_names.json" with { type: "json" };

export async function getAllEOLProducts() {
    const header = new Headers();
    const url = "https://endoflife.date/api/v1/products/";
    header.append('Content-Type', 'application/json');

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: header
        });
        if (!response.ok && response.status !== 404) {
            console.error(`Response status: ${response.status}`);
            return [];
        }
        const result = await response.json();
        return result;
    } catch (error) {
        if (error instanceof Error) {
            console.error(`Caught an unexpected error: ${error.message}`);
        }
        return [];
    }
}

function extractProductNamesFromEOL(jsonWithProduct, productType) {
    let productNames = [];
    const languages = jsonWithProduct.result;
    for (let j = 0; j < languages.length; j++) {
        if (languages[j].category === productType) {
            productNames.push(languages[j].name);
        }
    }
    return productNames;
}

function convertProductNamesToSet(productType) {
    if (productType === "lang") {
        return new Set(Object.keys(LANGUAGE_NAMES.aliases));
    }
    return new Set(Object.keys(OS_NAMES.aliases));
}

export function areProductNamesUpToDate(jsonWithProduct, productType) {
    const productNames = extractProductNamesFromEOL(jsonWithProduct);
    const productNamesSet = convertProductNamesToSet(productType);
    let areProductNamesUpToDate = true;

    for (let j = 0; j < productNames.length; j++) {
        if (!productNamesSet.has(productNames[j])) {
            console.log(`Following product is missing: ${productNames[j]}`);
            areProductNamesUpToDate = false;
        }
    }
    return areProductNamesUpToDate;
}
