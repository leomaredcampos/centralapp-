package credential

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

	// Check TOTP attempt lock
	if locked, remaining := isLocked("totp:" + req.Email); locked {
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
		locked, remaining := recordAttempt("totp:" + req.Email)
		if locked {
			json.NewEncoder(w).Encode(map[string]interface{}{"status": "attempt_locked", "remaining": remaining})
			return
		}
		json.NewEncoder(w).Encode(map[string]string{"status": "invalid"})
		return
	}

	resetAttempts("totp:" + req.Email)

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
