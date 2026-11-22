package main

import (
	"encoding/json"
	"fmt"
	"os"
)

type EOLresult struct {
	SchemaVersion string             `json:"schema_version"`
	GeneratedAt   string             `json:"generated_at"`
	Total         int                `json:"total"`
	Result        []EOLresultElement `json:"result"`
}

type EOLresultElement struct {
	Name     string   `json:"name"`
	Aliases  []string `json:"aliases"`
	Label    string   `json:"label"`
	Category string   `json:"category"`
	Tags     []string `json:"tags"`
	URI      string   `json:"uri"`
}

type EOLresultElementConverted struct {
	FullName   string   `json:"fullName"`
	InputNames []string `json:"inputNames"`
	EOLName    string   `json:"eolName"`
}

// Function extracts information by <category> the EOLresult and saves it as ./assets/<category>_name.json
func main() {
	if len(os.Args) != 4 {
		fmt.Fprintln(os.Stderr, "<script_name.go> <input.json> <category> <output.json> should be used")
		os.Exit(1)
	}

	inputPath := os.Args[1]
	categoryName := os.Args[2]
	fmt.Printf("Converting %s to a JSON...\n", categoryName)

	data, err := os.ReadFile(inputPath)
	if err != nil {
		fmt.Fprintln(os.Stderr, "could not read:", err)
		os.Exit(1)
	}

	var eolInput EOLresult
	if err := json.Unmarshal(data, &eolInput); err != nil {
		fmt.Fprintln(os.Stderr, "could not parse:", err)
		os.Exit(1)
	}

	eolElements := []EOLresultElementConverted{}
	aliases := map[string]string{}

	for _, eolDataElement := range eolInput.Result {
		if eolDataElement.Category != categoryName {
			continue
		}

		inputNames := append([]string{eolDataElement.Name}, eolDataElement.Aliases...)

		eolElements = append(eolElements, EOLresultElementConverted{
			FullName:   eolDataElement.Label,
			InputNames: inputNames,
			EOLName:    eolDataElement.Name,
		})

		for _, alias := range inputNames {
			aliases[alias] = eolDataElement.Name
		}
	}

	output := map[string]any{
		"product": eolElements,
		"aliases": aliases,
	}

	encoded, err := json.MarshalIndent(output, "", "  ")

	if err != nil {
		fmt.Fprintln(os.Stderr, "could not encode:", err)
		os.Exit(1)
	}

	if err := os.WriteFile(fmt.Sprintf("./%s_names.json", categoryName), encoded, 0644); err != nil {
		fmt.Fprintln(os.Stderr, "could not write:", err)
		os.Exit(1)
	}

	fmt.Printf("Done (converted %d entries to %s_names.json)\n", len(eolElements), categoryName)
}
