package totp

import (
	"centralapp/backend/credential/totp/disable"
	"centralapp/backend/credential/totp/setup"
	"centralapp/backend/credential/totp/status"
	"centralapp/backend/credential/totp/verify"
)

func RegisterHandlers() {
	setup.RegisterHandlers()
	status.RegisterHandlers()
	disable.RegisterHandlers()
	verify.RegisterHandlers()
}
