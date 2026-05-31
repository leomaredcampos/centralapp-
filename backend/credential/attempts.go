package credential

import (
	"database/sql"
	"log"
	"time"

	"centralapp/backend/utils"
)

const (
	maxAttempts  = 3
	lockDuration = 60 * time.Second
	otpExpiry    = 5 * time.Minute
)

func IsLocked(key string) (bool, int) {
	var count int
	var lockedAt sql.NullTime
	err := utils.DB.QueryRow("SELECT count, locked_at FROM login_attempts WHERE keyx=$1", key).Scan(&count, &lockedAt)
	if err != nil {
		return false, 0
	}
	if count >= maxAttempts && lockedAt.Valid {
		remaining := int(lockDuration.Seconds() - time.Since(lockedAt.Time).Seconds())
		if remaining > 0 {
			return true, remaining
		}
		utils.DB.Exec("DELETE FROM login_attempts WHERE keyx=$1", key)
	}
	return false, 0
}

func RecordAttempt(key string) (bool, int) {
	_, err := utils.DB.Exec(`
		INSERT INTO login_attempts (keyx, count, locked_at)
		VALUES ($1, 1, NULL)
		ON CONFLICT (keyx) DO UPDATE SET count = login_attempts.count + 1
	`, key)
	if err != nil {
		log.Printf("recordAttempt error: %v", err)
		return false, 0
	}

	var count int
	utils.DB.QueryRow("SELECT count FROM login_attempts WHERE keyx=$1", key).Scan(&count)

	if count >= maxAttempts {
		utils.DB.Exec("UPDATE login_attempts SET locked_at=$1 WHERE keyx=$2", time.Now(), key)
		return true, int(lockDuration.Seconds())
	}
	return false, 0
}

func ResetAttempts(key string) {
	utils.DB.Exec("DELETE FROM login_attempts WHERE keyx=$1", key)
}

func SetOTPSentAt(email string) {
	utils.DB.Exec(`
		INSERT INTO login_attempts (keyx, otp_sent_at)
		VALUES ($1, $2)
		ON CONFLICT (keyx) DO UPDATE SET otp_sent_at = $2
	`, email, time.Now())
}

func IsOTPExpired(email string) bool {
	var otpSentAt sql.NullTime
	err := utils.DB.QueryRow("SELECT otp_sent_at FROM login_attempts WHERE keyx=$1", email).Scan(&otpSentAt)
	if err != nil || !otpSentAt.Valid {
		return true
	}
	return time.Since(otpSentAt.Time) > otpExpiry
}

func OTPSecondsRemaining(email string) int {
	var otpSentAt sql.NullTime
	err := utils.DB.QueryRow("SELECT otp_sent_at FROM login_attempts WHERE keyx=$1", email).Scan(&otpSentAt)
	if err != nil || !otpSentAt.Valid {
		return 0
	}
	remaining := int(otpExpiry.Seconds() - time.Since(otpSentAt.Time).Seconds())
	if remaining < 0 {
		return 0
	}
	return remaining
}
