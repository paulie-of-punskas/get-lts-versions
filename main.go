package main

import (
	"flag"
)

func main() {
	languagePtr := flag.String("language", "", "")
	versionsToFetchPtr := flag.Int("versions", 0, "")
	checkEOLptr := flag.Bool("check_eol", true, "")
	writeToGHAptr := flag.Bool("write_to_gha", true, "")

	flag.Parse()

	resSendRequest, err := SendRequest(*languagePtr)
	if err != nil {
		panic("Error occurred while sending request")
	}

	res, errRes := GetNltsVersionsAndCheckEOLdates(resSendRequest, *versionsToFetchPtr, *checkEOLptr)
	if errRes != nil {
		panic("Error occurred while fetching LTS versions")
	}

	if *writeToGHAptr {
		WriteJSONArrayToGitHubOutput("lts_versions", string(res))
	}
}
