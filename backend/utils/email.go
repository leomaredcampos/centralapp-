package utils

import (
	"fmt"
	"log"
	"net/smtp"
	"os"
)

func SendOTPEmail(to, otp string) error {
	user := os.Getenv("EMAIL_USER")
	password := os.Getenv("EMAIL_PASSWORD")
	smtpHost := os.Getenv("EMAIL_SMTP")
	if smtpHost == "" {
		smtpHost = "smtp.gmail.com"
	}
	smtpPort := os.Getenv("EMAIL_PORT")
	if smtpPort == "" {
		smtpPort = "587"
	}

	log.Printf("Sending email - User: %s, Host: %s, Port: %s, Password length: %d", user, smtpHost, smtpPort, len(password))

	msg := fmt.Sprintf("From: %s\r\nTo: %s\r\nSubject: Your OTP Code\r\n\r\nYour OTP code is: %s", user, to, otp)

	auth := smtp.PlainAuth("", user, password, smtpHost)
	err := smtp.SendMail(smtpHost+":"+smtpPort, auth, user, []string{to}, []byte(msg))
	if err != nil {
		log.Printf("Email send error: %v", err)
	}
	return err
}
