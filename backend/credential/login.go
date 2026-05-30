package credential

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"strings"

	"centralapp/backend/utils"
)

func HandleLogin(w http.ResponseWriter, r *http.Request) {
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

	// Check email attempt lock
	if locked, remaining := isLocked("email:" + req.Email); locked {
		json.NewEncoder(w).Encode(map[string]interface{}{
			"status":    "attempt_locked",
			"remaining": remaining,
		})
		return
	}

	var id int64
	var otpstatus, totpval, totpverified string
	err := utils.DB.QueryRow("SELECT id, COALESCE(otpstatus,''), COALESCE(totp,''), COALESCE(totpverified,'') FROM userinfotbl WHERE emailx=$1", req.Email).Scan(&id, &otpstatus, &totpval, &totpverified)
	if err == sql.ErrNoRows {
		locked, remaining := recordAttempt("email:" + req.Email)
		if locked {
			json.NewEncoder(w).Encode(map[string]interface{}{"status": "attempt_locked", "remaining": remaining})
			return
		}
		json.NewEncoder(w).Encode(map[string]string{"status": "not_found"})
		return
	} else if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": "db error"})
		return
	}

	if totpval != "" && totpverified == "yes" {
		resetAttempts("email:" + req.Email)
		json.NewEncoder(w).Encode(map[string]string{"status": "totp_required"})
		return
	}

	if otpstatus == "locked" {
		json.NewEncoder(w).Encode(map[string]string{"status": "locked"})
		return
	}

	otp := utils.GenerateOTP()
	_, err = utils.DB.Exec("UPDATE userinfotbl SET otpkey=$1 WHERE emailx=$2", otp, req.Email)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": "failed to set otp"})
		return
	}

	if err := utils.SendOTPEmail(req.Email, otp); err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": "failed to send email", "details": err.Error()})
		return
	}

	logOTPSent(req.Email, r)
	resetAttempts("email:" + req.Email)
	setOTPSentAt(req.Email)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"status":  "otp_sent",
		"expires": otpSecondsRemaining(req.Email),
	})
}

func HandleVerifyOTP(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	if r.Method != http.MethodPost {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}

	var req struct {
		Email string `json:"email"`
		OTP   string `json:"otp"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "invalid request"})
		return
	}

	// Check OTP attempt lock
	if locked, remaining := isLocked("otp:" + req.Email); locked {
		json.NewEncoder(w).Encode(map[string]interface{}{
			"status":    "attempt_locked",
			"remaining": remaining,
		})
		return
	}

	// Check OTP expiry
	if isOTPExpired(req.Email) {
		json.NewEncoder(w).Encode(map[string]string{"status": "otp_expired"})
		return
	}

	var otpkey string
	err := utils.DB.QueryRow("SELECT otpkey FROM userinfotbl WHERE emailx=$1", req.Email).Scan(&otpkey)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "email not found"})
		return
	}

	if strings.TrimSpace(otpkey) != strings.TrimSpace(req.OTP) {
		locked, remaining := recordAttempt("otp:" + req.Email)
		if locked {
			json.NewEncoder(w).Encode(map[string]interface{}{"status": "attempt_locked", "remaining": remaining})
			return
		}
		json.NewEncoder(w).Encode(map[string]string{"status": "invalid_otp"})
		return
	}

	resetAttempts("otp:" + req.Email)

	_, err = utils.DB.Exec("UPDATE userinfotbl SET otpstatus='locked', otplogindate=NOW() WHERE emailx=$1", req.Email)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": "failed to update status"})
		return
	}

	logOTPVerified(req.Email, r)
	json.NewEncoder(w).Encode(map[string]string{"status": "verified"})
}
