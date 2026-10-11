package main

import (
	"testing"
)

func TestGetFullLanguageName(t *testing.T) {
	t.Run("Expect temurin to have 'Java (Eclipse Temurin)' as full name", func(t *testing.T) {
		want := "Java (Eclipse Temurin)"
		got := GetFullLanguageName("temurin")

		if want != got {
			t.Errorf("Wanted: %s, got: %s", want, got)
		}
	})

	t.Run("Should panic for 'labas' (equivalent to if full name is not found)", func(t *testing.T) {
		defer func() {
			r := recover()
			if r == nil {
				t.Errorf("Expected panic, but none occurred")
			} else if r != "Could not find full name for 'labas'" {
				t.Errorf("Unexpected panic message: %v", r)
			}
		}()

		GetFullLanguageName("labas")
	})
}
