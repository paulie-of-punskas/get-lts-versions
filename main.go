package main

import (
	"flag"
	"fmt"
	"os"
)

var version = "1.2.0"

func main() {
	versionsToFetchPtr := flag.Int("versions", 3, "")
	returnMajorMinorPatch := flag.Bool("return_major_minor_patch_version", false, "")
	checkEOLptr := flag.Bool("check_eol", true, "")
	writeToGHAptr := flag.Bool("write_to_gha", false, "")
	productCategoryPtr := flag.String("category", "", "")
	productNamePtr := flag.String("product_name", "", "")
	getFileAgePtr := flag.String("get_file_age", "", "")
	cacheRenewPtr := flag.Bool("cache_renew", false, "")
	getCachePtr := flag.Bool("get_cache", false, "")
	printVersion := flag.Bool("print_version", false, "")

	flag.Parse()

	if *printVersion {
		fmt.Println(version)
	}

	// case when product name and type need to be parsed to GHA
	if *writeToGHAptr && *productCategoryPtr != "" && *productNamePtr != "" {
		WriteJSONArrayToGitHubOutput("parsed_category", *productCategoryPtr)
		WriteJSONArrayToGitHubOutput("parsed_product_name", UnifyName(*productCategoryPtr, *productNamePtr))
		fmt.Printf("Writing %s %s to GitHub Output", *productCategoryPtr, UnifyName(*productCategoryPtr, *productNamePtr))
		return
	}

	// case for saving cache age to GHA
	if *writeToGHAptr && *getFileAgePtr != "" {
		resAge, errAge := GetFileAgeInDays(*getFileAgePtr, false)
		if errAge != nil {
			panic(fmt.Sprintf("Error occurred while calculating file age - %s", errAge))
		}
		WriteJSONArrayToGitHubOutput("cache_file_age", resAge)
		return
	}

	// renew cache function - even if one exists and is not older than 7 days
	if *cacheRenewPtr {
		cacheFileName := GetCacheFileFullPath(*productCategoryPtr, UnifyName(*productCategoryPtr, *productNamePtr), *versionsToFetchPtr)

		resSendRequest, err := SendRequest("https://endoflife.date/api/v1/products", UnifyName(*productCategoryPtr, *productNamePtr))
		if err != nil {
			panic("Error occurred while sending request")
		}

		res, errRes := GetNltsVersionsAndCheckEOLdates(resSendRequest, *versionsToFetchPtr, *checkEOLptr, *returnMajorMinorPatch)
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
		cacheFileName := GetCacheFileFullPath(*productCategoryPtr, UnifyName(*productCategoryPtr, *productNamePtr), *versionsToFetchPtr)

		cacheFileContent, err := os.ReadFile(cacheFileName)
		if err != nil {
			panic(fmt.Sprintf("Error occurred while reading cache file - %s", cacheFileName))
		}

		cachedLTSversions, errResLTSversions := GetNltsVersionsAndCheckEOLdates(string(cacheFileContent), *versionsToFetchPtr, *checkEOLptr, *returnMajorMinorPatch)
		if errResLTSversions != nil {
			panic(fmt.Sprintf("Error occurred while extracting LTS versions from cached file - %s. File content: %s", errResLTSversions, string(cacheFileContent)))
		}
		WriteJSONArrayToGitHubOutput("lts_versions", cachedLTSversions)
		return
	}
}
