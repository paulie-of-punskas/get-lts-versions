package main

import (
	"flag"
	"fmt"
	"os"
	"path/filepath"
	// "strings"
)

func main() {
	languagePtr := flag.String("language", "", "")
	versionsToFetchPtr := flag.Int("versions", 3, "")
	checkEOLptr := flag.Bool("check_eol", false, "")
	writeToGHAptr := flag.Bool("write_to_gha", false, "")
	// writeToFilePtr := flag.Bool("write_data_to_file", false, "")
	parseLanguagePtr := flag.Bool("parse_language", false, "")
	checkFileAgePtr := flag.String("check_file_age", "", "")
	cacheExistsPtr := flag.Bool("cache_exists", false, "")
	cacheAgePtr := flag.Int("cache_age", 0, "")

	flag.Parse()

	// case when only language needs to be parsed to GHA
	if *languagePtr != "" && *writeToGHAptr && *parseLanguagePtr {
		WriteJSONArrayToGitHubOutput("parsed_language_name", UnifyName(*languagePtr))
	}

	// case for saving cache age to GHA
	if *writeToGHAptr && *checkFileAgePtr != "" {
		resAge, errAge := GetFileAgeInDays(*checkFileAgePtr, false)
		if errAge != nil {
			panic("Error occurred while while calculating file age")
		}
		WriteJSONArrayToGitHubOutput("cache_file_age", resAge)
	}

	// case when cache exists and is less than 7 days old
	// if *languagePtr != "" && !*parseLanguagePtr && *writeToGHAptr {
	if *cacheExistsPtr && *cacheAgePtr <= 7 {
		var rootDir string
		if os.Getenv("GITHUB_WORKSPACE") != "" {
			rootDir = os.Getenv("GITHUB_WORKSPACE")
		} else {
			rootDir = "."
		}
		cacheDir := filepath.Join(rootDir, ".cache")
		parsedLanguage := UnifyName(*languagePtr)

		cacheFileName := filepath.Join(cacheDir, parsedLanguage+"-"+fmt.Sprintf("%v", *versionsToFetchPtr)+".json")
		cacheFileContent, err := os.ReadFile(cacheFileName)
		if err != nil {
			panic(fmt.Sprintf("Error occurred while reading cache file - %s", cacheFileName))
		}

		cachedLTSversions, errResLTSversions := GetNltsVersionsAndCheckEOLdates(string(cacheFileContent), *versionsToFetchPtr, *checkEOLptr)
		if errResLTSversions != nil {
			panic(fmt.Sprintf("Error occurred while extracting LTS versions from cached file - %s. File content: %s", errResLTSversions, string(cacheFileContent)))
		}
		WriteJSONArrayToGitHubOutput("lts_versions", cachedLTSversions)
	}

	// case for updating/creating cache, extracting EOL data and saving it to GHA
	// if *writeToFilePtr && *languagePtr != "" && *versionsToFetchPtr != 0 {
	if *cacheAgePtr > 7 || *cacheExistsPtr != true {
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

		// prepare file, that will be cached later in action.yaml
		// resAsSingleString := strings.Join(res, "\n") + "\n"
		os.WriteFile(cacheFileName, []byte(resSendRequest), 0644)

		// return array to GHA
		WriteJSONArrayToGitHubOutput("lts_versions", res)
	}
}
