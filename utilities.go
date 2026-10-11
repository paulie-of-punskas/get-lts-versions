package main

import (
	"encoding/json"
	"os"
	"path/filepath"
	"slices"
	"strings"
)

func ReadLanguageNames() LanguageNames {
	var languages LanguageNames
	fileContent, err := os.ReadFile(filepath.Join("./assets/language_names.json"))

	if err != nil {
		panic("Could not find \"./assets/language_names.json\"")
	}

	json.Unmarshal(fileContent, &languages)

	return languages
}

// Convert language name to follow endoflife API convention, e.g. openjdk
func UnifyName(language string) string {
	languages := ReadLanguageNames()
	languageAliases := languages.Aliases
	normalizedLanguage := strings.ToLower(strings.TrimSpace(language))

	if languageAliases[normalizedLanguage] != "" {
		return languageAliases[normalizedLanguage]
	}

	builder := strings.Builder{}
	builder.WriteString("Could not find alias for '")
	builder.WriteString(language)
	builder.WriteString("'")
	panic(builder.String())
}

// Get full language name from language_names.json > languages[]
func GetFullLanguageName(language string) string {
	languagesList := ReadLanguageNames()
	normalizedLanguage := strings.ToLower(strings.TrimSpace(language))

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
