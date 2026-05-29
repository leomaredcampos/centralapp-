package credential

import (
	"strconv"
	"time"

	"centralapp/backend/redisconnection"
)

const (
	maxAttempts  = 3
	lockDuration = 60 * time.Second
	otpExpiry    = 5 * time.Minute
)

func isLocked(key string) (bool, int) {
	val, err := redisconnection.RDB.Get(redisconnection.Ctx, "lock:"+key).Result()
	if err != nil {
		return false, 0
	}
	ttl := redisconnection.RDB.TTL(redisconnection.Ctx, "lock:"+key).Val()
	remaining, _ := strconv.Atoi(val)
	if remaining >= maxAttempts {
		return true, int(ttl.Seconds())
	}
	return false, 0
}

func recordAttempt(key string) (bool, int) {
	count, _ := redisconnection.RDB.Incr(redisconnection.Ctx, "lock:"+key).Result()
	if count == 1 {
		redisconnection.RDB.Expire(redisconnection.Ctx, "lock:"+key, lockDuration)
	}
	if count >= int64(maxAttempts) {
		redisconnection.RDB.Expire(redisconnection.Ctx, "lock:"+key, lockDuration)
		return true, int(lockDuration.Seconds())
	}
	return false, 0
}

func resetAttempts(key string) {
	redisconnection.RDB.Del(redisconnection.Ctx, "lock:"+key)
}

func setOTPSentAt(email string) {
	redisconnection.RDB.Set(redisconnection.Ctx, "otp_sent:"+email, time.Now().Unix(), otpExpiry)
}

func isOTPExpired(email string) bool {
	val, err := redisconnection.RDB.Get(redisconnection.Ctx, "otp_sent:"+email).Result()
	if err != nil {
		return true
	}
	sentAt, _ := strconv.ParseInt(val, 10, 64)
	return time.Since(time.Unix(sentAt, 0)) > otpExpiry
}

func otpSecondsRemaining(email string) int {
	val, err := redisconnection.RDB.Get(redisconnection.Ctx, "otp_sent:"+email).Result()
	if err != nil {
		return 0
	}
	sentAt, _ := strconv.ParseInt(val, 10, 64)
	remaining := int(otpExpiry.Seconds() - time.Since(time.Unix(sentAt, 0)).Seconds())
	if remaining < 0 {
		return 0
	}
	return remaining
}
