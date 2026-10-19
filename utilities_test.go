package main

import (
	"testing"
)

func TestGetFileAgeInDays(t *testing.T) {
	t.Run("Expect error if './test_data/hello.json' does not exist", func(t *testing.T) {
		_, err := GetFileAgeInDays("./test_data/hello.json", false)
		if err == nil {
			t.Errorf("Wanted to catch the error. Got: %s", err)
		}
	})

	t.Run("Expect float64 to be returned if './test_data/eol_return_golang.json'", func(t *testing.T) {
		_, err := GetFileAgeInDays("./test_data/eol_return_golang.json", false)
		if err != nil {
			t.Errorf("Function should not have returned an error. Got: %s", err)
		}
	})
}
