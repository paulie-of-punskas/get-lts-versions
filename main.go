package main

import (
	"flag"
	"fmt"
	"os"
)

var version = "1.1.0"

func main() {
	versionsToFetchPtr := flag.Int("versions", 3, "")
	checkEOLptr := flag.Bool("check_eol", true, "")
	writeToGHAptr := flag.Bool("write_to_gha", false, "")
	parseLanguagePtr := flag.String("parse_language", "", "")
	getFileAgePtr := flag.String("get_file_age", "", "")
	cacheRenewPtr := flag.Bool("cache_renew", false, "")
	getCachePtr := flag.Bool("get_cache", false, "")
	printVersion := flag.Bool("print_version", false, "")

	flag.Parse()

	if *printVersion {
		fmt.Println(version)
	}

	// case when only language needs to be parsed to GHA
	if *writeToGHAptr && *parseLanguagePtr != "" {
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
		cacheFileName := GetCacheFileFullPath(UnifyName(*parseLanguagePtr), *versionsToFetchPtr)

		resSendRequest, err := SendRequest("https://endoflife.date/api/v1/products", UnifyName(*parseLanguagePtr))
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
		cacheFileName := GetCacheFileFullPath(UnifyName(*parseLanguagePtr), *versionsToFetchPtr)

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
}
