package main

import (
	_ "embed"
	"encoding/json"
	"fmt"
	"slices"
	"strings"
)

//go:embed assets/language_names.json
var languageNamesJSON []byte

func SanitizeString(strintToSanitize string) string {
	return strings.ToLower(strings.TrimSpace(strintToSanitize))
}

func ReadLanguageNames() LanguageNames {
	var languages LanguageNames

	err := json.Unmarshal(languageNamesJSON, &languages)
	if err != nil {
		panic(fmt.Sprintf("Could not parse embedded language_names.json %s", err))
	}

	return languages
}

// Convert language name to follow endoflife API convention, e.g. openjdk
func UnifyName(language string) string {
	languages := ReadLanguageNames()
	languageAliases := languages.Aliases
	normalizedLanguage := SanitizeString(language)

	if languageAliases[normalizedLanguage] != "" {
		return languageAliases[normalizedLanguage]
	}

	panic(fmt.Sprintf("Could not find alias for '%s'", language))
}

// Get full language name from language_names.json > languages[]
func GetFullLanguageName(language string) string {
	languagesList := ReadLanguageNames()
	normalizedLanguage := SanitizeString(language)

	for j := 0; j < len(languagesList.Languages); j++ {
		if slices.Contains(languagesList.Languages[j].InputNames, normalizedLanguage) {
			return languagesList.Languages[j].LanguageFullName
		}
	}

	builder := strings.Builder{}
	builder.WriteString("Could not find full name for '")
	builder.WriteString(language)
	builder.WriteString("'")
	panic(builder.String())
}
