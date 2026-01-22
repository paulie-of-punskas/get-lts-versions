// Will be used as array of LanguageReleases
export class LanguageReleases {
    name: string
    codename: string
    label: string
    releaseDate: string
    isLts: boolean
    ltsFrom: string
    isEol: boolean
    eolFrom: string
    isMaintained: boolean
    latest: LanguageLatestRelease
    custom: string

    constructor(name: string, codename: string, label: string, releaseDate: string, isLts: boolean,
        ltsFrom: string, isEol: boolean, eolFrom: string, isMaintained: boolean, latest: LanguageLatestRelease,
        custom: string) {
        this.name = name
        this.codename = codename
        this.label = label
        this.releaseDate = releaseDate
        this.isLts = isLts
        this.ltsFrom = ltsFrom
        this.isEol = isEol
        this.eolFrom = eolFrom
        this.isMaintained = isMaintained
        this.latest = latest
        this.custom = custom
    }
};


export class LanguageLatestRelease {
    name: string
    date: string
    link: string

    constructor(name: string, date: string, link: string) {
        this.name = name;
        this.date = date;
        this.link = link;
    }

    // public get name(): string {
    //     return this.name;
    // }

    // public set name(value: string) {
    //     this.name = value;
    // }
};

export class LanguageLTS {
    #language: string
    #ltsVersions: Array<number>

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
