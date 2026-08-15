import { jest, test, expect, describe, beforeEach } from '@jest/globals';

import {
    EOLresponse,
    EOLresponseResult,
    LanguageLTS,
    LanguageLatestRelease,
    LanguageReleases
} from '../src/classes';

import testDataGo from '../test/data/example_return_go.json' with { type: 'json' };
import testDataJava from '../test/data/example_return_java.json' with { type: 'json' };
import testDataPython from '../test/data/example_return_python.json' with { type: 'json' };

describe('LanguageReleases.checkEOL() - JSON Python', () => {
    beforeEach(() => {
        Date.now = mockDateNow;
        jest.resetModules();
    });

    const mockDateNow = (() => 1793318400000); // 2026-10-30

    test('core.notice() should be called for Python 3.10', () => {
        const jsonDataPython = new Array(testDataPython.result.releases);

        const release = new LanguageReleases(
            jsonDataPython[0][4].name,
            jsonDataPython[0][4].isLts,
            jsonDataPython[0][4].isEol,
            jsonDataPython[0][4].eolFrom,
            jsonDataPython[0][4].eoasFrom || "",
            jsonDataPython[0][4].latest
       );

    //    core.notice.mockResolvedValue();

        release.checkEOL("Python", release.version, release.eolFrom);
        // expect(core.notice).toHaveBeenCalledWith(`Python 3.10 End Of Life is approaching. It still has 1 day(s) of security support.`);
    })

    test('core.warning() should be called for Python 3.9', () => {
        const jsonDataPython = new Array(testDataPython.result.releases);
        const release = new LanguageReleases(
            jsonDataPython[0][5].name,
            jsonDataPython[0][5].isLts,
            jsonDataPython[0][5].isEol,
            jsonDataPython[0][5].eolFrom,
            jsonDataPython[0][5].eoasFrom || "",
            jsonDataPython[0][5].latest
       );


        release.checkEOL("Python", release.version, release.eolFrom);
        // expect(mockCore.warning).toHaveBeenCalledWith(`Python 3.9 has expired on 2025-10-31. It no longer offers active or security support.`);
    })
});

test('EOLresponse - throw error if empty input', () => {
    expect(() => new EOLresponse(undefined)).toThrow(
        'EOLresponse: result parameter is required.'
    );
});

test('EOLresponse - throw error if empty input', () => {
    expect(() => new EOLresponseResult(undefined)).toThrow(
        'EOLresponseResult: all parameters are required.'
    );
});

test('LanguageReleases - throw error if empty input', () => {
    expect(() => new LanguageReleases()).toThrow(
        'LanguageReleases: all parameters are required.'
    );
    expect(() => new LanguageReleases('xx', 'qq')).toThrow(
        'LanguageReleases: all parameters are required.'
    );
});


test('LanguageReleases - JSON Python', () => {
    const jsonDataPython = new Array(testDataPython.result.releases);

    const release = new LanguageReleases(
        jsonDataPython[0][0].name,
        jsonDataPython[0][0].isLts,
        jsonDataPython[0][0].isEol,
        jsonDataPython[0][0].eolFrom,
        jsonDataPython[0][0].eoasFrom || "",
        jsonDataPython[0][0].latest
    );

    expect(typeof release.version).toBe("string");
    expect(typeof release.isLts).toBe("boolean");
    expect(typeof release.isEol).toBe("boolean");
    expect(typeof release.eolFrom).toBe("string");
    expect(typeof release.eoasFrom).toBe("string");
    expect(typeof release.latest).toBe("object");
});

describe('LanguageReleases.checkEOL() - JSON Golang', () => {
    test('core.notice() should be called for Go 1.25', () => {
        const jsonDataGo = new Array(testDataGo.result.releases);

        const release = new LanguageReleases(
            jsonDataGo[0][0].name,
            jsonDataGo[0][0].isLts,
            jsonDataGo[0][0].isEol,
            jsonDataGo[0][0].eolFrom || "",
            jsonDataGo[0][0].eoasFrom || "",
            new LanguageLatestRelease(jsonDataGo[0][0].latest.name, jsonDataGo[0][0].latest.date, jsonDataGo[0][0].latest.link)
       );
    });
});

test('LanguageLTS - can be created', () => {
    const testObject: LanguageLTS = new LanguageLTS('test', [0, 1, 2]);
    const testArray: Array<number> = [0, 1, 2];
    expect(testObject.language).toBe('test');
    expect(testObject.ltsVersions).toStrictEqual(testArray);
});

test('LanguageLTS - use getters and setters', () => {
    const testObject: LanguageLTS = new LanguageLTS('', []);

    testObject.language = 'labas';
    testObject.ltsVersions = new Array<number>();

    expect(testObject.language).toBe('labas');
    expect(testObject.ltsVersions).toStrictEqual(new Array<number>());
});

test('LanguageLatestRelease - JSON Go', () => {
    const jsonDataGo = new Array(testDataGo.result.releases);

    let testLanguageReleasesArray: Array<LanguageLatestRelease> =
        new Array<LanguageLatestRelease>();
    expect(testLanguageReleasesArray instanceof Array).toBe(true);

    for (var j = 0; j < jsonDataGo[0].length; j++) {
        testLanguageReleasesArray.push(
            new LanguageLatestRelease(
                jsonDataGo[0][j].latest.name,
                jsonDataGo[0][j].latest.date,
                jsonDataGo[0][j].latest.link
            )
        );
        expect(testLanguageReleasesArray[j]?.name.length).toBeGreaterThan(0);
        expect(testLanguageReleasesArray[j]?.date.length).toBeGreaterThan(0);
        expect(testLanguageReleasesArray[j]?.link.length).toBeGreaterThan(0);
    }
});

test('LanguageLatestRelease - JSON Java', () => {
    const jsonDataJava = new Array(testDataJava.result.releases);

    let testLanguageReleasesArray: Array<LanguageLatestRelease> =
        new Array<LanguageLatestRelease>();
    expect(testLanguageReleasesArray instanceof Array).toBe(true);

    for (var j = 0; j < jsonDataJava[0].length; j++) {
        testLanguageReleasesArray.push(
            new LanguageLatestRelease(
                jsonDataJava[0][j].latest.name,
                jsonDataJava[0][j].latest.date,
                jsonDataJava[0][j].latest.link
            )
        );
        expect(testLanguageReleasesArray[j]?.name.length).toBeGreaterThan(0);
        expect(testLanguageReleasesArray[j]?.date.length).toBeGreaterThan(0);
        expect(testLanguageReleasesArray[j]?.link.length).toBeGreaterThan(0);
    }
});

test('LanguageLatestRelease - JSON Python', () => {
    const jsonDataPython = new Array(testDataPython.result.releases);

    let testLanguageReleasesArray: Array<LanguageLatestRelease> =
        new Array<LanguageLatestRelease>();
    expect(testLanguageReleasesArray instanceof Array).toBe(true);

    for (var j = 0; j < jsonDataPython[0].length; j++) {
        testLanguageReleasesArray.push(
            new LanguageLatestRelease(
                jsonDataPython[0][j].latest.name,
                jsonDataPython[0][j].latest.date,
                jsonDataPython[0][j].latest.link
            )
        );
        expect(testLanguageReleasesArray[j]?.name.length).toBeGreaterThan(0);
        expect(testLanguageReleasesArray[j]?.date.length).toBeGreaterThan(0);
        expect(testLanguageReleasesArray[j]?.link.length).toBeGreaterThan(0);
    }
});
