package credential

import (
	"time"

	"centralapp/backend/utils"
)

func StartSessionExpiryChecker() {
	go func() {
		for {
			time.Sleep(1 * time.Minute)
			expireOTPSessions()
			expireTOTPSessions()
		}
	}()
}

func expireOTPSessions() {
	if utils.DB == nil {
		return
	}
	utils.DB.Exec(`
		UPDATE userinfotbl 
		SET otpstatus='', otpkey=''
		WHERE otpstatus='locked'
		AND otplogindate IS NOT NULL
		AND otplogindate < NOW() - INTERVAL '1 day'
	`)
}

func expireTOTPSessions() {
	if utils.DB == nil {
		return
	}
	utils.DB.Exec(`
		DELETE FROM usertotp_sessions
		WHERE datemade < NOW() - INTERVAL '1 day'
	`)
}
