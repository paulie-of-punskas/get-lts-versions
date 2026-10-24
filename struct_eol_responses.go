package main

import (
	"fmt"
	"math"
	"time"
)

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

func (lr LanguageReleases) checkEOL(languageName, majorMinorVersion, inputEOLdate string) string {
	if inputEOLdate == "" {
		fmt.Printf("::notice::There is no information about End Of Life date for %s %s.\n", GetFullLanguageName(languageName), majorMinorVersion)
		return ""
	}

	eolDate, err := time.Parse("2006-01-02", inputEOLdate)
	if err != nil {
		fmt.Printf("Could not convert %s to Date", inputEOLdate)
		return ""
	}

	diffDays := math.Ceil(float64(eolDate.UnixMilli()-time.Now().UnixMilli()) / (1000 * 60 * 60 * 24))
	if diffDays < 0 {
		fmt.Printf("::warning::%s %s support has expired on %s. It no longer offers active or security support.", GetFullLanguageName(languageName), majorMinorVersion, eolDate.UTC().Format("2006-01-02"))
	} else if diffDays <= 180 {
		fmt.Printf("::notice::%s %s End Of Life is approaching. It still has %v day(s) of security support.", GetFullLanguageName(languageName), majorMinorVersion, diffDays)
	}
	return ""
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
