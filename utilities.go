package main

import (
	"encoding/json"
	"os"
	"path/filepath"
	"slices"
	"strings"
)

// Get full language name from language_names.json > languages[]
func GetFullLanguageName(language string) string {
	var languages LanguageNames
	fileContent, err := os.ReadFile(filepath.Join("./assets/language_names.json"))

	if err != nil {
		panic("Could not find \"./assets/language_names.json\"")
	}

	json.Unmarshal(fileContent, &languages)
	normalizedLanguage := strings.ToLower(strings.TrimSpace(language))

	for j := 0; j < len(languages.Languages); j++ {
		if slices.Contains(languages.Languages[j].InputNames, normalizedLanguage) {
			return languages.Languages[j].LanguageFullName
		}
	}

	builder := strings.Builder{}
	builder.WriteString("Could not find full name for '")
	builder.WriteString(language)
	builder.WriteString("'")
	panic(builder.String())
}
