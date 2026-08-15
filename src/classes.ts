import { getFullLanguageName } from "./utilities.js";

export class EOLresponse {
    schemaVersion: string;
    generatedAt: string;
    lastModified: string;
    result: EOLresponseResult;

    constructor(
        schemaVersion: string,
        generatedAt: string,
        lastModified: string,
        result: EOLresponseResult
    ) {
        this.schemaVersion = schemaVersion;
        this.generatedAt = generatedAt;
        this.lastModified = lastModified;
        this.result = result;

        if (result === undefined) {
            throw new Error('EOLresponse: result parameter is required.');
        }
    }
}

export class EOLresponseResult {
    name: string;
    releases: Array<LanguageReleases>;

    constructor(name: string, releases: Array<LanguageReleases>) {
        this.name = name;
        this.releases = releases;

        if (!name || releases === undefined) {
            throw new Error('EOLresponseResult: all parameters are required.');
        }
    }
}

// Will be used as array of LanguageReleases. Some attributes might not be available,
// e.g. eoasFrom, for every language.
export class LanguageReleases {
    majorMinorVersion: string;
    majorMinorPatchVersion: string;
    isLts: boolean;
    isEol: boolean;
    eolFrom: string;
    eoasFrom: string;
    latest: LanguageLatestRelease;

    constructor(
        majorMinorVersion: string,
        majorMinorPatchVersion: string,
        isLts: boolean,
        isEol: boolean,
        eolFrom: string,
        eoasFrom: string,
        latest: LanguageLatestRelease
    ) {
        this.majorMinorVersion = majorMinorVersion;
        this.majorMinorPatchVersion = majorMinorPatchVersion;
        this.isLts = isLts;
        this.isEol = isEol;
        this.eolFrom = eolFrom;
        this.eoasFrom = eoasFrom;
        this.latest = latest;

        if (!majorMinorVersion || typeof isLts !== 'boolean' || typeof isEol !== 'boolean' || !latest) { // eolFrom, eoasFrom can be missing, e.g. Golang
            throw new Error('LanguageReleases: all parameters are required.');
        }
    }

    checkEOL(languageName: string, majorMinorVersion: string, inputEOLdate: string): void|string {
        if (inputEOLdate === "null" || inputEOLdate === null || inputEOLdate === "" || !inputEOLdate) {
            console.log(`::notice::There is no information about End Of Life date for ${getFullLanguageName(languageName)} ${majorMinorVersion}.`);
            return "";
        };

        const eolDate = new Date(inputEOLdate.concat("T00:00:00"));
        const diffDays = Math.ceil((eolDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

        if (diffDays < 0) {
            console.log(`::warning::${getFullLanguageName(languageName)} ${majorMinorVersion} support has expired on ${eolDate.toLocaleDateString('en-CA')}. It no longer offers active or security support.`);
        } else if (diffDays <= 180) {
            console.log(`::notice::${getFullLanguageName(languageName)} ${majorMinorVersion} End Of Life is approaching. It still has ${diffDays} day(s) of security support.`);
        };
    }
}

export class LanguageLatestRelease {
    majorMinorPatchVersion: string;
    date: string;
    link: string;

    constructor(majorMinorPatchVersion: string, date: string, link: string) {
        this.majorMinorPatchVersion = majorMinorPatchVersion;
        this.date = date;
        this.link = link;

        if (!majorMinorPatchVersion || !date || !link) {
            throw new Error(`LanguageLatestRelease: all parameters are required.`);
        }
    }
}

// Object that will be returned to a user
export class LanguageLTS {
    language: string;
    ltsVersions: Array<number>;

    constructor(language: string, ltsVersions: Array<number>) {
        this.language = language;
        this.ltsVersions = ltsVersions;
    }
}
