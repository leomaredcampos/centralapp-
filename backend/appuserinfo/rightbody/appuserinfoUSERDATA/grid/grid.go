package grid

import (
	"encoding/json"
	"net/http"

	"centralapp/backend/utils"
)

type User struct {
	Emailx         string `json:"emailx"`
	Fname          string `json:"fname"`
	Lname          string `json:"lname"`
	Writemade      string `json:"writemade"`
	Datemade       string `json:"datemade"`
	Expirationdate string `json:"expirationdate"`
	Writeremail    string `json:"writeremail"`
}

func HandleListUsers(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	rows, err := utils.DB.Query(`SELECT emailx, fname, lname, COALESCE(writemade,'') as writemade, COALESCE(TO_CHAR(datemade,'YYYY-MM-DD'),'') as datemade, COALESCE(TO_CHAR(expirationdate,'YYYY-MM-DD'),'') as expirationdate, COALESCE(writeremail,'') as writeremail FROM userinfotbl WHERE COALESCE(writemade,'') != 'deleted' ORDER BY lname, fname`)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": "db error"})
		return
	}
	defer rows.Close()

	var list []User
	for rows.Next() {
		var u User
		if err := rows.Scan(&u.Emailx, &u.Fname, &u.Lname, &u.Writemade, &u.Datemade, &u.Expirationdate, &u.Writeremail); err != nil {
			continue
		}
		list = append(list, u)
	}
	if list == nil {
		list = []User{}
	}
	json.NewEncoder(w).Encode(list)
}
