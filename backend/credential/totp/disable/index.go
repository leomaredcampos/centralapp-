package disable

import "net/http"

func RegisterHandlers() {
	http.HandleFunc("/api/disable-totp", HandleDisableTOTP)
}
