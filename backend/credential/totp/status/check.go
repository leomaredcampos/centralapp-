package status

import (
	"encoding/json"
	"net/http"

	"centralapp/backend/utils"
)

func HandleCheckTOTPStatus(w http.ResponseWriter, r *http.Request) {
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

	var secret string
	utils.DB.QueryRow("SELECT COALESCE(totp,'') FROM userinfotbl WHERE emailx=$1", req.Email).Scan(&secret)

	json.NewEncoder(w).Encode(map[string]interface{}{"enabled": secret != ""})
}
