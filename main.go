package main

import (
	"flag"
)

func main() {
	languagePtr := flag.String("language", "", "")
	versionsToFetchPtr := flag.Int("versions", 0, "")
	checkEOLptr := flag.Bool("check_eol", false, "")
	writeToGHAptr := flag.Bool("write_to_gha", false, "")
	parseLanguagePtr := flag.Bool("parse_language", false, "")
	checkFileAge := flag.String("check_file_age", "", "")

	flag.Parse()

	if *writeToGHAptr && *parseLanguagePtr {
		WriteJSONArrayToGitHubOutput("parsed_language_name", UnifyName(*languagePtr))
	}

	if *checkFileAge != "" {
		GetFileAgeInDays(*checkFileAge, true)
	}

	if *writeToGHAptr {

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

}
