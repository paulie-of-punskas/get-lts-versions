package main

import (
	"flag"
	"fmt"
	"os"
	// "strconv"
	// "strings"
)

var version = "1.1.0"

func main() {
	languagePtr := flag.String("language", "", "")
	versionsToFetchPtr := flag.Int("versions", 3, "")
	checkEOLptr := flag.Bool("check_eol", true, "")
	writeToGHAptr := flag.Bool("write_to_gha", false, "")
	// writeToFilePtr := flag.Bool("write_data_to_file", false, "")
	parseLanguagePtr := flag.String("parse_language", "", "")
	getFileAgePtr := flag.String("get_file_age", "", "")
	// cacheHitPtr := flag.String("cache_hit", "", "")
	// cacheAgePtr := flag.String("cache_age", "", "")
	cacheRenewPtr := flag.Bool("cache_renew", false, "")
	getCachePtr := flag.Bool("get_cache", false, "")
	printVersion := flag.Bool("print_version", false, "")

	flag.Parse()

	if *printVersion {
		fmt.Println(version)
	}

	// cacheAge, _ := strconv.Atoi(*cacheAgePtr)

	// case when only language needs to be parsed to GHA
	if *writeToGHAptr && *parseLanguagePtr != "" && *languagePtr != "" {
		WriteJSONArrayToGitHubOutput("parsed_language_name", UnifyName(*parseLanguagePtr))
		return
	}

	// case for saving cache age to GHA
	if *writeToGHAptr && *getFileAgePtr != "" {
		resAge, errAge := GetFileAgeInDays(*getFileAgePtr, false)
		if errAge != nil {
			panic("Error occurred while while calculating file age")
		}
		WriteJSONArrayToGitHubOutput("cache_file_age", resAge)
		return
	}

	// renew cache function - even if one exists and is not older than 7 days
	if *cacheRenewPtr {
		cacheFileName := GetCacheFileFullPath(*languagePtr, *versionsToFetchPtr)

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
		return
	}

	if *getCachePtr {
		cacheFileName := GetCacheFileFullPath(*languagePtr, *versionsToFetchPtr)

		cacheFileContent, err := os.ReadFile(cacheFileName)
		if err != nil {
			panic(fmt.Sprintf("Error occurred while reading cache file - %s", cacheFileName))
		}

		cachedLTSversions, errResLTSversions := GetNltsVersionsAndCheckEOLdates(string(cacheFileContent), *versionsToFetchPtr, *checkEOLptr)
		if errResLTSversions != nil {
			panic(fmt.Sprintf("Error occurred while extracting LTS versions from cached file - %s. File content: %s", errResLTSversions, string(cacheFileContent)))
		}
		WriteJSONArrayToGitHubOutput("lts_versions", cachedLTSversions)
		return
	}

	// // case when cache exists and is less than 7 days old
	// // if *languagePtr != "" && !*parseLanguagePtr && *writeToGHAptr {
	// if *cacheHitPtr == "true" && cacheAge <= 7 && *languagePtr != "" && *versionsToFetchPtr != 0 {
	// 	cacheFileName := GetCacheFileFullPath(*languagePtr, *versionsToFetchPtr)

	// 	cacheFileContent, err := os.ReadFile(cacheFileName)
	// 	if err != nil {
	// 		panic(fmt.Sprintf("Error occurred while reading cache file - %s", cacheFileName))
	// 	}

	// 	cachedLTSversions, errResLTSversions := GetNltsVersionsAndCheckEOLdates(string(cacheFileContent), *versionsToFetchPtr, *checkEOLptr)
	// 	if errResLTSversions != nil {
	// 		panic(fmt.Sprintf("Error occurred while extracting LTS versions from cached file - %s. File content: %s", errResLTSversions, string(cacheFileContent)))
	// 	}
	// 	WriteJSONArrayToGitHubOutput("lts_versions", cachedLTSversions)
	// 	return
	// }

	// // case for updating/creating cache, extracting EOL data and saving it to GHA
	// // if *writeToFilePtr && *languagePtr != "" && *versionsToFetchPtr != 0 {
	// if (*cacheHitPtr != "true" || cacheAge > 7) && *languagePtr != "" && *versionsToFetchPtr != 0 {
	// 	cacheFileName := GetCacheFileFullPath(*languagePtr, *versionsToFetchPtr)

	// 	resSendRequest, err := SendRequest(*languagePtr)
	// 	if err != nil {
	// 		panic("Error occurred while sending request")
	// 	}

	// 	res, errRes := GetNltsVersionsAndCheckEOLdates(resSendRequest, *versionsToFetchPtr, *checkEOLptr)
	// 	if errRes != nil {
	// 		panic("Error occurred while fetching LTS versions")
	// 	}

	// 	// prepare file, that will be cached later in action.yaml
	// 	// resAsSingleString := strings.Join(res, "\n") + "\n"
	// 	os.WriteFile(cacheFileName, []byte(resSendRequest), 0644)

	// 	// return array to GHA
	// 	WriteJSONArrayToGitHubOutput("lts_versions", res)
	// 	return
	// }
}
