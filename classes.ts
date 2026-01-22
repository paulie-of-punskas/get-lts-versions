export class LanguageLTS {
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

    };
};
