package credential

import (
	"log"
	"net/http"

	"centralapp/backend/utils"
)

func RegisterRoutes() {
	ClearOTPSessions()
	StartSessionExpiryChecker()
	http.HandleFunc("/api/login", HandleLogin)
	http.HandleFunc("/api/verify-otp", HandleVerifyOTP)
	http.HandleFunc("/api/logout", HandleLogout)
	http.HandleFunc("/api/check-session", HandleCheckSession)
	http.HandleFunc("/api/setup-totp", HandleSetupTOTP)
	http.HandleFunc("/api/verify-totp", HandleVerifyTOTP)
	http.HandleFunc("/api/verify-totp-setup", HandleVerifyTOTPSetup)
	http.HandleFunc("/api/disable-totp", HandleDisableTOTP)
	http.HandleFunc("/api/check-totp-status", HandleCheckTOTPStatus)
	http.HandleFunc("/api/check-totp-session", HandleCheckTOTPSession)
	http.HandleFunc("/api/delete-totp-session", HandleDeleteTOTPSession)
}

func ClearOTPSessions() {
	utils.DB.Exec("UPDATE userinfotbl SET otpstatus='', otpkey=''")
	log.Println("All sessions cleared on startup")
}
