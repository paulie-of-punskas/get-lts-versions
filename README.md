[![CI](https://github.com/paulie-of-punskas/get-lts-versions/actions/workflows/ci.yaml/badge.svg)](https://github.com/paulie-of-punskas/get-lts-versions/actions/workflows/ci.yaml)
[![Test - get LTS versions](https://github.com/paulie-of-punskas/get-lts-versions/actions/workflows/test-action.yaml/badge.svg)](https://github.com/paulie-of-punskas/get-lts-versions/actions/workflows/test-action.yaml)
[![Test - integration and caching](https://github.com/paulie-of-punskas/get-lts-versions/actions/workflows/test-cache.yaml/badge.svg)](https://github.com/paulie-of-punskas/get-lts-versions/actions/workflows/test-cache.yaml)
[![CodeQL](https://github.com/paulie-of-punskas/get-lts-versions/actions/workflows/github-code-scanning/codeql/badge.svg)](https://github.com/paulie-of-punskas/get-lts-versions/actions/workflows/github-code-scanning/codeql)

# Info
Golang CLI & GitHub Action used for fetching Long Term Support versions. 
Code sends a GET request to [endoflife.date API](https://endoflife.date/docs/api/v1/) and returns
an array with a long term support versions - see [Outputs](#outputs).
If larger number of LTS is requested, then function returns max supported number of versions.

# Requirements
Linux x64 based runner. By default, GitHub Actions provides [Ubuntu based runners](https://github.com/actions/runner-images/tree/main).

## Features
- Powered by [endoflife.date](https://endoflife.date) — reliable LTS data of over 20 programming languages
- Flexible language naming — use common aliases (`go` or `golang`, `java-temurin` or `temurin`, etc.)
- Seamless GitHub Actions integration — simple inputs and JSON output for workflow automation
- No external dependencies — action uses a compiled Golang binary, that is based on native packages.
- Caching - `get-lts-versions` caches results of endoflife.date and refreshes it weekly.

## Supported programming languages
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
| Java (Azul Zulu) | java-zulu, zulu, azul-zulu | azul-zulu |
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
`language` - any name from [supported languages list](#supported-programming-languages)  
`versions_to_fetch` - how many long term support versions to fetch. Must be a positive integer. If none is set,
max number of supported versions will be returned.  
`print_eol_information` - additional notice will be printed to user in Actions section, if given version is past or approaching EOL date.  
`return_major_minor_patch_version` - should SemVer up to a patch version (X.Y.Z) be returned. By default, X.Y will be returned,
as it's easier to parse for "actions/setup-<language>".

### Outputs
`lts_versions` - JSON array of LTS version strings - e.g. `["25", "24", "23"]`. Long Term Support version strings are returned in "MAJOR.MINOR.PATCH" semantic versioning. Use `fromJson()` to correctly parse strings in GHA workflow expressions: `["26","25"]`. GitHub Actions "setup-<language>" actions will automatically recognize the input.

### Examples
```YAML
name: CI - build

on:
  push:

jobs:
  get-lts-version:
    name: Get LTS for Golang
    runs-on: ubuntu-slim
    outputs:
      lts_versions_fetched: ${{ steps.getLTSversion.outputs.lts_versions }}

    steps:
      - name: Checkout code
        uses: actions/checkout@9c091bb21b7c1c1d1991bb908d89e4e9dddfe3e0 # v7.0.0

      - name: Get LTS for Golang
        uses: paulie-of-punskas/get-lts-versions@1a0bf246bd3c838645ac2cacf1da12177563f616 # v1.0.5
        id: getLTSversion
        with:
          language: 'golang'

  setup-environment-run-build:
    name: Build | Go ${{ matrix.lts_version }}
    runs-on: ubuntu-22.04
    needs: get-lts-version
    strategy:
      matrix:
        lts_version: ${{ fromJson(needs.get-lts-version.outputs.lts_versions_fetched) }}
    steps:
      - name: Checkout code
        uses: actions/checkout@9c091bb21b7c1c1d1991bb908d89e4e9dddfe3e0 # v7.0.0

      - name: Set up environment ${{ matrix.lts_version }}
        uses: actions/setup-go@b7ad1dad31e06c5925ef5d2fc7ad053ef454303e # v7.0.0
        with:
          go-version: ${{ matrix.lts_version }}
          architecture: 'x64'

      - name: Build
        shell: bash
        run: go build .
```

## Support / Contributions
Please open an issue within the repository.
