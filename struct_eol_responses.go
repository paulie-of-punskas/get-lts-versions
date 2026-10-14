package main

type EOLresponse struct {
	SchemaVersion string            `json:"schema_version"`
	GeneratedAt   string            `json:"generated_at"`
	LastModified  string            `json:"last_modified"`
	Result        EOLresponseResult `json:"result"`
}

type EOLresponseResult struct {
	Name     string             `json:"name"`
	Releases []LanguageReleases `json:"releases"`
}

type LanguageReleases struct {
	MajorMinorVersion      string                `json:""`
	MajorMinorPatchVersion string                `json:""`
	IsLts                  bool                  `json:""`
	IsEol                  bool                  `json:""`
	EolFrom                string                `json:""`
	EoasFrom               string                `json:""`
	Latest                 LanguageLatestRelease `json:""`
}

type LanguageLatestRelease struct {
	MajorMinorPatchVersion string // result.releases[n].latest.name
	Date                   string
	Link                   string
}

type LanguageLTS struct {
	Language    string
	LTSversions []string
}
