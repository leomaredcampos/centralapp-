package apps

import (
	"encoding/json"
	"fmt"
	"net/http"

	"centralapp/backend/utils"
)

type App struct {
	AppName    string `json:"appname"`
	ButtonName string `json:"buttonname"`
}

func RegisterRoutes() {
	http.HandleFunc("/api/get-apps", HandleGetApps)
	http.HandleFunc("/api/get-available-apps", HandleGetAvailableApps)
}

func HandleGetAvailableApps(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	rows, err := utils.DB.Query(`SELECT appname, buttonname FROM apptbl WHERE appstatus != 'deleted'`)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": "db error"})
		return
	}
	defer rows.Close()

	var list []App
	for rows.Next() {
		var a App
		if err := rows.Scan(&a.AppName, &a.ButtonName); err != nil {
			continue
		}
		list = append(list, a)
	}
	if list == nil {
		list = []App{}
	}
	json.NewEncoder(w).Encode(list)
}

func HandleGetApps(w http.ResponseWriter, r *http.Request) {
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

	// Get all active apps
	appRows, err := utils.DB.Query(`SELECT appname, buttonname FROM apptbl WHERE appstatus != 'deactivated' ORDER BY buttonname ASC`)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": "db error"})
		return
	}
	defer appRows.Close()

	var appList []App
	for appRows.Next() {
		var app App
		if err := appRows.Scan(&app.AppName, &app.ButtonName); err != nil {
			continue
		}

		// Check if user has access — column name = appname, value must be 'Yes'
		var val string
		query := fmt.Sprintf(`SELECT COALESCE(TRIM(%s),'') FROM appaccess WHERE emailx=$1 AND writemade != 'deleted' LIMIT 1`, app.AppName)
		utils.DB.QueryRow(query, req.Email).Scan(&val)
		if val == "Yes" {
			appList = append(appList, app)
		}
	}

	if appList == nil {
		appList = []App{}
	}

	json.NewEncoder(w).Encode(appList)
}
