class LanguageLTS {
    #language: string;
    #ltsVersions: Array<number>;

    constructor(language: string, ltsVersions: Array<number>) {
        this.#language = language;
        this.#ltsVersions = ltsVersions;
    };

    get language(): string {
        return this.#language;
    }

    set language(value: string) {
        this.#language = value;
    }

    get ltsVersions(): Array<number> {
        return this.#ltsVersions;
    };

    set ltsVersions(value: Array<number>) {
        this.#ltsVersions = value;
    };

    validateJSONinput(jsonObject: JSON): void {
    /**
     * @param {JSON} jsonObject - JSON returned from sendRequest().
     *
    */

    }
};


async function sendRequest(language: string): Promise<{}> {
    /**
     * @param {string} language - name of the language.
     * @returns {JSON} JSON object.
     */

    const url = "https://endoflife.date/api/v1/products/`${language.toLowerCase()`";
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
            console.error(`${language} was not found on https://endoflife.date.`);
            return {};
        };
        const result = await response.json();
        return result;
    } catch(error) {
        if (error instanceof Error) {
            console.error(`Caught an error: ${error.message}`);
        }
        return {};
    };
};

function getNlatestVersions(numOfVersions: number): Array<number> {
    /**
     * @param {number} numOfVersions - how many LTS versions to retrieve. If it exceeds supported versions,
     * then return max supported number of versions.
     */
    let ltsVersions: Array<number> = [];
    return ltsVersions;
};

function run(language: string) {
    const languageLTS = new LanguageLTS(language, new Array<number>);
    let returnedJSON = sendRequest("python");
    // languageLTS.validateJSONinput(returnedJSON);
};

