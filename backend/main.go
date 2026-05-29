package main

import (
	"log"
	"net/http"

	"centralapp/backend/finalcollector"
	"centralapp/backend/utils"
)

func main() {
	utils.ConnectDB()      // ✅ ensure DB connect
	utils.RegisterRoutes() // ✅ REGISTER ROUTES FIRST
	finalcollector.Start() // ✅ then start logic

	defer utils.CloseDB()

	log.Println("Backend running on :3000")
	http.ListenAndServe(":3000", nil)
}
