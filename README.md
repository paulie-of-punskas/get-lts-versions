[![CI](https://github.com/paulie-of-punskas/get-lts-versions/actions/workflows/ci.yaml/badge.svg)](https://github.com/paulie-of-punskas/get-lts-versions/actions/workflows/ci.yaml)
[![Test - get LTS versions](https://github.com/paulie-of-punskas/get-lts-versions/actions/workflows/test-action.yaml/badge.svg)](https://github.com/paulie-of-punskas/get-lts-versions/actions/workflows/test-action.yaml)
[![Test - integration and caching](https://github.com/paulie-of-punskas/get-lts-versions/actions/workflows/test-cache.yaml/badge.svg)](https://github.com/paulie-of-punskas/get-lts-versions/actions/workflows/test-cache.yaml)
[![CodeQL](https://github.com/paulie-of-punskas/get-lts-versions/actions/workflows/github-code-scanning/codeql/badge.svg)](https://github.com/paulie-of-punskas/get-lts-versions/actions/workflows/github-code-scanning/codeql)

# Info
Golang CLI & GitHub Action used for fetching Long Term Support versions for different computer software. 
Code sends a GET request to [endoflife.date API](https://endoflife.date/docs/api/v1/) and returns
an array with a long term support versions - see [Outputs](#outputs).
If larger number of LTS is requested, then function returns max supported number of versions.

# Requirements
Linux x64 based runner. By default, GitHub Actions provides [Ubuntu based runners](https://github.com/actions/runner-images/tree/main).

# Why should it be used?
It's easy to lose track with patches, security updates and development of software. 
This action helps you to assure yourself, that you use latest supported version in your CI/CD pipelines. 
As someone said: 
> Better safe than sorry.

## Features
- Powered by [endoflife.date](https://endoflife.date) — reliable LTS data for programming languages, Operating Systems
- Flexible language and Operating System naming — use common aliases (`go` or `golang`, `java-temurin` or `temurin`, `ubuntu` etc.)
- Seamless GitHub Actions integration — simple inputs and JSON output for workflow automation
- No external dependencies — action uses a compiled Golang binary, that is based on native packages.
- Caching - `get-lts-versions` caches results of endoflife.date and refreshes it weekly.

## Supported programming languages
| Language Name | Input Name | EndOfLife Name |
|---|---|---|
| Go | go, golang | go |
| Groovy | groovy, apache-groovy | apache-groovy |
| Java (OpenJDK) | java-openjdk, openjdk | openjdk |
| Python | python | python |
| Rust | rust | rust |
| Scala | scala | scala |
| ... | ... | ... |

See [full list of supported programming language names](./docs/readme_supported_programming_languages.md)

## Supported Operating Systems

| Language Name | Input Name | EndOfLife Name |
|---|---|---|
| AlmaLinux OS | almalinux, alma-linux, alma | almalinux |
| Apple macOS | macos, mac | macos |
| CentOS | centos | centos |
| Debian | debian | debian |
| Fedora Linux | fedora | fedora |
| Microsoft Windows Server Core | windows-server-core, windowsservercore | windows-server-core |
| NetApp ONTAP | netapp-ontap, ontap, ontap-os | netapp-ontap |
| NixOS | nixos, nixoslinux | nixos |
| Ubuntu | ubuntu, ubuntu-linux | ubuntu |
| ... | ... | ... |

See [full list of supported Operating System names](./docs/readme_supported_operating_systems.md)

## Quickstart
### Inputs
`category` - (required) `os` or `lang`  
`product_name` - (required) name of the programming language or Operating System (e.g. `golang` or `ubuntu`)  
`versions_to_fetch` - how many long term support versions to fetch. Must be a positive integer. If none is set,
max number of supported versions will be returned.  
`print_eol_information` - additional notice will be printed to user in Actions section, if given version is past or approaching EOL date.  
`return_major_minor_patch_version` - should SemVer up to a patch version (X.Y.Z) be returned. By default, X.Y will be returned,
as it's easier to parse for "actions/setup-<language>".

### Outputs
`lts_versions` - JSON array of LTS version strings - e.g. `["25", "24", "23"]`. Long Term Support version strings are returned in "MAJOR.MINOR.PATCH" semantic versioning. Use `fromJson()` to correctly parse strings in GHA workflow expressions: `["26","25"]`. E.g. GitHub Actions "setup-<language>" actions will automatically recognize the input.

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
        uses: paulie-of-punskas/get-lts-versions@35ea0cd71f17ecc12e3aaa147ed41a02a026004b # v1.1.1
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
