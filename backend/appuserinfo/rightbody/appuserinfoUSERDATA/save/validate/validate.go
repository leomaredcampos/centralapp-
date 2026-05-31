package validate

type UserInfo struct {
	Fname                  string
	Lname                  string
	Mname                  string
	Userid                 string
	Emailx                 string
	Useraddress            string
	Usertype               string
	Userdept               string
	Userposition           string
	Usercontact            string
	Usergender             string
	Userbirth              string
	Companyaddress         string
	Usercontactinemergency string
	Userpersoncontactno    string
	Companycontact1        string
	Companycontact2        string
}

func ValidateRequiredFields(req *UserInfo) error {
	if req.Fname == "" || req.Lname == "" || req.Mname == "" || req.Userid == "" ||
		req.Emailx == "" || req.Useraddress == "" || req.Usertype == "" ||
		req.Userdept == "" || req.Userposition == "" || req.Usercontact == "" ||
		req.Usergender == "" || req.Userbirth == "" || req.Companyaddress == "" ||
		req.Usercontactinemergency == "" || req.Userpersoncontactno == "" {
		return &ValidationError{"missing required fields"}
	}

	if req.Companycontact1 == "" && req.Companycontact2 == "" {
		return &ValidationError{"at least one company contact is required"}
	}

	return nil
}

type ValidationError struct {
	Message string
}

func (e *ValidationError) Error() string {
	return e.Message
}
