package main

import "fmt"

func main() {
	fmt.Println("This message was printed from a compiled program")
	fmt.Println("::notice:: This is a notice, that should be formatted nicely in GitHub Actions.")
	// resSendRequest, err := SendRequest("go")
	// if err != nil {
	// 	panic("Error occurred")
	// }

	// res, errRes := GetNltsVersionsAndCheckEOLdates(resSendRequest, 3, true)
	// if errRes != nil {
	// 	panic("Error occurred while fetching LTS versions")
	// }
	// fmt.Println(string(res))
}
