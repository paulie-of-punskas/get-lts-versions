package main

import (
	"os"
	"strings"
	"testing"
)

func TestGetCacheFileFullPath(t *testing.T) {
	t.Run("Should return string that does not container 'runner', if run locally", func(t *testing.T) {
		got := GetCacheFileFullPath("golang", 5)
		if os.Getenv("GITHUB_WORKSPACE") == "" && strings.Contains(got, "runner") {
			t.Errorf("Test run locally should not have 'runner' string")
		}

		if !strings.Contains(got, "go-5.json") {
			t.Errorf("Expected returned string to contain 'go-5.json', got %s", got)
		}
	})
}

func TestWriteJSONArrayToGitHubOutput(t *testing.T) {
	t.Run("Should return string that does not contain 'runner', if run locally", func(t *testing.T) {
		got := WriteJSONArrayToGitHubOutput("xx", "xx")
		want := "Function is not run within GitHub Actions environment"
		if os.Getenv("GITHUB_WORKSPACE") == "" && got.Error() != want {
			t.Errorf("Unexpected return - got: %s", got)
		}
	})

	t.Run("Should return error if 'GITHUB_OUTPUT' env variable exists, but ghaVariableValue is not a JSON file", func(t *testing.T) {
		t.Setenv("GITHUB_OUTPUT", "/labas/")
		got := WriteJSONArrayToGitHubOutput("xx", complex(1, 2))
		want := "Could convert ghaVariableValue to JSON"
		if got.Error() != want {
			t.Errorf("Unexpected return - got: %s", got)
		}
	})

	t.Run("Should return error if 'GITHUB_OUTPUT' env variable exists, but ghaVariableValue is not a JSON file", func(t *testing.T) {
		t.Setenv("GITHUB_OUTPUT", "/labas/")
		got := WriteJSONArrayToGitHubOutput("xx", "/labas/")
		want := "Could not open directory of GITHUB_OUTPUT - /labas/"
		if got.Error() != want {
			t.Errorf("Unexpected return - got: %s", got)
		}
	})
}
