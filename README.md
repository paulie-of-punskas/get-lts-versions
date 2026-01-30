![CI - Node 20, 22, 24](https://github.com/paulie-of-punskas/ts-get_lts_versions/actions/workflows/ci.yaml/badge.svg)

# Info
JS/TS script & GitHub Action used for fetching Long Term Support versions. Can be used within GitHub Action, should work within GitLab as well, with slight modification.

## How it works - script
Script sends a GET request to https://endoflife.date API and returns an array with corresponding data.
If larger number of LTS is requested, then function returns max supported number of versions.

## How it works - action
Action runs a "dist/index.js", and returns an array of LTS strings - `lts_versions`.
It can be then reused in a different step/job.

Below is the example, for setting up Java LTS:

```YAML
name: CI

on:
  push:
    branches:
      - 'main'
  workflow_dispatch:

jobs:
  get-java-lts:
    name: Get LTS for JAVA
    runs-on: ubuntu-slim
    outputs:
      lts_version: ${{ steps.outputJavaVersion.outputs.lts_java_version }}

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Get LTS for java - v012
        uses: paulie-of-punskas/get-lts-versions@521947edbf993d2701ed4974b1a01aa58a95b64b #v0.1.2
        id: getJavaVersion
        with:
          language: "eclipse-temurin"
          versions_to_fetch: "3"

      - name: Print returned values
        id: outputJavaVersion
        shell: bash
        run: |
          echo "lts_java_version=${{ toJSON(steps.getJavaVersion.outputs.lts_versions) }}" >> $GITHUB_OUTPUT

  setup-lts-environment:
    name: Setup environment
    runs-on: ubuntu-22.04
    needs: get-java-lts
    strategy:
      matrix:
        lts_java_version: ${{ fromJson(needs.get-java-lts.outputs.lts_version) }}

    steps:
      - name: Set up latest JDK for x64
        uses: actions/setup-java@v4
        with:
          java-version: ${{ matrix.lts_java_version }}
          distribution: "temurin"
          architecture: x64
```


## Script related

### Run tests
`npm test` or `jest --collectCoverage`. `Jest` needs to be globally installed.

### Build
`npm run build`

### To do:
- [ ] unify language names
- [ ] compare eolFrom with current date
