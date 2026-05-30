package utils

import (
	"fmt"
	"net/smtp"
	"os"
	"strings"
)

type loginAuth struct {
	user, pass string
}

func LoginAuth(user, pass string) smtp.Auth {
	return &loginAuth{user, pass}
}

func (a *loginAuth) Start(_ *smtp.ServerInfo) (string, []byte, error) {
	return "LOGIN", nil, nil
}

func (a *loginAuth) Next(fromServer []byte, more bool) ([]byte, error) {
	if !more {
		return nil, nil
	}
	switch strings.ToLower(string(fromServer)) {
	case "username:", "username", "user name:", "user name":
		return []byte(a.user), nil
	case "password:", "password":
		return []byte(a.pass), nil
	default:
		return nil, fmt.Errorf("unexpected challenge: %s", string(fromServer))
	}
}

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

	msg := fmt.Sprintf("From: %s\r\nTo: %s\r\nSubject: Your OTP Code\r\n\r\nYour OTP code is: %s", user, to, otp)

	auth := LoginAuth(user, password)
	return smtp.SendMail(smtpHost+":"+smtpPort, auth, user, []string{to}, []byte(msg))
}
