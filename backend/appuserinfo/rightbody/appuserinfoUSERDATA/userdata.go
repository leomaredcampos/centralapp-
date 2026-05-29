package appuserinfoUSERDATA

import (
	"net/http"

	"centralapp/backend/appuserinfo/rightbody/appuserinfoUSERDATA/grid"
	"centralapp/backend/appuserinfo/rightbody/appuserinfoUSERDATA/save"
	"centralapp/backend/appuserinfo/rightbody/appuserinfoUSERDATA/upload"
)

func RegisterRoutes() {
	http.HandleFunc("/api/appuserinfo/save", save.HandleSaveUserInfo)
	http.HandleFunc("/api/appuserinfo/list", grid.HandleListUsers)
	http.HandleFunc("/api/appuserinfo/upload", upload.HandleUploadFiles)
}
