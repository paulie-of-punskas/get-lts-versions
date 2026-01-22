import { isJSONok } from "./json.utilities";

import testDataGo from "./tests/example_return_go.json";

test("isJSONok, expect true - read example_return_go", () => {
    const testJSONdata = testDataGo;
    expect(isJSONok(testJSONdata)).toBe(true);
});

test("isJSONok, expect false - read empty JSON", () => {
    const testJSONdata = JSON.stringify("");
    expect(isJSONok(testJSONdata)).toBe(false);
});

test("isJSONok, expect false - {result = ''}", () => {
    const testJSONdata = {result: ""};
    expect(isJSONok(testJSONdata)).toBe(false);
});

test("isJSONok, expect false - {result = {releases = ''}, }", () => {
    const testJSONdata = {result: {releases: ""}};
    expect(isJSONok(testJSONdata)).toBe(false);
});