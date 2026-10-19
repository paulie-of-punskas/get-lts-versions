package main

import (
	"fmt"
	"math"
	"os"
	"time"
)

func GetFileAgeInDays(fullFilePath string, verbose bool) (float64, error) {
	file, err := os.Stat(fullFilePath)
	if err != nil {
		return 0.0, fmt.Errorf("Could not find/open %s - %s", fullFilePath, err)
	}

	ageInMs := time.Now().UnixMilli() - file.ModTime().UnixMilli()
	ageInDays := math.Floor(float64((ageInMs / (1000 * 60 * 60 * 24))))
	if verbose {
		fmt.Printf("%s age in days: %s\n", fullFilePath, fmt.Sprintf("%v", ageInDays))
	}
	return ageInDays, nil
}
