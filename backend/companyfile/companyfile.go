package companyfile

import (
	"io"
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

	var filePath string
	if logoType == "login" {
		filePath = filepath.Join("companyfile", "companyloginlogo", companyID, "logo.png")
	} else if logoType == "main" {
		filePath = filepath.Join("companyfile", "companymainlogo", companyID, "favicon.png")
	} else {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	file, err := os.Open(filePath)
	if err != nil {
		w.WriteHeader(http.StatusNotFound)
		return
	}
	defer file.Close()

	w.Header().Set("Content-Type", "image/png")
	io.Copy(w, file)
}
