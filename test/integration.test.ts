import { isJSONok, getNlatestVersions } from "../src/json.utilities";
import { sendRequest } from "../src/request";

test("Python, N=3", async () => {
    async function run(language: string, numOfVersions: number): Promise<string> {

        if (!language || numOfVersions <= 0) {
            throw new Error("Invalid input parameters");
        }

        try {
            const returnedJSON: string = await sendRequest(language);

            if (!isJSONok(returnedJSON)) {
                throw new Error("Returned JSON has incorrect/new structure.");
            }

            return getNlatestVersions(returnedJSON, numOfVersions);
        } catch (error) {
            console.error(`Error in run function: ${error}`);
            throw error;
        }
    }

    const versions = await run("python", 3);
    // as fetched Python versions can be x.x.x or x.xx.x
    expect(versions.length).toBeGreaterThan(15);
});
