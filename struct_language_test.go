package main

import (
	"encoding/json"
	"testing"
)

func TestStructLanguage(t *testing.T) {
	TestData := []byte(`{
			"languages": [
				{
					"languageFullName": "COBOL",
					"inputNames": ["cobol", "visual-cobol"],
					"eolName": "visual-cobol"
				}
			],
			"aliases": {
				"cobol": "visual-cobol",
				"visual-cobol": "visual-cobol"
			}
		}`)
	var language LanguageNames

	err := json.Unmarshal(TestData, &language)

	if err != nil {
		t.Errorf("Could not decode JSON to LanguageNames structure")
	}

	t.Run("Check if TestData languages contains LanguageFullName property", func(t *testing.T) {
		got := language.Languages[0].LanguageFullName
		want := "COBOL"
		if got != want {
			t.Errorf("got: %q, want: %q", got, want)
		}
	})

	t.Run("Check if TestData contains LanguageAliases.Aliases property - map[string]string", func(t *testing.T) {
		want := "visual-cobol"
		got := language.Aliases["cobol"]
		if got != want {
			t.Errorf("got %q, want %q", got, want)
		}
	})
}
