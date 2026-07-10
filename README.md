![CI - Node 20, 22, 24](https://github.com/paulie-of-punskas/ts-get_lts_versions/actions/workflows/ci.yaml/badge.svg)

# Info
JS/TS script & GitHub Action used for fetching Long Term Support versions. 
Code sends a GET request to [endoflife.date API](https://endoflife.date/docs/api/v1/) and returns an array with corresponding data.
If larger number of LTS is requested, then function returns max supported number of versions.

## Features
- Powered by [endoflife.date](https://endoflife.date) — reliable LTS data of over 20 programming languages
- Flexible language naming — use common aliases (`go` or `golang`, `java-temurin` or `temurin`, etc.)
- Seamless GitHub Actions integration — simple inputs and JSON output for workflow automation
- Minimal dependencies — lightweight TypeScript/JavaScript implementation. Uses only [@actions/core](https://www.npmjs.com/package/@actions/core) and [@actions/github](https://www.npmjs.com/package/@actions/github) as external dependencies.

## Supported languages
| Language Name | Input Name | EndOfLife Name |
|---|---|---|
| COBOL | cobol, visual-cobol | visual-cobol |
| Elixir | elixir | elixir |
| Erlang | erlang | erlang |
| Gleam | gleam | gleam |
| Go | go, golang | go |
| Groovy | groovy, apache-groovy | apache-groovy |
| Haskell | ghc, haskell, glasgow-haskell-compiler | ghc |
| IDL | idl | idl |
| Java (Alibaba Dragonwell) | java-dragonwell, dragonwell, alibaba-dragonwell | alibaba-dragonwell |
| Java (Amazon Corretto) | java-corretto, corretto, amazon-corretto | amazon-corretto |
| Java (BellSoft Liberica) | java-liberica, liberica, bellsoft-liberica | bellsoft-liberica |
| Java (Eclipse Temurin) | java-temurin, temurin, eclipse-temurin | eclipse-temurin |
| Java (GraalVM CE) | java-graalvm, graalvm, graalvm-ce | graalvm-ce |
| Java (IBM Semeru) | java-semeru, semeru, ibm-semeru-runtime | ibm-semeru-runtime |
| Java (Mandrel) | java-mandrel, mandrel | mandrel |
| Java (Microsoft) | java-microsoft, microsoft-build-of-openjdk | microsoft-build-of-openjdk |
| Java (OpenJDK) | java-openjdk, openjdk | openjdk |
| Java (Oracle GraalVM) | java-oracle-graalvm, oracle-graalvm | oracle-graalvm |
| Java (Oracle JDK) | java-oracle-jdk, oracle-jdk | oracle-jdk |
| Java (Red Hat) | java-redhat, redhat-build-of-openjdk | redhat-build-of-openjdk |
| Java (SapMachine) | java-sapmachine, sapmachine | sapmachine |
| Java (Azul Zulu) | java-zulu, zulu, azul-zulu | azul-zulu |
| JRuby | jruby | jruby |
| Julia | julia | julia |
| Kotlin | kotlin | kotlin |
| Lua | lua | lua |
| Perl | perl | perl |
| PHP | php | php |
| PowerShell | powershell, pwsh, windows-powershell | powershell |
| Python | python | python |
| Ruby | ruby | ruby |
| Rust | rust | rust |
| Scala | scala | scala |

## Quickstart
### Inputs
`language` - any name from [supported languages list](#supported-languages)  
`versions_to_fetch` - how many long term support versions to fetch. Must be a positive integer. If none is set,
max number of supported versions will be returned.

### Outputs
`lts_versions` - JSON array of LTS version strings. Use `fromJson()` to correctly parse strings in GHA workflow expressions: `["26.0.1+8","25.0.3+9"]`

### Examples
```YAML
name: CI | Java

on:
  push:

jobs:
  get-java-lts:
    name: Get LTS for Java
    runs-on: ubuntu-slim
    outputs:
      lts_versions_fetched: ${{ steps.getJavaVersion.outputs.lts_versions }}

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Get LTS for Java Temurin JDK
        uses: paulie-of-punskas/get-lts-versions@34593d87e1f16c571a894d1e47f25229ce55b9e9 #v0.1.5
        id: getJavaVersion
        with:
          language: "eclipse-temurin"
          versions_to_fetch: "3"

  setup-lts-environment:  
    name: Setup environment
    runs-on: ubuntu-22.04
    needs: get-java-lts        
    strategy:
      matrix:
        lts_java_version: ${{ fromJson(needs.get-java-lts.outputs.lts_versions_fetched) }}
    steps:
      - name: Set up latest JDK for x64
        uses: actions/setup-java@v4
        with:
          java-version: ${{ matrix.lts_java_version }}
          distribution: "temurin"
          architecture: x64
```

## Support / Contributions
Please open an issue within the repository.
