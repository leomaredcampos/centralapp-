package setup

import (
	"encoding/json"
	"net/http"

	"centralapp/backend/utils"
)

func HandleVerifyTOTPSetup(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	if r.Method != http.MethodPost {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}

	var req struct {
		Email  string `json:"email"`
		Code   string `json:"code"`
		Secret string `json:"secret"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "invalid request"})
		return
	}

	if !utils.ValidateTOTP(req.Secret, req.Code) {
		json.NewEncoder(w).Encode(map[string]string{"status": "invalid"})
		return
	}

	_, err := utils.DB.Exec("UPDATE userinfotbl SET totp=$1, totpverified='yes', otpstatus='', otpkey='' WHERE emailx=$2", req.Secret, req.Email)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": "failed to save totp"})
		return
	}

	json.NewEncoder(w).Encode(map[string]string{"status": "verified"})
	logTOTPSetup(req.Email, r)
}

func logTOTPSetup(email string, r *http.Request) {
	utils.DB.Exec("INSERT INTO centralizeaudittbl (emailx, action, ipaddress) VALUES ($1, 'TOTP Setup', $2)", email, r.RemoteAddr)
}
