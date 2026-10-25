package main

import (
	"encoding/json"
	"fmt"
	"math"
	"time"
)

func CheckEOL(languageName, majorMinorVersion, inputEOLdate string) string {
	if inputEOLdate == "" {
		fmt.Printf("::notice::There is no information about End Of Life date for %s version %s.\n", GetFullLanguageName(languageName), majorMinorVersion)
		return ""
	}

	eolDate, err := time.Parse("2006-01-02", inputEOLdate)
	if err != nil {
		panic(fmt.Sprintf("Could not convert %s to Date", inputEOLdate))
	}

	diffDays := math.Ceil(float64(eolDate.UnixMilli()-time.Now().UnixMilli()) / (1000 * 60 * 60 * 24))
	if diffDays < 0 {
		fmt.Printf("::warning::%s %s support has expired on %s. It no longer offers active or security support.", GetFullLanguageName(languageName), majorMinorVersion, eolDate.UTC().Format("2006-01-02"))
	} else if diffDays <= 180 {
		fmt.Printf("::notice::%s %s End Of Life is approaching. It still has %v day(s) of security support.", GetFullLanguageName(languageName), majorMinorVersion, diffDays)
	}
	return ""
}

func GetNltsVersionsAndCheckEOLdates(jsonInput string, numOfVersions int, checkEOL bool) ([]string, error) {
	var eolResponse EOLresponse
	var maxAvailableVersions int
	ltsVersions := []string{}

	err := json.Unmarshal([]byte(jsonInput), &eolResponse)
	if err != nil {
		return []string{}, fmt.Errorf("Could not convert input file to EOLresponse")
	}

	maxAvailableVersions = min(numOfVersions, len(eolResponse.Result.Releases))

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
			CheckEOL(eolResponse.Result.Name, releaseData.MajorMinorVersion, releaseData.EolFrom)
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
