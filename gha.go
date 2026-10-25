package main

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
)

func GetCacheFileFullPath(languageName string, versionsToFetch int) string {
	var rootDir string
	if os.Getenv("GITHUB_WORKSPACE") != "" {
		rootDir = os.Getenv("GITHUB_WORKSPACE")
	} else {
		rootDir = "."
	}
	cacheDir := filepath.Join(rootDir, ".cache")
	parsedLanguage := UnifyName(languageName)

	return filepath.Join(cacheDir, parsedLanguage+"-"+fmt.Sprintf("%v", versionsToFetch)+".json")
}

func WriteJSONArrayToGitHubOutput(ghaVariableName string, ghaVariableValue any) error {
	ghaOutputFile := os.Getenv("GITHUB_OUTPUT")
	if ghaOutputFile == "" {
		return fmt.Errorf("Function is not run within GitHub Actions environment")
	}

	data, err := json.Marshal(ghaVariableValue)
	if err != nil {
		return fmt.Errorf("Could convert ghaVariableValue to JSON")
	}

	ghaFile, err := os.OpenFile(ghaOutputFile, os.O_APPEND|os.O_WRONLY, 0)
	if err != nil {
		return fmt.Errorf("Could not open directory of GITHUB_OUTPUT - %s", os.Getenv("GITHUB_OUTPUT"))
	}
	defer ghaFile.Close()

	_, err = fmt.Fprintf(ghaFile, "%s=%s\n", ghaVariableName, data)
	if err != nil {
		return fmt.Errorf("Could not write GITHUB_OUTPUT: %w", err)
	}

	return nil
}
