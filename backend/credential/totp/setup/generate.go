package setup

import (
	"encoding/json"
	"net/http"

	"centralapp/backend/utils"
)

func HandleSetupTOTP(w http.ResponseWriter, r *http.Request) {
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

	secret := utils.GenerateTOTPSecret()
	uri := utils.GenerateTOTPURI(req.Email, secret)

	json.NewEncoder(w).Encode(map[string]interface{}{
		"status": "ok",
		"secret": secret,
		"uri":    uri,
	})
}
