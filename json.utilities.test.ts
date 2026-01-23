import { EOLresponse } from "./classes";
import { isJSONok, getNlatestVersions } from "./json.utilities";

// import fs from "fs";

import testDataGo from "./tests/example_return_go.json";
import testDataPython from "./tests/example_return_python.json";

test("isJSONok, expect true - read example_return_go", () => {
    const testJSONdata = testDataGo;
    expect(isJSONok(JSON.stringify(testJSONdata))).toBe(true);
});

test("isJSONok, expect false - read empty JSON", () => {
    const testJSONdata = JSON.stringify("");
    expect(isJSONok(testJSONdata)).toBe(false);
});

test("isJSONok, expect false - {}", () => {
    const jsonInput = JSON.stringify("{}");
    expect(isJSONok(JSON.stringify(jsonInput))).toBe(false);
});

test("isJSONok, expect false - {result = ''}", () => {
    const jsonInput = JSON.stringify({result: ""});
    expect(isJSONok(JSON.stringify(jsonInput))).toBe(false);
});

test("isJSONok, expect false - {result = {releases = ''}, }", () => {
    const jsonInput = JSON.stringify({releases: {result: ""}});
    const jsonFile: EOLresponse = JSON.parse(jsonInput) as EOLresponse;
    expect(isJSONok(JSON.stringify(jsonFile))).toBe(false);
});

test("getNlatestVersions, Python, N=3 - expect returned array, size of 3", () => {
    const result: Array<string> = getNlatestVersions(JSON.stringify(testDataPython), 3);
    expect(result).toHaveLength(3);
});

test("getNlatestVersions, Golang, N=3 - expect returned array, size of 2", () => {
    const result: Array<string> = getNlatestVersions(JSON.stringify(testDataGo), 3);
    expect(result).toHaveLength(2);
});


//////////////////////////////////////////////////////////
// Integration tests with mocks
/////////////////////////////////////////////////////////
import * as https from "https";

test("Mock behaviour", async () => {
    const url = "http://localhost:8000/example_return_go.json";
    const header = new Headers();
    header.append("Content-Type", "application/json");

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: header,
        });
        if (!response.ok) {
            console.error(`Response status: ${response.status}`);
            return {};
        } else if (response.status == 404) {
            console.error(`not found on https://endoflife.date.`);
            return {};
        };
        const result = await response.text();
        console.log(getNlatestVersions(result, 3));
    } catch(error) {
        if (error instanceof Error) {
            console.error(`Caught an error: ${error.message}`);
        }
        return {};
    };

});

// jest.mock("https");

// describe("Extract data", () => {
//     beforeEach(() => {
//         jest.clearAllMocks();
//     });

//     describe("HTTP source", () => {
//         it("should extract data from HTTPS URL", async () => {
//             const mockJSONdata = JSON.stringify({
//                 "schema_version": "1.2.0",
//                 "generated_at": "2026-01-22T00:11:38+00:00",
//                 "last_modified": "2026-01-16T00:10:25+00:00",
//                 "result": {
//                     "name": "go",
//                     "aliases": ["golang"],
//                     "label": "Go",
//                     "category": "lang",
//                     "tags": ["google", "lang"],
//                     "versionCommand": "go version",
//                     "identifiers": [{"type": "repology", "id": "go"}],
//                     "labels": {
//                         "eoas": null,
//                         "discontinued": null,
//                         "eol": "Supported",
//                         "eoes": null
//                     },
//                     "links": {
//                         "icon": "https://cdn.jsdelivr.net/npm/simple-icons/icons/go.svg",
//                         "html": "https://endoflife.date/go",
//                         "releasePolicy": "https://go.dev/doc/devel/release#policy"
//                     },
//                     "releases": [
//                     {
//                         "name": "1.25",
//                         "codename": null,
//                         "label": "1.25",
//                         "releaseDate": "2025-08-12",
//                         "isLts": false,
//                         "ltsFrom": null,
//                         "isEol": false,
//                         "eolFrom": null,
//                         "isMaintained": true,
//                         "latest": {
//                             "name": "1.25.6",
//                             "date": "2026-01-15",
//                             "link": "https://go.dev/doc/devel/release#go1.25.minor"
//                         },
//                         "custom": null
//                     },
//                     {
//                         "name": "1.24",
//                         "codename": null,
//                         "label": "1.24",
//                         "releaseDate": "2025-02-11",
//                         "isLts": false,
//                         "ltsFrom": null,
//                         "isEol": false,
//                         "eolFrom": null,
//                         "isMaintained": true,
//                         "latest": {
//                             "name": "1.24.12",
//                             "date": "2026-01-15",
//                             "link": "https://go.dev/doc/devel/release#go1.24.minor"
//                         },
//                         "custom": null
//                     }]}
//                 });
//                 const mockResponse = {
//                     on: jest.fn((event, handler) => {
//                         if (event === "data") {
//                             handler(mockJSONdata)
//                         } else if (event === "end") {
//                             handler();
//                         }
//                         return mockResponse;
//                     }),
//                 };

//                 const mockRequest = {
//                     on: jest.fn().mockReturnThis(),
//                 };

//                 (https.get as jest.Mock).mockImplementation((url, callback) => {
//                     callback(mockResponse);
//                     return mockRequest;
//                 })

//                 const result = await extractData("https://example.com/data.json");

//                 expect(result).toEqual(
//                     {
//                 "schema_version": "1.2.0",
//                 "generated_at": "2026-01-22T00:11:38+00:00",
//                 "last_modified": "2026-01-16T00:10:25+00:00",
//                 "result": {
//                     "name": "go",
//                     "aliases": ["golang"],
//                     "label": "Go",
//                     "category": "lang",
//                     "tags": ["google", "lang"],
//                     "versionCommand": "go version",
//                     "identifiers": [{"type": "repology", "id": "go"}],
//                     "labels": {
//                         "eoas": null,
//                         "discontinued": null,
//                         "eol": "Supported",
//                         "eoes": null
//                     },
//                     "links": {
//                         "icon": "https://cdn.jsdelivr.net/npm/simple-icons/icons/go.svg",
//                         "html": "https://endoflife.date/go",
//                         "releasePolicy": "https://go.dev/doc/devel/release#policy"
//                     },
//                     "releases": [
//                     {
//                         "name": "1.25",
//                         "codename": null,
//                         "label": "1.25",
//                         "releaseDate": "2025-08-12",
//                         "isLts": false,
//                         "ltsFrom": null,
//                         "isEol": false,
//                         "eolFrom": null,
//                         "isMaintained": true,
//                         "latest": {
//                             "name": "1.25.6",
//                             "date": "2026-01-15",
//                             "link": "https://go.dev/doc/devel/release#go1.25.minor"
//                         },
//                         "custom": null
//                     },
//                     {
//                         "name": "1.24",
//                         "codename": null,
//                         "label": "1.24",
//                         "releaseDate": "2025-02-11",
//                         "isLts": false,
//                         "ltsFrom": null,
//                         "isEol": false,
//                         "eolFrom": null,
//                         "isMaintained": true,
//                         "latest": {
//                             "name": "1.24.12",
//                             "date": "2026-01-15",
//                             "link": "https://go.dev/doc/devel/release#go1.24.minor"
//                         },
//                         "custom": null
//                     }]}
//                 });
//         });
//     })
// })