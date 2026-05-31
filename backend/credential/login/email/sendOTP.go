package email

import (
	"net/http"

	"centralapp/backend/utils"
)

func SendOTP(email string, r *http.Request) error {
	otp := utils.GenerateOTP()
	_, err := utils.DB.Exec("UPDATE userinfotbl SET otpkey=$1 WHERE emailx=$2", otp, email)
	if err != nil {
		return err
	}

	if err := utils.SendOTPEmail(email, otp); err != nil {
		return err
	}

	logOTPSent(email, r)
	return nil
}

func logOTPSent(email string, r *http.Request) {
	utils.DB.Exec("INSERT INTO centralizeaudittbl (emailx, action, ipaddress) VALUES ($1, 'OTP Sent', $2)", email, r.RemoteAddr)
}
