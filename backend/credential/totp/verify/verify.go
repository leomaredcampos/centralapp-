package verify

import (
	"encoding/json"
	"net/http"

	"centralapp/backend/credential"
	"centralapp/backend/utils"
)

func HandleVerifyTOTP(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	if r.Method != http.MethodPost {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}

	var req struct {
		Email string `json:"email"`
		Code  string `json:"code"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "invalid request"})
		return
	}

	if locked, remaining := credential.IsLocked("totp:" + req.Email); locked {
		json.NewEncoder(w).Encode(map[string]interface{}{
			"status":    "attempt_locked",
			"remaining": remaining,
		})
		return
	}

	var secret string
	err := utils.DB.QueryRow("SELECT COALESCE(totp,'') FROM userinfotbl WHERE emailx=$1", req.Email).Scan(&secret)
	if err != nil || secret == "" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "totp not set up"})
		return
	}

	if !utils.ValidateTOTP(secret, req.Code) {
		locked, remaining := credential.RecordAttempt("totp:" + req.Email)
		if locked {
			json.NewEncoder(w).Encode(map[string]interface{}{"status": "attempt_locked", "remaining": remaining})
			return
		}
		json.NewEncoder(w).Encode(map[string]string{"status": "invalid"})
		return
	}

	credential.ResetAttempts("totp:" + req.Email)

	_, err = utils.DB.Exec("UPDATE userinfotbl SET otpstatus='locked' WHERE emailx=$1", req.Email)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": "failed to update status"})
		return
	}

	sessionid, err := createTOTPSession(req.Email)
	if err != nil || sessionid == "" {
		json.NewEncoder(w).Encode(map[string]string{"status": "max_sessions"})
		return
	}

	json.NewEncoder(w).Encode(map[string]interface{}{"status": "verified", "sessionid": sessionid})
	logTOTPVerified(req.Email, r)
}

func createTOTPSession(email string) (string, error) {
	var count int
	utils.DB.QueryRow("SELECT COUNT(*) FROM totpsessiontbl WHERE emailx=$1", email).Scan(&count)
	if count >= 3 {
		return "", nil
	}

	sessionid := utils.GenerateTOTPSecret()
	_, err := utils.DB.Exec("INSERT INTO totpsessiontbl (emailx, sessionid) VALUES ($1, $2)", email, sessionid)
	if err != nil {
		return "", err
	}
	return sessionid, nil
}

func logTOTPVerified(email string, r *http.Request) {
	utils.DB.Exec("INSERT INTO centralizeaudittbl (emailx, action, ipaddress) VALUES ($1, 'TOTP Verified', $2)", email, r.RemoteAddr)
}
