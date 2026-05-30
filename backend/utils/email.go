package utils

import (
	"crypto/tls"
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
		smtpPort = "465"
	}

	log.Printf("Sending email - User: %s, Host: %s, Port: %s, Password length: %d", user, smtpHost, smtpPort, len(password))

	msg := fmt.Sprintf("From: %s\r\nTo: %s\r\nSubject: Your OTP Code\r\n\r\nYour OTP code is: %s", user, to, otp)

	auth := smtp.PlainAuth("", user, password, smtpHost)
	
	tlsConfig := &tls.Config{
		InsecureSkipVerify: false,
		ServerName:         smtpHost,
	}

	conn, err := tls.Dial("tcp", smtpHost+":"+smtpPort, tlsConfig)
	if err != nil {
		log.Printf("TLS dial error: %v", err)
		return err
	}
	defer conn.Close()

	client, err := smtp.NewClient(conn, smtpHost)
	if err != nil {
		log.Printf("SMTP client error: %v", err)
		return err
	}
	defer client.Quit()

	if err = client.Auth(auth); err != nil {
		log.Printf("Auth error: %v", err)
		return err
	}

	if err = client.Mail(user); err != nil {
		log.Printf("Mail from error: %v", err)
		return err
	}

	if err = client.Rcpt(to); err != nil {
		log.Printf("Rcpt to error: %v", err)
		return err
	}

	w, err := client.Data()
	if err != nil {
		log.Printf("Data error: %v", err)
		return err
	}

	_, err = w.Write([]byte(msg))
	if err != nil {
		log.Printf("Write error: %v", err)
		return err
	}

	err = w.Close()
	if err != nil {
		log.Printf("Close error: %v", err)
		return err
	}

	log.Printf("Email sent successfully to %s", to)
	return nil
}
