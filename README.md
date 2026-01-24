[![CI - Node 20.x, 22.x, 24.x](https://github.com/paulie-of-punskas/ts-get_lts_versions/actions/workflows/ci.yaml/badge.svg)](https://github.com/paulie-of-punskas/ts-get_lts_versions/actions/workflows/ci.yaml)

![CI - Node 20.x, 22.x, 24.x](https://github.com/paulie-of-punskas/ts-get_lts_versions/actions/workflows/ci.yaml/badge.svg)

# js-get_lts_versions

JS/TS used for fetching Long Term Support versions. Can be used within GitLab or GitHub Actions runners.

### Klausimai
- ar kurt objekta, kiekviena karta dirbant su JSON?
- imt end of active support ("eoasFrom") ar end of security support ("eolFrom")?
  - by default, imt "eolFrom"
- kaip patikrint strict type checking?
  - https://betterstack.com/community/guides/scaling-nodejs/typescript-json-type-safety/#implementing-runtime-type-guards
  - https://bguppl.github.io/interpreters/practice_sessions/ps1.html
- ar tikrint datas su siandiena?

### Testu paleidimas
`npm test` arba `jest --collectCoverage`. `Jest` turi but globaliai uzinstaliuotas
