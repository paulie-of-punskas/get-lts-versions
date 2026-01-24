import { isJSONok, getNlatestVersions } from "../src/json.utilities";

import testDataGo from "../test/data/example_return_go.json";
import testDataPython from "../test/data/example_return_python.json";

describe("isJSONok():", () => {
    const testJSONdata = testDataGo;

    it("should return true, when input is example_return_go", () => {
        expect(isJSONok(JSON.stringify(testJSONdata))).toBe(true);
    });

    it("should return false, when input is empty JSON", () => {
        expect(isJSONok(JSON.stringify(""))).toBe(false);
    });

    it("should return false, when input is '{}'", () => {
        expect(isJSONok(JSON.stringify({}))).toBe(false);
    });

    it("should return false, when input is {'result': ''}", () => {
        expect(isJSONok(JSON.stringify({result: ''}))).toBe(false);
    });

    // not sure about this test
    // it("should return false, if input is {releases: {result: ''}", () => {
    //     expect(isJSONok(JSON.stringify({result: {releases: ""}}))).toBe(false);
    // });

    it("should return true, for locally imported Go data", () => {
        // get JSON as a string
        const jsonInputAsString :string = JSON.stringify(testDataGo);
        // console.log(typeof jsonInputAsString);
        expect(isJSONok(jsonInputAsString)).toBe(true);
        // console.log(isJSONok(jsonInputAsString));

        // convert to EOLresponse
        const eolFile: EOLresponse = JSON.parse(jsonInputAsString) as EOLresponse;
        console.log(`eolFile type: ${typeof eolFile.result}`);
//        console.log(eolFile.result);
        console.log(typeof eolFile.result.releases);

        const eolFileResp: EOLresponseResult = new EOLresponseResult(eolFile.result.releases);
        console.log(`eolFileResp type: ${typeof eolFileResp.releases}`);
    });
});

describe("getNlatestVersions():", () => {
    it("should return array sized of 3, for Python and N = 3", () => {
        const result: Array<string> = getNlatestVersions(JSON.stringify(testDataPython), 3);
        expect(result).toHaveLength(3);
    });

    it("should return array sized of 2, for Golang and N = 3", () => {
        const result: Array<string> = getNlatestVersions(JSON.stringify(testDataGo), 3);
        expect(result).toHaveLength(2);
    });
});


//////////////////////////////////////////////////////////
// Integration tests with mocks
/////////////////////////////////////////////////////////

// Below test will only work, if local server is running
// Can be insantiated with `python3 -m http.server` within tests/
// test("Mock behaviour", async () => {
//     const url = "http://localhost:8000/example_return_go.json";
//     const header = new Headers();
//     header.append("Content-Type", "application/json");

//     try {
//         const response = await fetch(url, {
//             method: "GET",
//             headers: header,
//         });
//         if (!response.ok) {
//             console.error(`Response status: ${response.status}`);
//             return {};
//         } else if (response.status == 404) {
//             console.error(`not found on https://endoflife.date.`);
//             return {};
//         };
//         const result = await response.text();
//         const ltsVersions: Array<string> = getNlatestVersions(result, 3);
//         expect(ltsVersions).toHaveLength(2);
//     } catch(error) {
//         if (error instanceof Error) {
//             console.error(`Caught an error: ${error.message}`);
//         }
//         return {};
//     };
// });

import { spawn, ChildProcessWithoutNullStreams } from "child_process";
import axios from "axios";
import { EOLresponse, EOLresponseResult } from "../src/classes";

describe("Python HTTP Server Tests", () => {
    let pythonServer: ChildProcessWithoutNullStreams | null = null;
    const serverPort = 8000;

    beforeAll(async () => {
        // Spawn Python HTTP server
        pythonServer = spawn("python3", ["-m", "http.server", String(serverPort), "--directory", "./test/data"], {
            detached: true,
            stdio: 'ignore'
        });
        await new Promise(resolve => setTimeout(resolve, 500));
    });

    afterAll(async () => {
        if (pythonServer) {
            try {
                process.kill(-pythonServer.pid);
            } catch (error) {
                console.error(`Error stopping Python server: ${error}`);
            }
        }
    });

    // it("should return 404, while serving files", async () => {
    //     try {
    //         const response = await axios.get("http://localhost:8000/example_return_xxx.json");
    //         expect(response.status).toBe(404);
    //         // expect(isJSONok(JSON.stringify(response.data))).toBe(true);
    //     } catch (error) {
    //         console.error(`File serving failed: ${error}`);
    //     }
    // });

    it("should serve files correctly", async () => {
        try {
            const response = await axios.get("http://localhost:8000/example_return_go.json");
            expect(response.status).toBe(200);
            expect(isJSONok(JSON.stringify(response.data))).toBe(true);
        } catch (error) {
            console.error(`File serving failed: ${error}`);
        }
    });
});
