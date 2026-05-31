package groupfolder

import (
	"centralapp/backend/apps"
	"centralapp/backend/appuserinfo/rightbody/appuserinfoUSERDATA"
	"centralapp/backend/centralizeaudit"
	"centralapp/backend/companyfile"
	"centralapp/backend/credential"
	"centralapp/backend/credential/login"
	"centralapp/backend/credential/totp"
	"centralapp/backend/userinfouserdata"
	"centralapp/backend/utils"
)

func Group0001() {
	utils.ConnectDB()
	utils.RegisterRoutes()
	credential.RegisterRoutes()
	login.RegisterHandlers()
	totp.RegisterHandlers()
	centralizeaudit.RegisterRoutes()
	apps.RegisterRoutes()
	appuserinfoUSERDATA.RegisterRoutes()
	userinfouserdata.RegisterRoutes()
	companyfile.RegisterRoutes()
}
