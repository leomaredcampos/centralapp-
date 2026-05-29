package utils

import (
	"crypto/rand"
	"math/big"
)

const otpChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*"

func GenerateOTP() string {
	b := make([]byte, 6)
	for i := range b {
		idx, _ := rand.Int(rand.Reader, big.NewInt(int64(len(otpChars))))
		b[i] = otpChars[idx.Int64()]
	}
	return string(b)
}
