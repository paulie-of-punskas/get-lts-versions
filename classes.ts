export class LanguageLTS {
    #language: string
    #ltsVersions: Array<number>;

    constructor(language: string, ltsVersions: Array<number>) {
        this.#language = language;
        this.#ltsVersions = ltsVersions;
    };

    public get language(): string {
        return this.#language;
    }

    public set language(value: string) {
        this.#language = value;
    }

    public get ltsVersions(): Array<number> {
        return this.#ltsVersions;
    };

    public set ltsVersions(value: Array<number>) {
        this.#ltsVersions = value;
    };

    validateJSONinput(jsonObject: JSON): void {
    /**
     * @param {JSON} jsonObject - JSON returned from sendRequest().
     *
    */

    };
};
