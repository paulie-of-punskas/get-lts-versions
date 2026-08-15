import LANGUAGE_ALIASES from "./assets/language_names.json" with { type: "json" };

interface Language {
    "languageFullName": string,
    "inputNames": string[],
    "eolName": string
};

const aliases: Record<string, string> = LANGUAGE_ALIASES.aliases;
const languages: Language[] = LANGUAGE_ALIASES.languages;

export function unifyName(language: string): string {
    /**
     * @param {string} language - name of the language.
     * @returns {string} language according to endoflife API documentation, e.g. openjdk
    */

    const parsedLanguage = aliases[language.toLowerCase().trim()];
    if (!parsedLanguage) {
        throw new Error(`Unexpected language name: ${language}`);
    }
    return parsedLanguage;
}

export function getFullLanguageName(language: string): string {
    /**
     * @param {string} language - name of the language.
     * @returns {string} full language name, e.g. Java (OpenJDK)
    */

    const normalizedLanguage = language.toLowerCase().trim();

    const found = languages.find((element) =>
        element.inputNames.includes(normalizedLanguage)
    );

    if (!found) {
        throw new Error(`Language ${language} was not found`);
    }

    return found.languageFullName;
};
