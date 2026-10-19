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
	return math.Floor(float64((ageInMs / (1000 * 60 * 60 * 24)))), nil

}
