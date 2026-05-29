package save

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"centralapp/backend/utils"
)

type UserInfo struct {
	Fname                  string   `json:"fname"`
	Lname                  string   `json:"lname"`
	Mname                  string   `json:"mname"`
	Sname                  string   `json:"sname"`
	Userid                 string   `json:"userid"`
	Emailx                 string   `json:"emailx"`
	Usertin                string   `json:"usertin"`
	Userpagibig            string   `json:"userpagibig"`
	Userss                 string   `json:"userss"`
	Userphilihealth        string   `json:"userphilihealth"`
	Useraddress            string   `json:"useraddress"`
	Usertype               string   `json:"usertype"`
	Userdept               string   `json:"userdept"`
	Userposition           string   `json:"userposition"`
	Usercontact            string   `json:"usercontact"`
	Usergender             string   `json:"usergender"`
	Userbirth              string   `json:"userbirth"`
	Companyid              string   `json:"companyid"`
	Companyname            string   `json:"companyname"`
	Companytype1           string   `json:"companytype1"`
	Companytype2           string   `json:"companytype2"`
	Businesstype           string   `json:"businesstype"`
	Companytin             string   `json:"companytin"`
	Companycontact1        string   `json:"companycontact1"`
	Companycontact2        string   `json:"companycontact2"`
	Companyaddress         string   `json:"companyaddress"`
	Companyemail1          string   `json:"companyemail1"`
	Companyemail2          string   `json:"companyemail2"`
	Companysite            string   `json:"companysite"`
	Companymainlogo        string   `json:"companymainlogo"`
	Companyloginlogo       string   `json:"companyloginlogo"`
	Userlevel              string   `json:"userlevel"`
	Userheight             string   `json:"userheight"`
	Userweight             string   `json:"userweight"`
	Userreligion           string   `json:"userreligion"`
	Userbio                string   `json:"userbio"`
	Usercontactinemergency string   `json:"usercontactinemergency"`
	Userpersoncontactno    string   `json:"userpersoncontactno"`
	Writeremail            string   `json:"writeremail"`
	SelectedApps           []string `json:"selectedApps"`
}

func HandleSaveUserInfo(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	if r.Method != http.MethodPost {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}

	var req UserInfo
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "invalid request"})
		return
	}

	if req.Fname == "" || req.Lname == "" || req.Mname == "" || req.Userid == "" ||
		req.Emailx == "" || req.Useraddress == "" || req.Usertype == "" ||
		req.Userdept == "" || req.Userposition == "" || req.Usercontact == "" ||
		req.Usergender == "" || req.Userbirth == "" || req.Companyaddress == "" ||
		req.Usercontactinemergency == "" || req.Userpersoncontactno == "" {
		json.NewEncoder(w).Encode(map[string]string{"error": "missing required fields"})
		return
	}

	if req.Companycontact1 == "" && req.Companycontact2 == "" {
		json.NewEncoder(w).Encode(map[string]string{"error": "at least one company contact is required"})
		return
	}

	userbirth, err := time.Parse("2006-01-02", req.Userbirth)
	if err != nil {
		json.NewEncoder(w).Encode(map[string]string{"error": "invalid birthdate format"})
		return
	}

	_, err = utils.DB.Exec(`
		INSERT INTO userinfotbl (
			fname, lname, mname, sname, userid, emailx,
			usertin, userpagibig, userss, userphilihealth,
			useraddress, usertype, userdept, userposition,
			usercontact, usergender, userbirth,
			companyid, companyname, companytype1, companytype2,
			businesstype, companytin, companycontact1, companycontact2,
			companyaddress, companyemail1, companyemail2, companysite,
			companymainlogo, companyloginlogo,
			usercontactinemergency, userpersoncontactno, userlevel,
			userheight, userweight, userreligion, userbio,
			writeremail, writemade, datemade
		) VALUES (
			$1,$2,$3,$4,$5,$6,$7,$8,$9,$10,
			$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,
			$21,$22,$23,$24,$25,$26,$27,$28,$29,$30,
			$31,$32,$33,$34,$35,$36,$37,$38,$39,'Inserted',$40
		)`,
		req.Fname, req.Lname, req.Mname, req.Sname, req.Userid, req.Emailx,
		req.Usertin, req.Userpagibig, req.Userss, req.Userphilihealth,
		req.Useraddress, req.Usertype, req.Userdept, req.Userposition,
		req.Usercontact, req.Usergender, userbirth,
		req.Companyid, req.Companyname, req.Companytype1, req.Companytype2,
		req.Businesstype, req.Companytin, req.Companycontact1, req.Companycontact2,
		req.Companyaddress, req.Companyemail1, req.Companyemail2, req.Companysite,
		req.Companymainlogo, req.Companyloginlogo,
		req.Usercontactinemergency, req.Userpersoncontactno, req.Userlevel,
		req.Userheight, req.Userweight, req.Userreligion, req.Userbio,
		req.Writeremail, time.Now(),
	)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": "failed to save user"})
		return
	}

	json.NewEncoder(w).Encode(map[string]string{"status": "saved"})

	for _, appname := range req.SelectedApps {
		utils.DB.Exec(
			fmt.Sprintf(`INSERT INTO appaccess (emailx, writeremail, writemade, datemade, %s) VALUES ($1, $2, 'Inserted', $3, 'Yes')`, appname),
			req.Emailx, req.Writeremail, time.Now(),
		)
	}
}
