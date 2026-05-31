package otp

import "net/http"

func RegisterHandlers() {
	http.HandleFunc("/api/verify-otp", HandleVerifyOTP)
}
