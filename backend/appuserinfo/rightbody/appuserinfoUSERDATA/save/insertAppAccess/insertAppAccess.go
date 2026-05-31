package insertAppAccess

import (
	"fmt"
	"time"

	"centralapp/backend/utils"
)

type UserInfo struct {
	Emailx       string
	Writeremail  string
	SelectedApps []string
}

func InsertAppAccess(emailx, writeremail string, selectedApps []string) {
	for _, appname := range selectedApps {
		utils.DB.Exec(
			fmt.Sprintf(`INSERT INTO appaccess (emailx, writeremail, writemade, datemade, %s) VALUES ($1, $2, 'Inserted', $3, 'Yes')`, appname),
			emailx, writeremail, time.Now(),
		)
	}
}
