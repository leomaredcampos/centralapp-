package credential

import (
	"log"
	"net/http"

	"centralapp/backend/centralizeaudit/auditcredential"
)

func getIP(r *http.Request) string {
	ip := r.Header.Get("X-Forwarded-For")
	if ip == "" {
		ip = r.Header.Get("X-Real-IP")
	}
	if ip == "" {
		ip = r.RemoteAddr
	}
	return ip
}

func logOTPSent(email string, r *http.Request) {
	log.Printf("[LOGIN] OTP sent to %s from IP %s", email, getIP(r))
	auditcredential.LogOTPSent(email, r)
}

func logOTPVerified(email string, r *http.Request) {
	log.Printf("[LOGIN] OTP verified for %s from IP %s", email, getIP(r))
	auditcredential.LogOTPVerified(email, r)
}

func logTOTPVerified(email string, r *http.Request) {
	log.Printf("[LOGIN] TOTP verified for %s from IP %s", email, getIP(r))
	auditcredential.LogTOTPVerified(email, r)
}

func logTOTPSetup(email string, r *http.Request) {
	log.Printf("[TOTP] Setup enabled for %s", email)
	auditcredential.LogTOTPSetup(email, r)
}

func logTOTPDisabled(email string, r *http.Request) {
	log.Printf("[TOTP] Disabled for %s", email)
	auditcredential.LogTOTPDisabled(email, r)
}

func logLogout(email string, r *http.Request) {
	log.Printf("[LOGOUT] %s from IP %s", email, getIP(r))
	auditcredential.LogLogout(email, r)
}
