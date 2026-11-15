package main

type LanguageNames struct {
	Languages []LanguageAliases `json:"lang"`
	Aliases   map[string]string `json:"aliases"`
}

type LanguageAliases struct {
	LanguageFullName string   `json:"fullName"`
	InputNames       []string `json:"inputNames"`
	EolName          string   `json:"eolName"`
}
