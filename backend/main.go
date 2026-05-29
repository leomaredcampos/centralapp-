package main

import (
	"log"
	"net/http"

	"centralapp/backend/finalcollector"
	"centralapp/backend/utils"
)

func main() {
	utils.ConnectDB()
	defer utils.CloseDB()

	finalcollector.Start()

	log.Println("Backend running on :3000")
	http.ListenAndServe(":3000", nil)
}
