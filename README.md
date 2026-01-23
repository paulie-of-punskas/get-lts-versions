# js-get_lts_versions

JS/TS used for fetching Long Term Support versions. Can be used within GitLab or GitHub Actions runners.

### Klausimai
- ar kurt objekta, kiekviena karta dirbant su JSON?
- imt end of active support ("eoasFrom") ar end of security support ("eolFrom")?
  - by default, imt "eolFrom"
- kaip patikrint strict type checking?

### Testu paleidimas
`npm test` arba `jest --collectCoverage`. `Jest` turi but globaliai uzinstaliuotas