package main

import (
	"os"
	"strings"
	"testing"
)

func TestGetCacheFileFullPath(t *testing.T) {
	t.Run("Should return string that does not container 'runner', if run locally", func(t *testing.T) {
		got := GetCacheFileFullPath("golang", 5)
		if os.Getenv("GITHUB_WORKSPACE") != "" && strings.Contains(got, "runner") {
			t.Errorf("Test run locally should not have 'runner' string")
		}

		if !strings.Contains(got, "go-5.json") {
			t.Errorf("Expected returned string to contain 'go-5.json', got %s", got)
		}
	})
}

func TestWriteJSONArrayToGitHubOutput(t *testing.T) {
	t.Run("Should return string that does not container 'runner', if run locally", func(t *testing.T) {
		// want := "Function is not run within GitHub Actions environment."
		err := WriteJSONArrayToGitHubOutput("xx", "xx")
		if os.Getenv("GITHUB_WORKSPACE") == "" && err == nil {
			t.Errorf("Unexpected return. Got: %s", err)
		}
	})
}
