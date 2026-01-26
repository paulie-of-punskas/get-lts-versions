![CI - Node 20, 22, 24](https://github.com/paulie-of-punskas/ts-get_lts_versions/actions/workflows/ci.yaml/badge.svg)

# Info
JS/TS script & GitHub Action used for fetching Long Term Support versions. Can be used within GitHub Action, should work within GitLab as well, with slight modification.

## How it works - script
Script sends a GET request to https://endoflife.date API and returns an array with corresponding data.
If larger number of LTS is requested, then function returns max supported number of versions.

## How it works - action
Action runs a "dist/index.js", that returns an array of LTS strings.

### Test run
`npm test` or `jest --collectCoverage`. `Jest` needs to be globally installed.

### Build
`npm run build`

### To do:
- [ ] unify language names
- [ ] compare eolFrom with current date
