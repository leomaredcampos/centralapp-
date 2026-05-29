package utils

import (
	"fmt"
	"net/smtp"
	"os"
	"strings"
)

func SendOTPEmail(to, otp string) error {
	user := os.Getenv("EMAIL_USER")
	password := strings.ReplaceAll(os.Getenv("EMAIL_PASSWORD"), " ", "")
	smtpHost := os.Getenv("EMAIL_SMTP")
	if smtpHost == "" {
		smtpHost = "smtp.gmail.com"
	}
	smtpPort := os.Getenv("EMAIL_PORT")
	if smtpPort == "" {
		smtpPort = "587"
	}

	msg := fmt.Sprintf("From: %s\r\nTo: %s\r\nSubject: Your OTP Code\r\n\r\nYour OTP code is: %s", user, to, otp)

	auth := smtp.PlainAuth("", user, password, smtpHost)
	return smtp.SendMail(smtpHost+":"+smtpPort, auth, user, []string{to}, []byte(msg))
}
