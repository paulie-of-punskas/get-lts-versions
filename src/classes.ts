export class EOLresponse {
    schemaVersion: string
    generatedAt: string
    lastModified: string
    result: EOLresponseResult

    constructor(schemaVersion: string, generatedAt: string, lastModified: string,
        result: EOLresponseResult) {
        this.schemaVersion = schemaVersion
        this.generatedAt = generatedAt
        this.lastModified = lastModified
        this.result = result

        if (result === undefined) {
            throw new Error("EOLresponse: result parameter is required.");
        }
    }
};

export class EOLresponseResult {
    releases: Array<LanguageReleases>

    constructor(releases: Array<LanguageReleases>) {
        this.releases = releases

        if (releases === undefined) {
            throw new Error("EOLresponseResult: releases parameter is required.");
        }
    };
};

// Will be used as array of LanguageReleases. Some attributes might not be available,
// e.g. eoasFrom for every language.
export class LanguageReleases {
    isLts: boolean
    ltsFrom: string
    isEol: boolean
    eolFrom: string
    eoasFrom: string
    latest: LanguageLatestRelease

    constructor(isLts: boolean, ltsFrom: string, isEol: boolean, eolFrom: string, eoasFrom: string,
        latest: LanguageLatestRelease) {
        this.isLts = isLts
        this.ltsFrom = ltsFrom
        this.isEol = isEol
        this.eolFrom = eolFrom
        this.eoasFrom = eoasFrom
        this.latest = latest

        if (!isLts || !ltsFrom || isEol || !eolFrom || !eoasFrom || !latest) {
            throw new Error("LanguageReleases: all parameters are required.");
        }
    }
};

export class LanguageLatestRelease {
    name: string
    date: string
    link: string

    constructor(name: string, date: string, link: string) {
        this.name = name;
        this.date = date;
        this.link = link;
    }
};

// Object that will be returned to user
export class LanguageLTS {
    language: string
    ltsVersions: Array<number>

    constructor(language: string, ltsVersions: Array<number>) {
        this.language = language;
        this.ltsVersions = ltsVersions;
    }
};
