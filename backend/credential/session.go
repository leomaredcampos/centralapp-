package credential

import (
	"encoding/json"
	"net/http"

	"centralapp/backend/utils"
)

func HandleCheckSession(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	if r.Method != http.MethodPost {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}

	var req struct {
		Email string `json:"email"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "invalid request"})
		return
	}

	var otpstatus string
	err := utils.DB.QueryRow("SELECT COALESCE(otpstatus,'') FROM userinfotbl WHERE emailx=$1", req.Email).Scan(&otpstatus)
	if err != nil {
		json.NewEncoder(w).Encode(map[string]string{"status": "invalid"})
		return
	}

	if otpstatus != "locked" {
		json.NewEncoder(w).Encode(map[string]string{"status": "invalid"})
		return
	}

	json.NewEncoder(w).Encode(map[string]string{"status": "valid"})
}
