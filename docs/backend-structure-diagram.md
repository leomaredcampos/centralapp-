# Backend Structure Diagram

## main.go (Mother ng lahat)
```
main.go
  │
  ├── connects to → utils/
  │                   ├── db.go (PostgreSQL)
  │                   ├── redis.go (Redis)
  │                   ├── email.go (SMTP)
  │                   ├── otp.go (OTP generation)
  │                   ├── totp.go (TOTP logic)
  │                   └── .env (config)
  │
  ├── connects to → credential/
  │                   │
  │                   ├── credential.go (Mother — RegisterRoutes)
  │                   │     │
  │                   │     ├── login.go
  │                   │     ├── logout.go
  │                   │     ├── totp.go
  │                   │     ├── totpsession.go
  │                   │     ├── session.go
  │                   │     ├── session_expiry.go
  │                   │     ├── attempts.go
  │                   │     └── credentiallogprint.go → tumatawag sa auditcredential
  │                   │
  │                   └── (lahat ng file dito, credential.go ang nag-coconnect)
  │
  ├── connects to → centralizeaudit/
  │                   │
  │                   ├── centralizeaudit.go (Mother — LogAction, HandleAuditLog)
  │                   │     │
  │                   │     └── auditcredential/
  │                   │           └── auditcredential.go (tumatawag sa centralizeaudit.go)
  │                   │
  │                   └── (kapag may bagong module, dagdag lang ng folder dito)
  │
  ├── connects to → apps/
  │                   └── apps.go (walang mother, isang file lang)
  │
  ├── connects to → appuserinfo/
  │                   └── rightbody/appuserinfoUSERDATA/userdata.go
  │
  └── connects to → userinfouserdata/
                      └── userinfouserdata.go
```

## Flow ng Audit Log
```
User clicks module
       │
       ▼
credential/login.go (o totp.go, logout.go)
       │
       ▼
credential/credentiallogprint.go
       │
       ├── log.Printf (PM2 logs)
       │
       └── auditcredential/auditcredential.go
                  │
                  ▼
           centralizeaudit/centralizeaudit.go
                  │
                  ▼
           INSERT sa auditlog table (PostgreSQL)
```
