package centralizeaudit

import (
	"encoding/json"
	"net"
	"net/http"

	"centralapp/backend/utils"
)

func HandleAuditLog(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	if r.Method != http.MethodPost {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}

	var req struct {
		Email   string `json:"email"`
		Action  string `json:"action"`
		Module  string `json:"module"`
		Details string `json:"details"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	LogAction(req.Email, req.Action, req.Module, req.Details, r)
	json.NewEncoder(w).Encode(map[string]string{"status": "ok"})
}

func RegisterRoutes() {
	http.HandleFunc("/api/audit/log", HandleAuditLog)
}

func LogAction(email, action, module, details string, r *http.Request) {
	ip := getIP(r)
	rdns := getReverseDNS(ip)
	ua := r.UserAgent()

	utils.DB.Exec(
		"INSERT INTO auditlog (emailx, action, module, details, ipaddress, reversedns, useragent) VALUES ($1,$2,$3,$4,$5,$6,$7)",
		email, action, module, details, ip, rdns, ua,
	)
}

func getIP(r *http.Request) string {
	ip := r.Header.Get("X-Forwarded-For")
	if ip == "" {
		ip = r.Header.Get("X-Real-IP")
	}
	if ip == "" {
		ip = r.RemoteAddr
	}
	return ip
}

func getReverseDNS(ip string) string {
	host, _, err := net.SplitHostPort(ip)
	if err != nil {
		host = ip
	}
	names, err := net.LookupAddr(host)
	if err != nil || len(names) == 0 {
		return ""
	}
	return names[0]
}
