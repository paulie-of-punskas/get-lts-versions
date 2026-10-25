package main

type LanguageNames struct {
	Languages []LanguageAliases `json:"languages"`
	Aliases   map[string]string `json:"aliases"`
}

type LanguageAliases struct {
	LanguageFullName string   `json:"languageFullName"`
	InputNames       []string `json:"inputNames"`
	EolName          string   `json:"eolName"`
}
