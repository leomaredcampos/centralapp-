package disable

import (
	"encoding/json"
	"net/http"

	"centralapp/backend/utils"
)

func HandleDisableTOTP(w http.ResponseWriter, r *http.Request) {
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

	_, err := utils.DB.Exec("UPDATE userinfotbl SET totp='', totpverified='', otpstatus='', otpkey='' WHERE emailx=$1", req.Email)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": "failed to disable totp"})
		return
	}

	deleteAllTOTPSessions(req.Email)

	logTOTPDisabled(req.Email, r)
	json.NewEncoder(w).Encode(map[string]string{"status": "disabled"})
}

func deleteAllTOTPSessions(email string) {
	utils.DB.Exec("DELETE FROM usertotp_sessions WHERE emailx=$1", email)
}

func logTOTPDisabled(email string, r *http.Request) {
	utils.DB.Exec("INSERT INTO centralizeaudittbl (emailx, action, ipaddress) VALUES ($1, 'TOTP Disabled', $2)", email, r.RemoteAddr)
}
