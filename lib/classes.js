"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LanguageLTS = exports.LanguageLatestRelease = exports.LanguageReleases = exports.EOLresponseResult = exports.EOLresponse = void 0;
class EOLresponse {
    constructor(schemaVersion, generatedAt, lastModified, result) {
        this.schemaVersion = schemaVersion;
        this.generatedAt = generatedAt;
        this.lastModified = lastModified;
        this.result = result;
        if (result === undefined) {
            throw new Error("EOLresponse: result parameter is required.");
        }
    }
}
exports.EOLresponse = EOLresponse;
;
class EOLresponseResult {
    constructor(releases) {
        this.releases = releases;
        if (releases === undefined) {
            throw new Error("EOLresponseResult: releases parameter is required.");
        }
    }
    ;
}
exports.EOLresponseResult = EOLresponseResult;
;
// Will be used as array of LanguageReleases. Some attributes might not be available,
// e.g. eoasFrom for every language.
class LanguageReleases {
    constructor(isLts, ltsFrom, isEol, eolFrom, eoasFrom, latest) {
        this.isLts = isLts;
        this.ltsFrom = ltsFrom;
        this.isEol = isEol;
        this.eolFrom = eolFrom;
        this.eoasFrom = eoasFrom;
        this.latest = latest;
        if (!isLts || !ltsFrom || isEol || !eolFrom || !eoasFrom || !latest) {
            throw new Error("LanguageReleases: all parameters are required.");
        }
    }
}
exports.LanguageReleases = LanguageReleases;
;
class LanguageLatestRelease {
    constructor(name, date, link) {
        this.name = name;
        this.date = date;
        this.link = link;
    }
}
exports.LanguageLatestRelease = LanguageLatestRelease;
;
// Object that will be returned to user
class LanguageLTS {
    constructor(language, ltsVersions) {
        this.language = language;
        this.ltsVersions = ltsVersions;
    }
}
exports.LanguageLTS = LanguageLTS;
;
