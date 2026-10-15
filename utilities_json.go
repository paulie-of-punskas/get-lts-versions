package main

import (
	"encoding/json"
	"fmt"
)

func GetNltsVersionsAndCheckEOLdates(jsonInput string, numOfVersions int, checkEOL bool) ([]string, error) {
	var eolResponse EOLresponse
	var maxAvailableVersions int
	ltsVersions := []string{}

	err := json.Unmarshal([]byte(jsonInput), &eolResponse)
	if err != nil {
		fmt.Errorf("Could not convert input file to EOLresponse")
		return []string{}, err
	}

	if numOfVersions > len(eolResponse.Result.Releases) {
		maxAvailableVersions = len(eolResponse.Result.Releases)
	} else {
		maxAvailableVersions = numOfVersions
	}

	for j := 0; j < maxAvailableVersions; j++ {
		releaseData := LanguageReleases{
			eolResponse.Result.Releases[j].MajorMinorVersion,
			eolResponse.Result.Releases[j].IsLts,
			eolResponse.Result.Releases[j].IsEol,
			eolResponse.Result.Releases[j].EolFrom,
			eolResponse.Result.Releases[j].EoasFrom,
			LanguageLatestRelease{
				eolResponse.Result.Releases[j].Latest.MajorMinorPatchVersion,
				eolResponse.Result.Releases[j].Latest.Date,
				eolResponse.Result.Releases[j].Latest.Link,
			},
		}

		if !releaseData.IsEol && releaseData.MajorMinorVersion != "" && releaseData.Latest.MajorMinorPatchVersion != "" {
			ltsVersions = append(ltsVersions, string(releaseData.MajorMinorVersion))
		}

		if checkEOL {
			releaseData.checkEOL(eolResponse.Result.Name, releaseData.MajorMinorVersion, releaseData.EolFrom)
		}
	}

	// json.Marshal returns nil as well
	return ltsVersions, nil
}

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
