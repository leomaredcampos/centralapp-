package insertUser

import (
	"time"

	"centralapp/backend/utils"
)

type UserInfo struct {
	Fname                  string
	Lname                  string
	Mname                  string
	Sname                  string
	Userid                 string
	Emailx                 string
	Usertin                string
	Userpagibig            string
	Userss                 string
	Userphilihealth        string
	Useraddress            string
	Usertype               string
	Userdept               string
	Userposition           string
	Usercontact            string
	Usergender             string
	Userbirth              string
	Companyid              string
	Companyname            string
	Companytype1           string
	Companytype2           string
	Businesstype           string
	Companytin             string
	Companycontact1        string
	Companycontact2        string
	Companyaddress         string
	Companyemail1          string
	Companyemail2          string
	Companysite            string
	Companymainlogo        string
	Companyloginlogo       string
	Userlevel              string
	Userheight             string
	Userweight             string
	Userreligion           string
	Userbio                string
	Usercontactinemergency string
	Userpersoncontactno    string
	Writeremail            string
}

func InsertUser(req *UserInfo) error {
	userbirth, err := time.Parse("2006-01-02", req.Userbirth)
	if err != nil {
		return err
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
	return err
}
