class LanguageLTS {
    #language: string;

    constructor(language: string) {
        this.#language = language;
    };

    get language(): string {
        return this.#language;
    }

    set language(value: string) {
        this.#language = value;
    }
};

async function validateResult(jsonObject: JSON) {
    /**
     *
     *
    */
}

async function sendRequest(language: string) {
    /**
     * @param {string} laguage - name of the language.
     * @returns {JSON} JSON object.
     */
    const url = "https://endoflife.date/api/v1/products/" + language.toLowerCase();
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        };
        const result = await response.json();
        return result;
    } catch(error) {
        if (error instanceof Error) {
            console.error(`Caught an error: ${error.message}`);
        }
    };
};

function parseRequest() {};

function getNlatestVersions(numOfVersions: number): Array<number> {
    let ltsVersions: Array<number> = [];
    return ltsVersions;
};

function run(language: string) {
    const languageLTS = new LanguageLTS(language);
};

