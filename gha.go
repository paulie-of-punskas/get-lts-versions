package main

import (
	"encoding/json"
	"fmt"
	"os"
)

func WriteJSONArrayToGitHubOutput(name string, value any) error {
	ghaOutputFile := os.Getenv("GITHUB_OUTPUT")
	if ghaOutputFile == "" {
		return fmt.Errorf("Function is not run within GitHub Actions environment.")
	}

	data, err := json.Marshal(value)
	if err != nil {
		return fmt.Errorf("Could not parse output as JSON: %w", err)
	}

	ghaFile, err := os.OpenFile(ghaOutputFile, os.O_APPEND|os.O_WRONLY, 0)
	if err != nil {
		return fmt.Errorf("Could not open GITHUB_OUTPUT: %w", err)
	}
	defer ghaFile.Close()

	if _, err := fmt.Fprintf(ghaFile, "%s=%s\n", name, data); err != nil {
		return fmt.Errorf("Could not write GITHUB_OUTPUT: %w", err)
	}

	return nil
}
