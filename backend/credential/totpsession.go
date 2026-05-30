package credential

import (
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	"net/http"
	"time"

	"centralapp/backend/utils"
)

const maxTOTPSessions = 3

func generateSessionID() string {
	b := make([]byte, 16)
	rand.Read(b)
	return hex.EncodeToString(b)
}

func HandleCheckTOTPSession(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	if r.Method != http.MethodPost {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}

	var req struct {
		Email     string `json:"email"`
		SessionID string `json:"sessionid"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "invalid request"})
		return
	}

	var count int
	err := utils.DB.QueryRow("SELECT COUNT(*) FROM usertotp_sessions WHERE emailx=$1 AND sessionid=$2", req.Email, req.SessionID).Scan(&count)
	if err != nil || count == 0 {
		json.NewEncoder(w).Encode(map[string]string{"status": "invalid"})
		return
	}

	json.NewEncoder(w).Encode(map[string]string{"status": "valid"})
}

func HandleDeleteTOTPSession(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	if r.Method != http.MethodPost {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}

	var req struct {
		Email     string `json:"email"`
		SessionID string `json:"sessionid"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "invalid request"})
		return
	}

	utils.DB.Exec("DELETE FROM usertotp_sessions WHERE emailx=$1 AND sessionid=$2", req.Email, req.SessionID)
	json.NewEncoder(w).Encode(map[string]string{"status": "deleted"})
}

func createTOTPSession(email string) (string, error) {
	// Check max sessions
	var count int
	utils.DB.QueryRow("SELECT COUNT(*) FROM usertotp_sessions WHERE emailx=$1", email).Scan(&count)
	if count >= maxTOTPSessions {
		// Delete the oldest session to make room
		_, err := utils.DB.Exec(`
			DELETE FROM usertotp_sessions 
			WHERE datemade = (
				SELECT MIN(datemade) FROM usertotp_sessions 
				WHERE emailx=$1
			)
			AND emailx = $1
		`, email)
		if err != nil {
			return "", err
		}
	}

	sessionid := generateSessionID()
	_, err := utils.DB.Exec("INSERT INTO usertotp_sessions (emailx, sessionid, datemade) VALUES ($1, $2, $3)", email, sessionid, time.Now())
	if err != nil {
		return "", err
	}
	return sessionid, nil
}

func deleteAllTOTPSessions(email string) {
	utils.DB.Exec("DELETE FROM usertotp_sessions WHERE emailx=$1", email)
}
