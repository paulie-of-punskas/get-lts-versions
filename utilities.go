package main

import (
	"fmt"
	"os"
)

func GetFileAgeInDays(fullFilePath string, verbose bool): int, error {
	file, err := os.Stat(fullFilePath, os.O_APPEND|os.O_WRONLY, 0)
	if err != nil {
		return fmt.Errorf("Could not find/open %s - %s", fullFilePath, err)
	}
	defer file.Close()
	
}
