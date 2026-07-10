const LANGUAGE_ALIASES: Record<string, string> = {
    // COBOL
    "cobol": "visual-cobol",
    "visual-cobol": "visual-cobol",

    // Go / Golang
    "go": "go",
    "golang": "go",

    // Groovy
    "groovy": "apache-groovy",
    "apache-groovy": "apache-groovy",

    // Haskell
    "ghc": "ghc",
    "haskell": "ghc",
    "glasgow-haskell-compiler": "ghc",

    // Java
    "java-dragonwell": "alibaba-dragonwell",
    "dragonwell": "alibaba-dragonwell",
    "alibaba-dragonwell": "alibaba-dragonwell",

    "java-corretto": "amazon-corretto",
    "corretto": "amazon-corretto",
    "amazon-corretto": "amazon-corretto",

    "java-liberica": "bellsoft-liberica",
    "liberica": "bellsoft-liberica",
    "bellsoft-liberica": "bellsoft-liberica",

    "java-temurin": "eclipse-temurin",
    "temurin": "eclipse-temurin",
    "eclipse-temurin": "eclipse-temurin",

    "java-graalvm": "graalvm-ce",
    "graalvm": "graalvm-ce",
    "graalvm-ce": "graalvm-ce",

    "java-semeru": "ibm-semeru-runtime",
    "semeru": "ibm-semeru-runtime",
    "ibm-semeru-runtime": "ibm-semeru-runtime",

    "java-mandrel": "mandrel",
    "mandrel": "mandrel",

    "java-microsoft": "microsoft-build-of-openjdk",
    "microsoft-build-of-openjdk": "microsoft-build-of-openjdk",

    "java-openjdk": "openjdk",
    "openjdk": "openjdk",

    "java-oracle-graalvm": "oracle-graalvm",
    "oracle-graalvm": "oracle-graalvm",

    "java-oracle-jdk": "oracle-jdk",
    "oracle-jdk": "oracle-jdk",

    "java-redhat": "redhat-build-of-openjdk",
    "redhat-build-of-openjdk": "redhat-build-of-openjdk",

    "java-sapmachine": "sapmachine",
    "sapmachine": "sapmachine",

    "java-zulu": "azul-zulu",
    "zulu": "azul-zulu",
    "azul-zulu": "azul-zulu",

    // Powershell
    "powershell": "powershell",
    "pwsh": "powershell",
    "windows-powershell": "windows-powershell",

    // The rest of the languages
    "elixir": "elixir",
    "erlang": "erlang",
    "gleam": "gleam",
    "idl": "idl",
    "jruby": "jruby",
    "julia": "julia",
    "kotlin": "kotlin",
    "lua": "lua",
    "perl": "perl",
    "php": "php",
    "python": "python",
    "ruby": "ruby",
    "rust": "rust",
    "scala": "scala",
};

export function unifyName(language: string): string {
    /**
     * @param {string} language - name of the language.
     * @returns {string} language according to endoflife API documentation
    */

    const parsedLanguage = LANGUAGE_ALIASES[language.toLowerCase()];
    if (!parsedLanguage) {
        throw new Error(`Unexpected language name: ${language}`);
    }
    return parsedLanguage;
}