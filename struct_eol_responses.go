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
	MajorMinorVersion string                `json:"name"`
	IsLts             bool                  `json:"isLts"`
	IsEol             bool                  `json:"isEol"`
	EolFrom           string                `json:"eolFrom"`
	EoasFrom          string                `json:"eoasFrom"`
	Latest            LanguageLatestRelease `json:"latest"`
}

type LanguageLatestRelease struct {
	MajorMinorPatchVersion string `json:"name"`
	Date                   string `json:"date"`
	Link                   string `json:"link"`
}

type LanguageLTS struct {
	Language    string
	LTSversions []string
}
