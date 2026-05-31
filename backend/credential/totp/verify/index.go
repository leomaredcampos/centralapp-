package verify

import "net/http"

func RegisterHandlers() {
	http.HandleFunc("/api/verify-totp", HandleVerifyTOTP)
}
