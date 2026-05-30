package utils

import (
	"crypto/tls"
	"fmt"
	"net"
	"net/smtp"
	"os"
	"strings"
)

// loginAuth implements smtp.Auth for the LOGIN auth mechanism (required by Gmail).
type loginAuth struct {
	username, password string
}

func LoginAuth(username, password string) smtp.Auth {
	return &loginAuth{username, password}
}

func (a *loginAuth) Start(server *smtp.ServerInfo) (string, []byte, error) {
	return "LOGIN", nil, nil
}

func (a *loginAuth) Next(fromServer []byte, more bool) ([]byte, error) {
	if more {
		msg := string(fromServer)
		switch {
		case strings.Contains(msg, "Username"):
			return []byte(a.username), nil
		case strings.Contains(msg, "Password"):
			return []byte(a.password), nil
		default:
			return nil, fmt.Errorf("unexpected server challenge: %s", msg)
		}
	}
	return nil, nil
}

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

	// Dial the SMTP server with STARTTLS
	tlsConfig := &tls.Config{
		ServerName: smtpHost,
	}

	conn, err := net.Dial("tcp", smtpHost+":"+smtpPort)
	if err != nil {
		return fmt.Errorf("failed to dial SMTP server: %w", err)
	}

	client, err := smtp.NewClient(conn, smtpHost)
	if err != nil {
		conn.Close()
		return fmt.Errorf("failed to create SMTP client: %w", err)
	}
	defer client.Close()

	// Send STARTTLS
	if err = client.StartTLS(tlsConfig); err != nil {
		return fmt.Errorf("failed to start TLS: %w", err)
	}

	// Authenticate using LOGIN auth
	auth := LoginAuth(user, password)
	if err = client.Auth(auth); err != nil {
		return fmt.Errorf("SMTP auth failed: %w", err)
	}

	// Set sender and recipient
	if err = client.Mail(user); err != nil {
		return fmt.Errorf("failed to set sender: %w", err)
	}
	if err = client.Rcpt(to); err != nil {
		return fmt.Errorf("failed to set recipient: %w", err)
	}

	// Send email body
	w, err := client.Data()
	if err != nil {
		return fmt.Errorf("failed to open data writer: %w", err)
	}
	_, err = w.Write([]byte(msg))
	if err != nil {
		return fmt.Errorf("failed to write email body: %w", err)
	}
	err = w.Close()
	if err != nil {
		return fmt.Errorf("failed to close data writer: %w", err)
	}

	return client.Quit()
}
