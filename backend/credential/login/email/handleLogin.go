package email

import (
	"encoding/json"
	"net/http"

	"centralapp/backend/credential"
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

	if locked, remaining := credential.IsLocked("email:" + req.Email); locked {
		json.NewEncoder(w).Encode(map[string]interface{}{
			"status":    "attempt_locked",
			"remaining": remaining,
		})
		return
	}

	exists, totpRequired, isLocked, err := CheckUser(req.Email)
	if !exists {
		locked, remaining := credential.RecordAttempt("email:" + req.Email)
		if locked {
			json.NewEncoder(w).Encode(map[string]interface{}{"status": "attempt_locked", "remaining": remaining})
			return
		}
		json.NewEncoder(w).Encode(map[string]string{"status": "not_found"})
		return
	}
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": "db error"})
		return
	}

	if totpRequired {
		credential.ResetAttempts("email:" + req.Email)
		json.NewEncoder(w).Encode(map[string]string{"status": "totp_required"})
		return
	}

	if isLocked {
		json.NewEncoder(w).Encode(map[string]string{"status": "locked"})
		return
	}

	if err := SendOTP(req.Email, r); err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": "failed to send email", "details": err.Error()})
		return
	}

	credential.ResetAttempts("email:" + req.Email)
	credential.SetOTPSentAt(req.Email)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"status":    "otp_sent",
		"remaining": credential.OTPSecondsRemaining(req.Email),
	})
}
