package setup

import "net/http"

func RegisterHandlers() {
	http.HandleFunc("/api/setup-totp", HandleSetupTOTP)
	http.HandleFunc("/api/verify-totp-setup", HandleVerifyTOTPSetup)
}
