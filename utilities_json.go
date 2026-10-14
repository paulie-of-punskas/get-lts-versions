package main

import (
	"encoding/json"
	"fmt"
)

func IsRequestReturnedContentOK(jsonInput string) bool {
	// convert string input to a byte stream and then to JSON and Language structure
	var eolResponse EOLresponse

	err := json.Unmarshal([]byte(jsonInput), &eolResponse)

	if err != nil {
		fmt.Printf("Could not convert EOL response Body to LanguageNames struct - %s\n", err)
		return false
	}

	if eolResponse.Result.Name == "" || len(eolResponse.Result.Releases) == 0 {
		fmt.Println("Problem with JSON conversion - eolResponse.Result.Name or eolResponse.Result.Releases is/are empty")
		return false
	}
	return true
}
