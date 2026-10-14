package main

import (
	"flag"
	"fmt"
)

func main() {
	languagePtr := flag.String("language", "", "")
	versionsToFetchPtr := flag.Int("versions", 0, "")
	checkEOLptr := flag.Bool("check_eol", true, "")

	flag.Parse()

	resSendRequest, err := SendRequest(*languagePtr)
	if err != nil {
		panic("Error occurred while sending request")
	}

	res, errRes := GetNltsVersionsAndCheckEOLdates(resSendRequest, *versionsToFetchPtr, *checkEOLptr)
	if errRes != nil {
		panic("Error occurred while fetching LTS versions")
	}
	fmt.Println(string(res))
}
