package credential

import (
	"strconv"
	"sync"
	"time"

	"centralapp/backend/redisconnection"
)

const (
	maxAttempts  = 3
	lockDuration = 60 * time.Second
	otpExpiry    = 5 * time.Minute
)

// in-memory fallback when Redis is not available
var (
	memAttempts = map[string]*memRecord{}
	memMu       sync.Mutex
)

type memRecord struct {
	count     int
	lockedAt  time.Time
	otpSentAt time.Time
}

func getMemRecord(key string) *memRecord {
	if memAttempts[key] == nil {
		memAttempts[key] = &memRecord{}
	}
	return memAttempts[key]
}

func isLocked(key string) (bool, int) {
	if redisconnection.RDB == nil {
		memMu.Lock()
		defer memMu.Unlock()
		r := getMemRecord(key)
		if r.count >= maxAttempts {
			remaining := int(lockDuration.Seconds() - time.Since(r.lockedAt).Seconds())
			if remaining > 0 {
				return true, remaining
			}
			r.count = 0
		}
		return false, 0
	}
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
	if redisconnection.RDB == nil {
		memMu.Lock()
		defer memMu.Unlock()
		r := getMemRecord(key)
		r.count++
		if r.count >= maxAttempts {
			r.lockedAt = time.Now()
			return true, int(lockDuration.Seconds())
		}
		return false, 0
	}
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
	if redisconnection.RDB == nil {
		memMu.Lock()
		defer memMu.Unlock()
		delete(memAttempts, key)
		return
	}
	redisconnection.RDB.Del(redisconnection.Ctx, "lock:"+key)
}

func setOTPSentAt(email string) {
	if redisconnection.RDB == nil {
		memMu.Lock()
		defer memMu.Unlock()
		getMemRecord(email).otpSentAt = time.Now()
		return
	}
	redisconnection.RDB.Set(redisconnection.Ctx, "otp_sent:"+email, time.Now().Unix(), otpExpiry)
}

func isOTPExpired(email string) bool {
	if redisconnection.RDB == nil {
		memMu.Lock()
		defer memMu.Unlock()
		r := getMemRecord(email)
		if r.otpSentAt.IsZero() {
			return true
		}
		return time.Since(r.otpSentAt) > otpExpiry
	}
	val, err := redisconnection.RDB.Get(redisconnection.Ctx, "otp_sent:"+email).Result()
	if err != nil {
		return true
	}
	sentAt, _ := strconv.ParseInt(val, 10, 64)
	return time.Since(time.Unix(sentAt, 0)) > otpExpiry
}

func otpSecondsRemaining(email string) int {
	if redisconnection.RDB == nil {
		memMu.Lock()
		defer memMu.Unlock()
		r := getMemRecord(email)
		if r.otpSentAt.IsZero() {
			return 0
		}
		remaining := int(otpExpiry.Seconds() - time.Since(r.otpSentAt).Seconds())
		if remaining < 0 {
			return 0
		}
		return remaining
	}
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
