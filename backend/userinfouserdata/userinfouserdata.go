package userinfouserdata

import (
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
)

func RegisterRoutes() {
}

func HandleUploadFiles(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	if r.Method != http.MethodPost {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}

	r.ParseMultipartForm(32 << 20)

	email := r.FormValue("email")
	if email == "" {
		w.WriteHeader(http.StatusBadRequest)
		fmt.Fprintf(w, `{"error":"email required"}`)
		return
	}

	folderPath := filepath.Join("userinfouserdata", email)
	if err := os.MkdirAll(folderPath, os.ModePerm); err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Fprintf(w, `{"error":"failed to create folder"}`)
		return
	}

	files := r.MultipartForm.File["files"]
	if len(files) > 4 {
		w.WriteHeader(http.StatusBadRequest)
		fmt.Fprintf(w, `{"error":"max 4 files only"}`)
		return
	}

	for _, fileHeader := range files {
		file, err := fileHeader.Open()
		if err != nil {
			continue
		}
		defer file.Close()

		dst, err := os.Create(filepath.Join(folderPath, fileHeader.Filename))
		if err != nil {
			continue
		}
		defer dst.Close()
		io.Copy(dst, file)
	}

	fmt.Fprintf(w, `{"status":"uploaded"}`)
}
