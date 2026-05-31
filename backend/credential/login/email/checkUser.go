package email

import (
	"database/sql"

	"centralapp/backend/utils"
)

func CheckUser(email string) (exists bool, totpRequired bool, locked bool, err error) {
	var id int64
	var otpstatus, totpval, totpverified string
	err = utils.DB.QueryRow("SELECT id, COALESCE(otpstatus,''), COALESCE(totp,''), COALESCE(totpverified,'') FROM userinfotbl WHERE emailx=$1", email).Scan(&id, &otpstatus, &totpval, &totpverified)
	
	if err == sql.ErrNoRows {
		return false, false, false, nil
	}
	if err != nil {
		return false, false, false, err
	}

	if totpval != "" && totpverified == "yes" {
		return true, true, false, nil
	}

	if otpstatus == "locked" {
		return true, false, true, nil
	}

	return true, false, false, nil
}
