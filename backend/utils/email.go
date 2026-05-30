package utils

import (
	"crypto/tls"
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
	msg := strings.ToLower(string(fromServer))
	if strings.Contains(msg, "username") || strings.Contains(msg, "user name") {
		return []byte(a.user), nil
	}
	if strings.Contains(msg, "password") {
		return []byte(a.pass), nil
	}
	return nil, fmt.Errorf("unexpected server challenge: %s", string(fromServer))
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
		smtpPort = "465"
	}

	tlsConfig := &tls.Config{ServerName: smtpHost}

	// Connect directly with TLS on port 465
	conn, err := tls.Dial("tcp", smtpHost+":"+smtpPort, tlsConfig)
	if err != nil {
		return fmt.Errorf("tls dial failed: %w", err)
	}

	client, err := smtp.NewClient(conn, smtpHost)
	if err != nil {
		conn.Close()
		return fmt.Errorf("smtp client failed: %w", err)
	}
	defer client.Close()

	auth := LoginAuth(user, password)
	if err = client.Auth(auth); err != nil {
		return fmt.Errorf("auth failed: %w", err)
	}

	if err = client.Mail(user); err != nil {
		return fmt.Errorf("mail from failed: %w", err)
	}
	if err = client.Rcpt(to); err != nil {
		return fmt.Errorf("rcpt failed: %w", err)
	}

	w, err := client.Data()
	if err != nil {
		return fmt.Errorf("data failed: %w", err)
	}

	msg := fmt.Sprintf("From: %s\r\nTo: %s\r\nSubject: Your OTP Code\r\n\r\nYour OTP code is: %s", user, to, otp)
	_, err = w.Write([]byte(msg))
	if err != nil {
		w.Close()
		return fmt.Errorf("write failed: %w", err)
	}
	w.Close()

	return client.Quit()
}
