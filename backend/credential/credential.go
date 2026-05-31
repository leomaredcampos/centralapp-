package credential

import (
	"log"
	"net/http"

	"centralapp/backend/utils"
)

func RegisterRoutes() {
	ClearOTPSessions()
	StartSessionExpiryChecker()
	http.HandleFunc("/api/logout", HandleLogout)
	http.HandleFunc("/api/check-session", HandleCheckSession)
	http.HandleFunc("/api/check-totp-session", HandleCheckTOTPSession)
	http.HandleFunc("/api/delete-totp-session", HandleDeleteTOTPSession)
}

func ClearOTPSessions() {
	// Only clear stale sessions (older than 1 day), preserve active sessions
	utils.DB.Exec(`
		UPDATE userinfotbl 
		SET otpstatus='', otpkey='' 
		WHERE otpstatus='locked' 
		AND otplogindate < NOW() - INTERVAL '1 day'
	`)
	log.Println("Stale OTP sessions cleared on startup")
}
