package main

import (
	_ "embed"
	"encoding/json"
	"fmt"
	"slices"
	"strings"
)

//go:embed assets/lang_names.json
var languageNamesJSON []byte

//go:embed assets/os_names.json
var osNamesJSON []byte

func SanitizeString(strintToSanitize string) string {
	return strings.ToLower(strings.TrimSpace(strintToSanitize))
}

// Deserialize EOL return
func ReadProductNames(productType, productName string) ProductNames {
	var productNames ProductNames
	var err error

	if productType == "lang" {
		err = json.Unmarshal(languageNamesJSON, &productNames)
	} else {
		err = json.Unmarshal(osNamesJSON, &productNames)
	}

	if err != nil {
		panic(fmt.Sprintf("Could not parse embedded json - %s", err))
	}

	return productNames
}

// Convert language name to follow endoflife API convention, e.g. openjdk
func UnifyName(productType, productName string) string {
	productNames := ReadProductNames(productType, productName)
	productAliases := productNames.Aliases

	normalizedName := SanitizeString(productName)

	if productAliases[normalizedName] != "" {
		return productAliases[normalizedName]
	}

	panic(fmt.Sprintf("Could not find alias for '%s'", productName))
}

// Get full language name from language_names.json > languages[]
func GetFullProductName(productType, productName string) string {
	languagesList := ReadProductNames(productType, productName)
	normalizedLanguage := SanitizeString(productName)

	for j := 0; j < len(languagesList.Product); j++ {
		if slices.Contains(languagesList.Product[j].InputNames, normalizedLanguage) {
			return languagesList.Product[j].FullName
		}
	}

	builder := strings.Builder{}
	builder.WriteString("Could not find full name for '")
	builder.WriteString(productName)
	builder.WriteString("'")
	panic(builder.String())
}
