package login

import (
	"centralapp/backend/credential/login/email"
	"centralapp/backend/credential/login/otp"
)

func RegisterHandlers() {
	email.RegisterHandlers()
	otp.RegisterHandlers()
}
