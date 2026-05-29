package main

import (
	"log"
	"net/http"

	"centralapp/backend/finalcollector"
	"centralapp/backend/utils"
)

func main() {
	finalcollector.Start()
	utils.RegisterRoutes() // ✅ ADD THIS LINE

	defer utils.CloseDB()

	log.Println("Backend running on :3000")
	http.ListenAndServe(":3000", nil)
}
