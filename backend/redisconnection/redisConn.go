package redisconnection

import (
	"context"
	"log"
	"os"

	"github.com/redis/go-redis/v9"
)

var RDB *redis.Client
var Ctx = context.Background()

func connectRedis() {
	addr := os.Getenv("REDIS_URL")
	if addr == "" {
		addr = "localhost:6379"
	}

	RDB = redis.NewClient(&redis.Options{
		Addr: addr,
	})

	if err := RDB.Ping(Ctx).Err(); err != nil {
		log.Println("Warning: Redis not available, attempt tracking disabled:", err)
		RDB = nil
		return
	}

	log.Println("Connected to Redis")
}
