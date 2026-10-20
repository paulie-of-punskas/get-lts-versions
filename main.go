package main

import (
	"flag"
	"fmt"
	"os"
	"path/filepath"
	"strings"
)

func main() {
	languagePtr := flag.String("language", "", "")
	versionsToFetchPtr := flag.Int("versions", 3, "")
	checkEOLptr := flag.Bool("check_eol", false, "")
	writeToGHAptr := flag.Bool("write_to_gha", false, "")
	writeToFile := flag.Bool("write_data_to_file", false, "")
	parseLanguagePtr := flag.Bool("parse_language", false, "")
	checkFileAge := flag.String("check_file_age", "", "")

	flag.Parse()

	if *writeToGHAptr && *parseLanguagePtr {
		WriteJSONArrayToGitHubOutput("parsed_language_name", UnifyName(*languagePtr))
	}

	if *writeToGHAptr && *checkFileAge != "" {
		resAge, errAge := GetFileAgeInDays(*checkFileAge, false)
		if errAge != nil {
			panic("Error occurred while while calculating file age")
		}
		WriteJSONArrayToGitHubOutput("cache_file_age", resAge)
	}

	if *writeToGHAptr && !*parseLanguagePtr && *checkFileAge == "" {

		resSendRequest, err := SendRequest(*languagePtr)
		if err != nil {
			panic("Error occurred while sending request")
		}

		res, errRes := GetNltsVersionsAndCheckEOLdates(resSendRequest, *versionsToFetchPtr, *checkEOLptr)
		if errRes != nil {
			panic("Error occurred while fetching LTS versions")
		}

		WriteJSONArrayToGitHubOutput("lts_versions", res)
	}

	if *writeToFile && *languagePtr != "" {
		var rootDir string
		if os.Getenv("GITHUB_WORKSPACE") != "" {
			rootDir = os.Getenv("GITHUB_WORKSPACE")
		} else {
			rootDir = "."
		}
		cacheDir := filepath.Join(rootDir, ".cache")
		parsedLanguage := UnifyName(*languagePtr)

		cacheFileName := filepath.Join(cacheDir, parsedLanguage+"-"+fmt.Sprintf("%v", *versionsToFetchPtr)+".json")

		resSendRequest, err := SendRequest(*languagePtr)
		if err != nil {
			panic("Error occurred while sending request")
		}

		res, errRes := GetNltsVersionsAndCheckEOLdates(resSendRequest, *versionsToFetchPtr, *checkEOLptr)
		if errRes != nil {
			panic("Error occurred while fetching LTS versions")
		}

		resAsSingleString := strings.Join(res, "\n") + "\n"
		os.WriteFile(cacheFileName, []byte(resAsSingleString), 0644)
	}
}
