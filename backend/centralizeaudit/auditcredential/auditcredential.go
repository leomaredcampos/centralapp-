package auditcredential

import (
	"net/http"

	"centralapp/backend/centralizeaudit"
)

func LogOTPSent(email string, r *http.Request) {
	centralizeaudit.LogAction(email, "otp_sent", "credential", "", r)
}

func LogOTPVerified(email string, r *http.Request) {
	centralizeaudit.LogAction(email, "login_otp", "credential", "", r)
}

func LogTOTPVerified(email string, r *http.Request) {
	centralizeaudit.LogAction(email, "login_totp", "2fa", "", r)
}

func LogTOTPSetup(email string, r *http.Request) {
	centralizeaudit.LogAction(email, "totp_setup", "2fa", "", r)
}

func LogTOTPDisabled(email string, r *http.Request) {
	centralizeaudit.LogAction(email, "totp_disabled", "2fa", "", r)
}

func LogLogout(email string, r *http.Request) {
	centralizeaudit.LogAction(email, "logout", "credential", "", r)
}
