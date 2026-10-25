package main

import (
	"fmt"
	"io"
	"net/http"
	"strings"
)

// Sends request to the EOL website.
// If 200 - returns a Body, if 404 - returns error with language not found information
// else returns an error depending on the task
func SendRequest(url, language string) (string, error) {
	eolURL := strings.Builder{}
	eolURL.WriteString(url)
	eolURL.WriteString("/")
	eolURL.WriteString(SanitizeString(language))

	req, clientErr := http.NewRequest(http.MethodGet, eolURL.String(), nil)

	if clientErr != nil {
		return "", fmt.Errorf("Could not create HTTP request for %s - %s", eolURL.String(), clientErr)
	}

	req.Header.Set("Content-Type", "application/json")

	requestClient := http.Client{}
	res, requestErr := requestClient.Do(req)

	if requestErr != nil {
		return "", fmt.Errorf("Error sending HTTP request to %s - %s", eolURL.String(), requestErr)
	}

	if res.Body != nil {
		defer res.Body.Close()
	}

	if res.StatusCode != 200 && res.StatusCode != 404 {
		return "", fmt.Errorf("HTTP request for %s returned %s", eolURL.String(), res.Status)
	} else if res.StatusCode == 404 {
		return "", fmt.Errorf("%s was not found on %s", language, eolURL.String())
	}

	body, readErr := io.ReadAll(res.Body)
	if readErr != nil {
		return "", fmt.Errorf("Error reading returned Body - %s", requestErr)
	}

	return string(body), nil
}
