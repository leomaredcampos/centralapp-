package companyfile

import (
	"io"
	"log"
	"net/http"
	"os"
	"path/filepath"
)

func RegisterRoutes() {
	http.HandleFunc("/api/company-logo", HandleGetCompanyLogo)
}

func HandleGetCompanyLogo(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}

	companyID := r.URL.Query().Get("id")
	if companyID == "" {
		companyID = "1"
	}

	logoType := r.URL.Query().Get("type")
	if logoType == "" {
		logoType = "login"
	}

	wd, _ := os.Getwd()
	log.Printf("Current working directory: %s", wd)

	var filePath string
	if logoType == "login" {
		filePath = filepath.Join("companyfile", "companyloginlogo", companyID, "logo.png")
	} else if logoType == "main" {
		filePath = filepath.Join("companyfile", "companymainlogo", companyID, "favicon.png")
	} else {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	log.Printf("Attempting to open file: %s", filePath)
	file, err := os.Open(filePath)
	if err != nil {
		log.Printf("File not found: %s, error: %v", filePath, err)
		w.WriteHeader(http.StatusNotFound)
		return
	}
	defer file.Close()

	w.Header().Set("Content-Type", "image/png")
	io.Copy(w, file)
	log.Printf("Successfully served file: %s", filePath)
}
