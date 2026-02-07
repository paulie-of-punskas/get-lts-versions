import {
  EOLresponse,
  EOLresponseResult,
  LanguageLTS,
  LanguageLatestRelease,
  LanguageReleases,
} from "../src/classes";
import testDataGo from "../test/data/example_return_go.json";
import testDataJava from "../test/data/example_return_java.json";
import testDataPython from "../test/data/example_return_python.json";

test("EOLresponse - throw error if empty input", () => {
  expect(() => new EOLresponse(undefined)).toThrow(
    "EOLresponse: result parameter is required.",
  );
});

test("EOLresponse - throw error if empty input", () => {
  expect(() => new EOLresponseResult(undefined)).toThrow(
    "EOLresponseResult: releases parameter is required.",
  );
});

test("LanguageReleaeses - throw error if empty input", () => {
  expect(() => new LanguageReleases()).toThrow(
    "LanguageReleases: all parameters are required.",
  );
  expect(() => new LanguageReleases("xx", "qq")).toThrow(
    "LanguageReleases: all parameters are required.",
  );
});

test("LanguageLTS - can be created", () => {
  const testObject: LanguageLTS = new LanguageLTS("test", [0, 1, 2]);
  const testArray: Array<number> = [0, 1, 2];
  expect(testObject.language).toBe("test");
  expect(testObject.ltsVersions).toStrictEqual(testArray);
});

test("LanguageLTS - use getters and setters", () => {
  const testObject: LanguageLTS = new LanguageLTS("", []);

  testObject.language = "labas";
  testObject.ltsVersions = new Array<number>();

  expect(testObject.language).toBe("labas");
  expect(testObject.ltsVersions).toStrictEqual(new Array<number>());
});

test("LanguageLatestRelease - JSON Go", () => {
  const jsonDataGo = new Array(testDataGo.result.releases);

  let testLanguageReleasesArray: Array<LanguageLatestRelease> =
    new Array<LanguageLatestRelease>();
  expect(testLanguageReleasesArray instanceof Array).toBe(true);

  for (var j = 0; j < jsonDataGo[0].length; j++) {
    testLanguageReleasesArray.push(
      new LanguageLatestRelease(
        jsonDataGo[0][j].latest.name,
        jsonDataGo[0][j].latest.date,
        jsonDataGo[0][j].latest.link,
      ),
    );
    expect(testLanguageReleasesArray[j]?.name.length).toBeGreaterThan(0);
    expect(testLanguageReleasesArray[j]?.date.length).toBeGreaterThan(0);
    expect(testLanguageReleasesArray[j]?.link.length).toBeGreaterThan(0);
  }
});

test("LanguageLatestRelease - JSON Java", () => {
  const jsonDataJava = new Array(testDataJava.result.releases);

  let testLanguageReleasesArray: Array<LanguageLatestRelease> =
    new Array<LanguageLatestRelease>();
  expect(testLanguageReleasesArray instanceof Array).toBe(true);

  for (var j = 0; j < jsonDataJava[0].length; j++) {
    testLanguageReleasesArray.push(
      new LanguageLatestRelease(
        jsonDataJava[0][j].latest.name,
        jsonDataJava[0][j].latest.date,
        jsonDataJava[0][j].latest.link,
      ),
    );
    expect(testLanguageReleasesArray[j]?.name.length).toBeGreaterThan(0);
    expect(testLanguageReleasesArray[j]?.date.length).toBeGreaterThan(0);
    expect(testLanguageReleasesArray[j]?.link.length).toBeGreaterThan(0);
  }
});

test("LanguageLatestRelease - JSON Python", () => {
  const jsonDataPython = new Array(testDataPython.result.releases);

  let testLanguageReleasesArray: Array<LanguageLatestRelease> =
    new Array<LanguageLatestRelease>();
  expect(testLanguageReleasesArray instanceof Array).toBe(true);

  for (var j = 0; j < jsonDataPython[0].length; j++) {
    testLanguageReleasesArray.push(
      new LanguageLatestRelease(
        jsonDataPython[0][j].latest.name,
        jsonDataPython[0][j].latest.date,
        jsonDataPython[0][j].latest.link,
      ),
    );
    expect(testLanguageReleasesArray[j]?.name.length).toBeGreaterThan(0);
    expect(testLanguageReleasesArray[j]?.date.length).toBeGreaterThan(0);
    expect(testLanguageReleasesArray[j]?.link.length).toBeGreaterThan(0);
  }
});
