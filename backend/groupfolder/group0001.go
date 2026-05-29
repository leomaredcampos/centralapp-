package groupfolder

import (
	"centralapp/backend/apps"
	"centralapp/backend/appuserinfo/rightbody/appuserinfoUSERDATA"
	"centralapp/backend/centralizeaudit"
	"centralapp/backend/credential"
	"centralapp/backend/redisconnection"
	"centralapp/backend/userinfouserdata"
	"centralapp/backend/utils"
)

func Group0001() {
	utils.ConnectDB()
	redisconnection.RegisterRoutes()
	utils.RegisterRoutes()
	credential.RegisterRoutes()
	centralizeaudit.RegisterRoutes()
	apps.RegisterRoutes()
	appuserinfoUSERDATA.RegisterRoutes()
	userinfouserdata.RegisterRoutes()
}
