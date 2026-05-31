package otp

import (
	"encoding/json"
	"net/http"

	"centralapp/backend/credential"
)

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

	if locked, remaining := credential.IsLocked("otp:" + req.Email); locked {
		json.NewEncoder(w).Encode(map[string]interface{}{
			"status":    "attempt_locked",
			"remaining": remaining,
		})
		return
	}

	if credential.IsOTPExpired(req.Email) {
		json.NewEncoder(w).Encode(map[string]string{"status": "otp_expired"})
		return
	}

	valid, err := VerifyOTP(req.Email, req.OTP, r)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "email not found"})
		return
	}

	if !valid {
		locked, remaining := credential.RecordAttempt("otp:" + req.Email)
		if locked {
			json.NewEncoder(w).Encode(map[string]interface{}{"status": "attempt_locked", "remaining": remaining})
			return
		}
		json.NewEncoder(w).Encode(map[string]string{"status": "invalid_otp"})
		return
	}

	credential.ResetAttempts("otp:" + req.Email)
	json.NewEncoder(w).Encode(map[string]string{"status": "verified"})
}
