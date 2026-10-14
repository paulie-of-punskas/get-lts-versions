package main

import (
	"encoding/json"
	"os"
	"path/filepath"
	"testing"
)

func TestGetNltsVersionsAndCheckEOLdates(t *testing.T) {
	t.Run("Expect false if empty string is provided", func(t *testing.T) {
		_, err := GetNltsVersionsAndCheckEOLdates("", 3, false)
		if err == nil {
			t.Errorf("Empty input should have resulted in error")
		}
	})

	t.Run("Expect a non empty array string returned for 3 versions", func(t *testing.T) {
		fileContent, err := os.ReadFile(filepath.Join("./test_data/eol_return_golang.json"))
		if err != nil {
			panic("Could not find \"./test_data/eol_return_golang.json\"")
		}

		want := [3]string{"1.27", "1.26"}
		got := [3]string{}

		functionResult, _ := GetNltsVersionsAndCheckEOLdates(string(fileContent), 3, false)

		json.Unmarshal(functionResult, &got)
		if want != got {
			t.Errorf("Wanted: %v, got: %v", want, got)
		}
	})

}

func TestIsRequestReturnedContentOK(t *testing.T) {
	t.Run("Expect false if empty string is provided", func(t *testing.T) {
		want := false
		got := IsRequestReturnedContentOK("")
		if want != got {
			t.Errorf("Wanted: %v, got: %v", want, got)
		}
	})

	t.Run("Expect true if test_data/eol_return_golang.json is provided", func(t *testing.T) {
		fileContent, err := os.ReadFile(filepath.Join("./test_data/eol_return_golang.json"))
		if err != nil {
			panic("Could not find \"./test_data/eol_return_golang.json\"")
		}

		want := true
		got := IsRequestReturnedContentOK(string(fileContent))
		if want != got {
			t.Errorf("Wanted: %v, got: %v", want, got)
		}
	})

	t.Run("Expect false if Result.Name or Result.Releases is empty", func(t *testing.T) {
		TestData := []byte(`{ "schema_version": "1.2.1",
					"generated_at": "2026-10-13T13:33:44+00:00",
					"last_modified": "2026-10-09T00:08:39+00:00",
					"result": {
						"name": "go",
						"aliases": [
							"golang"
						],
						"label": "Go",
						"category": "lang",
						"releases": [
							{
								"name": "1.27",
								"codename": null,
								"label": "1.27",
								"releaseDate": "2026-08-19",
								"isLts": false,
								"ltsFrom": null,
								"isEol": false,
								"eolFrom": null,
								"isMaintained": true,
								"latest": {
									"name": "1.27.2",
									"date": "2026-10-08",
									"link": "https://go.dev/doc/go1.27"
								},
								"custom": null
							}
						]
					}}`)

		want := true
		got := IsRequestReturnedContentOK(string(TestData))
		if want != got {
			t.Errorf("Wanted: %v, got: %v", want, got)
		}
	})

	t.Run("Expect false if Result.Name or Result.Releases is empty", func(t *testing.T) {
		TestData := []byte(`{ "schema_version": "1.2.1",
					"generated_at": "2026-10-13T13:33:44+00:00",
					"last_modified": "2026-10-09T00:08:39+00:00",
					"result": {
						"name": "go",
						"aliases": [
							"golang"
						],
						"label": "Go",
						"category": "lang",
						"releases": [
						]
					}}`)

		want := false
		got := IsRequestReturnedContentOK(string(TestData))
		if want != got {
			t.Errorf("Wanted: %v, got: %v", want, got)
		}
	})
}
