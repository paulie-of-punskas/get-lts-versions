package main

import (
	"encoding/json"
	"testing"
)

func TestStructLanguage(t *testing.T) {
	TestData := []byte(`{
			"lang": [
				{
					"fullName": "Visual COBOL",
					"inputNames": ["cobol", "visual-cobol"],
					"eolName": "visual-cobol"
				}
			],
			"aliases": {
				"cobol": "visual-cobol",
				"visual-cobol": "visual-cobol"
			}
		}`)
	var language ProductNames

	err := json.Unmarshal(TestData, &language)

	if err != nil {
		t.Errorf("Could not decode JSON to ProductNames structure")
	}

	t.Run("Check if TestData languages contains LanguageFullName property", func(t *testing.T) {
		got := language.Languages[0].FullName
		want := "Visual COBOL"
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
