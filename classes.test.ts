import { LanguageLTS } from "./classes"

test('LanguageLTS can be created', () => {
    const testObject: LanguageLTS = new LanguageLTS("test", [0, 1, 2]);
    const testArray: Array<number> = [0, 1, 2];
    expect(testObject.language).toBe("test");
    expect(testObject.ltsVersions).toStrictEqual(testArray);
});

test('LanguageLTS - use getters and setters', () => {
    const testObject: LanguageLTS = new LanguageLTS("", []);

    testObject.language = "labas";
    testObject.ltsVersions = new Array<number>;

    expect(testObject.language).toBe("labas");
    // expect(testObject.ltsVersions).toStrictEqual("");

});