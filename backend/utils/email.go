package utils

import (
	"fmt"
	"log"
	"os"

	"github.com/sendgrid/sendgrid-go"
	"github.com/sendgrid/sendgrid-go/helpers/mail"
)

func SendOTPEmail(to, otp string) error {
	apiKey := os.Getenv("SENDGRID_API_KEY")
	if apiKey == "" {
		return fmt.Errorf("SENDGRID_API_KEY not set")
	}

	fromEmail := os.Getenv("EMAIL_USER")
	if fromEmail == "" {
		fromEmail = "noreply@yourdomain.com"
	}

	from := mail.NewEmail("CentralApp", fromEmail)
	subject := "Your OTP Code"
	toEmail := mail.NewEmail("", to)
	plainTextContent := fmt.Sprintf("Your OTP code is: %s", otp)
	htmlContent := fmt.Sprintf("<strong>Your OTP code is: %s</strong>", otp)
	message := mail.NewSingleEmail(from, subject, toEmail, plainTextContent, htmlContent)

	client := sendgrid.NewSendClient(apiKey)
	response, err := client.Send(message)
	if err != nil {
		log.Printf("SendGrid error: %v", err)
		return err
	}

	if response.StatusCode >= 400 {
		log.Printf("SendGrid failed with status %d: %s", response.StatusCode, response.Body)
		return fmt.Errorf("failed to send email: status %d", response.StatusCode)
	}

	log.Printf("Email sent successfully to %s via SendGrid", to)
	return nil
}
