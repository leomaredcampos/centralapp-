package otp

import (
	"net/http"
	"strings"

	"centralapp/backend/utils"
)

func VerifyOTP(email, otpCode string, r *http.Request) (valid bool, err error) {
	var otpkey string
	err = utils.DB.QueryRow("SELECT otpkey FROM userinfotbl WHERE emailx=$1", email).Scan(&otpkey)
	if err != nil {
		return false, err
	}

	if strings.TrimSpace(otpkey) != strings.TrimSpace(otpCode) {
		return false, nil
	}

	_, err = utils.DB.Exec("UPDATE userinfotbl SET otpstatus='locked', otplogindate=NOW() WHERE emailx=$1", email)
	if err != nil {
		return false, err
	}

	logOTPVerified(email, r)
	return true, nil
}

func logOTPVerified(email string, r *http.Request) {
	utils.DB.Exec("INSERT INTO centralizeaudittbl (emailx, action, ipaddress) VALUES ($1, 'OTP Verified', $2)", email, r.RemoteAddr)
}
