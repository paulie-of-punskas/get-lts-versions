import { LanguageLTS, LanguageLatestRelease, LanguageReleases } from "./classes"
import testDataGo from "./tests/example_return_go.json";

test("LanguageLTS - can be created", () => {
    const testObject: LanguageLTS = new LanguageLTS("test", [0, 1, 2]);
    const testArray: Array<number> = [0, 1, 2];
    expect(testObject.language).toBe("test");
    expect(testObject.ltsVersions).toStrictEqual(testArray);
});

test("LanguageLTS - use getters and setters", () => {
    const testObject: LanguageLTS = new LanguageLTS("", []);

    testObject.language = "labas";
    testObject.ltsVersions = new Array<number>;

    expect(testObject.language).toBe("labas");
    expect(testObject.ltsVersions).toStrictEqual(new Array<number>);
});

test("LanguageReleases - JSON", () => {
    const jsonData = new Array(testDataGo.result.releases);

    let testLanguageReleasesArray: Array<LanguageLatestRelease> = new Array<LanguageLatestRelease>;
    expect(testLanguageReleasesArray instanceof Array).toBe(true);

    for (var j = 0; j < jsonData[0].length; j++) {
        testLanguageReleasesArray.push(new LanguageLatestRelease(jsonData[0][j].latest.name, jsonData[0][j].latest.date, jsonData[0][j].latest.link));
        expect(testLanguageReleasesArray[j].name.length).toBeGreaterThan(0);
        expect(testLanguageReleasesArray[j].date.length).toBeGreaterThan(0);
        expect(testLanguageReleasesArray[j].link.length).toBeGreaterThan(0);
    };

});