package status

import "net/http"

func RegisterHandlers() {
	http.HandleFunc("/api/check-totp-status", HandleCheckTOTPStatus)
}
