package email

import "net/http"

func RegisterHandlers() {
	http.HandleFunc("/api/login", HandleLogin)
}
