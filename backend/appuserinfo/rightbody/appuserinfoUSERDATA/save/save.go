package save

import (
	"encoding/json"
	"net/http"

	"centralapp/backend/appuserinfo/rightbody/appuserinfoUSERDATA/save/insertAppAccess"
	"centralapp/backend/appuserinfo/rightbody/appuserinfoUSERDATA/save/insertUser"
	"centralapp/backend/appuserinfo/rightbody/appuserinfoUSERDATA/save/validate"
)

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

	validateReq := &validate.UserInfo{
		Fname: req.Fname, Lname: req.Lname, Mname: req.Mname, Userid: req.Userid,
		Emailx: req.Emailx, Useraddress: req.Useraddress, Usertype: req.Usertype,
		Userdept: req.Userdept, Userposition: req.Userposition, Usercontact: req.Usercontact,
		Usergender: req.Usergender, Userbirth: req.Userbirth, Companyaddress: req.Companyaddress,
		Usercontactinemergency: req.Usercontactinemergency, Userpersoncontactno: req.Userpersoncontactno,
		Companycontact1: req.Companycontact1, Companycontact2: req.Companycontact2,
	}

	if err := validate.ValidateRequiredFields(validateReq); err != nil {
		json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
		return
	}

	insertReq := &insertUser.UserInfo{
		Fname: req.Fname, Lname: req.Lname, Mname: req.Mname, Sname: req.Sname,
		Userid: req.Userid, Emailx: req.Emailx, Usertin: req.Usertin,
		Userpagibig: req.Userpagibig, Userss: req.Userss, Userphilihealth: req.Userphilihealth,
		Useraddress: req.Useraddress, Usertype: req.Usertype, Userdept: req.Userdept,
		Userposition: req.Userposition, Usercontact: req.Usercontact, Usergender: req.Usergender,
		Userbirth: req.Userbirth, Companyid: req.Companyid, Companyname: req.Companyname,
		Companytype1: req.Companytype1, Companytype2: req.Companytype2, Businesstype: req.Businesstype,
		Companytin: req.Companytin, Companycontact1: req.Companycontact1, Companycontact2: req.Companycontact2,
		Companyaddress: req.Companyaddress, Companyemail1: req.Companyemail1, Companyemail2: req.Companyemail2,
		Companysite: req.Companysite, Companymainlogo: req.Companymainlogo, Companyloginlogo: req.Companyloginlogo,
		Userlevel: req.Userlevel, Userheight: req.Userheight, Userweight: req.Userweight,
		Userreligion: req.Userreligion, Userbio: req.Userbio,
		Usercontactinemergency: req.Usercontactinemergency, Userpersoncontactno: req.Userpersoncontactno,
		Writeremail: req.Writeremail,
	}

	if err := insertUser.InsertUser(insertReq); err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": "failed to save user"})
		return
	}

	json.NewEncoder(w).Encode(map[string]string{"status": "saved"})
	insertAppAccess.InsertAppAccess(req.Emailx, req.Writeremail, req.SelectedApps)
}
