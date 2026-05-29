package credential

import (
	"encoding/json"
	"net/http"

	"centralapp/backend/utils"
)

func HandleLogout(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	if r.Method != http.MethodPost {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}

	var req struct {
		Email string `json:"email"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "invalid request"})
		return
	}

	_, err := utils.DB.Exec("UPDATE userinfotbl SET otpstatus='', otpkey='' WHERE emailx=$1", req.Email)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": "failed to logout"})
		return
	}

	logLogout(req.Email, r)
	json.NewEncoder(w).Encode(map[string]string{"status": "logged_out"})
}
