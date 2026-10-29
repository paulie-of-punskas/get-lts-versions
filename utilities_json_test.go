package main

import (
	"bytes"
	"io"
	"os"
	"path/filepath"
	"strings"
	"testing"
	"time"
)

func captureStdout(f func()) string {
	old := os.Stdout
	r, w, _ := os.Pipe()
	os.Stdout = w

	f() // run the function that writes to stdout

	_ = w.Close()
	var buf bytes.Buffer
	_, _ = io.Copy(&buf, r)
	os.Stdout = old

	return buf.String()
}

func TestCheckEOL(t *testing.T) {
	t.Run("Should return '', if inputEOLdate is empty", func(t *testing.T) {
		got := CheckEOL("golang", "", "")
		want := ""
		if got != want {
			t.Errorf("Expected empty string to be returned, got: %s", got)
		}
	})

	t.Run("Should panic with a message, if inputEOLdate is is incorrect", func(t *testing.T) {
		defer func() {
			r := recover()
			if r == nil {
				t.Errorf("Expected panic, but none occurred")
			} else if r != "Could not convert 2000-12-32 to Date" {
				t.Errorf("Unexpected panic message: %v", r)
			}
		}()

		CheckEOL("golang", "", "2000-12-32")
	})

	t.Run("Should print warning message", func(t *testing.T) {
		got := captureStdout(func() {
			CheckEOL("golang", "", "2000-12-31")
		})

		if !strings.Contains(got, "::warning::") {
			t.Errorf("Expected a string that contains ::warning:: to be printed, got - %s", got)
		}
	})

	t.Run("Should print notice message", func(t *testing.T) {
		got := captureStdout(func() {
			dateHalfYearHead := time.Now().AddDate(0, 0, 180)
			CheckEOL("golang", "", dateHalfYearHead.Format("2006-01-02"))
		})

		if !strings.Contains(got, "::notice::") {
			t.Errorf("Expected a string that contains ::notice:: to be printed, got - %s", got)
		}
	})
}

func TestGetNltsVersionsAndCheckEOLdates(t *testing.T) {
	t.Run("Expect false if empty string is provided", func(t *testing.T) {
		_, err := GetNltsVersionsAndCheckEOLdates("", 3, false, false)
		if err == nil {
			t.Errorf("Empty input should have resulted in error")
		}
	})

	t.Run("Expect a string array of MajorMinor versions returned", func(t *testing.T) {
		fileContent, err := os.ReadFile(filepath.Join("./test_data/eol_return_golang.json"))
		if err != nil {
			panic("Could not find \"./test_data/eol_return_golang.json\"")
		}

		want := [3]string{"1.27", "1.26"}
		got, _ := GetNltsVersionsAndCheckEOLdates(string(fileContent), 3, false, false)

		if want[0] != got[0] || want[1] != got[1] {
			t.Errorf("Wanted: %v, got: %v", want, got)
		}
	})

	t.Run("Expect a string array of MajorMinorPatch versions returned", func(t *testing.T) {
		fileContent, err := os.ReadFile(filepath.Join("./test_data/eol_return_golang.json"))
		if err != nil {
			panic("Could not find \"./test_data/eol_return_golang.json\"")
		}

		want := [3]string{"1.27.2", "1.26.9"}
		got, _ := GetNltsVersionsAndCheckEOLdates(string(fileContent), 3, false, true)

		if want[0] != got[0] || want[1] != got[1] {
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
