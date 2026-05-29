package utils

import (
	"crypto/hmac"
	"crypto/rand"
	"crypto/sha1"
	"encoding/base32"
	"encoding/binary"
	"fmt"
	"time"
)

func GenerateTOTPSecret() string {
	b := make([]byte, 20)
	rand.Read(b)
	return base32.StdEncoding.WithPadding(base32.NoPadding).EncodeToString(b)
}

func GenerateTOTPURI(email, secret string) string {
	return fmt.Sprintf("otpauth://totp/CentralApp:%s?secret=%s&issuer=CentralApp&algorithm=SHA1&digits=6&period=30", email, secret)
}

func ValidateTOTP(secret, code string) bool {
	key, err := base32.StdEncoding.WithPadding(base32.NoPadding).DecodeString(secret)
	if err != nil {
		return false
	}
	counter := time.Now().Unix() / 30
	for i := int64(-1); i <= 1; i++ {
		if generateTOTPCode(key, counter+i) == code {
			return true
		}
	}
	return false
}

func generateTOTPCode(key []byte, counter int64) string {
	buf := make([]byte, 8)
	binary.BigEndian.PutUint64(buf, uint64(counter))

	mac := hmac.New(sha1.New, key)
	mac.Write(buf)
	hash := mac.Sum(nil)

	offset := hash[len(hash)-1] & 0x0F
	code := binary.BigEndian.Uint32(hash[offset:offset+4]) & 0x7FFFFFFF
	return fmt.Sprintf("%06d", code%1000000)
}
