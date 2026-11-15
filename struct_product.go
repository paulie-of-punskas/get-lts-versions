package main

// Code contains structures for parsing language names, OS names etc.
type ProductNames struct {
	Languages []ProductAliases  `json:"lang"`
	Aliases   map[string]string `json:"aliases"`
}

type ProductAliases struct {
	FullName   string   `json:"fullName"`
	InputNames []string `json:"inputNames"`
	EolName    string   `json:"eolName"`
}
