package main

// Code contains structures for parsing language names, OS names etc.
type ProductNames struct {
	Product []ProductDetails  `json:"product"`
	Aliases map[string]string `json:"aliases"`
}

type ProductDetails struct {
	FullName   string   `json:"fullName"`
	InputNames []string `json:"inputNames"`
	EolName    string   `json:"eolName"`
}
