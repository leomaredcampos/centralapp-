package utils

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
)

var DB *sql.DB

func ConnectDB() {
	if err := godotenv.Load("utils/.env"); err != nil {
		log.Println("No .env file found, using environment variables")
	}

	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		dsn = fmt.Sprintf(
			"host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
			os.Getenv("DB_HOST"),
			os.Getenv("DB_PORT"),
			os.Getenv("DB_USER"),
			os.Getenv("DB_PASSWORD"),
			os.Getenv("DB_NAME"),
			os.Getenv("DB_SSLMODE"),
		)
	}

	var err error
	DB, err = sql.Open("postgres", dsn)
	if err != nil {
		log.Fatal("Failed to open DB:", err)
	}

	if err = DB.Ping(); err != nil {
		log.Fatal("Failed to connect to DB:", err)
	}

	log.Println("Connected to centraldb")
}

func CloseDB() {
	if DB != nil {
		DB.Close()
	}
}
