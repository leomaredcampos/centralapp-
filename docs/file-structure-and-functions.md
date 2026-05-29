# CentralApp — Complete File Structure & Function Map

---

## BACKEND — Call Flow Graph

```
main.go
  │
  └── mainassistant.Start()
        │
        └── layerfolder.Layer0001()
              │
              └── groupfolder.Group0001()
                    │
                    ├── utils.ConnectDB()
                    ├── redisconnection.RegisterRoutes()
                    ├── utils.RegisterRoutes()
                    ├── credential.RegisterRoutes()
                    ├── centralizeaudit.RegisterRoutes()
                    ├── apps.RegisterRoutes()
                    ├── appuserinfoUSERDATA.RegisterRoutes()
                    └── userinfouserdata.RegisterRoutes()
```

---

## BACKEND — Files & Functions

### main.go
| Function | Purpose |
|----------|---------|
| main() | Entry point — calls mainassistant.Start(), starts HTTP server on :3000 |

---

### mainassistant/mainassistant.go
| Function | Purpose |
|----------|---------|
| Start() | Calls layerfolder.Layer0001() |

---

### layerfolder/layer0001.go
| Function | Purpose |
|----------|---------|
| Layer0001() | Calls groupfolder.Group0001() |

---

### groupfolder/group0001.go
| Function | Purpose |
|----------|---------|
| Group0001() | Connects DB, Redis, registers all module routes |

---

### credential/ (Mother: credential.go)

**credential.go**
| Function | Purpose |
|----------|---------|
| RegisterRoutes() | Registers all credential endpoints, starts session checker, clears OTP |
| ClearOTPSessions() | Clears all OTP sessions on startup (security) |

**login.go**
| Function | Purpose |
|----------|---------|
| HandleLogin() | Check email, send OTP or redirect to 2FA |
| HandleVerifyOTP() | Validate OTP code |

**logout.go**
| Function | Purpose |
|----------|---------|
| HandleLogout() | Clear session, allow re-login |

**totp.go**
| Function | Purpose |
|----------|---------|
| HandleSetupTOTP() | Generate new TOTP secret + URI |
| HandleCheckTOTPStatus() | Check if user has 2FA enabled |
| HandleDisableTOTP() | Remove 2FA |
| HandleVerifyTOTPSetup() | Validate code and save secret to DB |
| HandleVerifyTOTP() | Validate code during login |

**totpsession.go**
| Function | Purpose |
|----------|---------|
| generateSessionID() | Generate random session ID |
| HandleCheckTOTPSession() | Validate TOTP session |
| HandleDeleteTOTPSession() | Delete specific TOTP session |
| createTOTPSession() | Create new TOTP session in DB |
| deleteAllTOTPSessions() | Delete all sessions for a user |

**session.go**
| Function | Purpose |
|----------|---------|
| HandleCheckSession() | Check if OTP session is valid |

**session_expiry.go**
| Function | Purpose |
|----------|---------|
| StartSessionExpiryChecker() | Background goroutine — expires old sessions |
| expireOTPSessions() | Expire OTP sessions older than 1 day |
| expireTOTPSessions() | Expire TOTP sessions older than 1 day |

**attempts.go** (Redis-based)
| Function | Purpose |
|----------|---------|
| isLocked() | Check if user is locked out |
| recordAttempt() | Increment attempt count |
| resetAttempts() | Reset attempt count |
| setOTPSentAt() | Record when OTP was sent |
| isOTPExpired() | Check if OTP expired (5 min) |
| otpSecondsRemaining() | Get remaining seconds before OTP expires |

**credentiallogprint.go**
| Function | Purpose |
|----------|---------|
| getIP() | Get client IP from request headers |
| logOTPSent() | Log + audit: OTP sent |
| logOTPVerified() | Log + audit: OTP verified |
| logTOTPVerified() | Log + audit: TOTP verified |
| logTOTPSetup() | Log + audit: TOTP setup |
| logTOTPDisabled() | Log + audit: TOTP disabled |
| logLogout() | Log + audit: user logout |

---

### centralizeaudit/ (Mother: centralizeaudit.go)

**centralizeaudit.go**
| Function | Purpose |
|----------|---------|
| HandleAuditLog() | Endpoint — receives audit log from frontend |
| RegisterRoutes() | Registers /api/audit/log route |
| LogAction() | Insert audit record to auditlog table |
| getIP() | Get client IP |
| getReverseDNS() | Reverse DNS lookup for network identification |

**auditcredential/auditcredential.go**
| Function | Purpose |
|----------|---------|
| LogOTPSent() | Audit: OTP sent |
| LogOTPVerified() | Audit: OTP login |
| LogTOTPVerified() | Audit: TOTP login |
| LogTOTPSetup() | Audit: 2FA setup |
| LogTOTPDisabled() | Audit: 2FA disabled |
| LogLogout() | Audit: logout |

---

### apps/ (Mother: apps.go)

**apps.go**
| Function | Purpose |
|----------|---------|
| RegisterRoutes() | Registers /api/get-apps and /api/get-available-apps |
| HandleGetAvailableApps() | Get all non-deleted apps |
| HandleGetApps() | Get apps user has access to (dynamic column check) |

---

### appuserinfo/rightbody/appuserinfoUSERDATA/ (Mother: userdata.go)

**userdata.go**
| Function | Purpose |
|----------|---------|
| RegisterRoutes() | Registers /api/appuserinfo/save and /api/appuserinfo/list |
| HandleListUsers() | List all users |
| HandleSaveUserInfo() | Save new user + assign app access |

---

### userinfouserdata/ (Mother: userinfouserdata.go)

**userinfouserdata.go**
| Function | Purpose |
|----------|---------|
| RegisterRoutes() | Registers /api/appuserinfo/upload |
| HandleUploadFiles() | Upload files (max 4) to user folder |

---

### redisconnection/ (Mother: redisconnection.go)

**redisconnection.go**
| Function | Purpose |
|----------|---------|
| RegisterRoutes() | Calls connectRedis() |

**redisConn.go**
| Function | Purpose |
|----------|---------|
| connectRedis() | Connect to Redis server on localhost:6379 |

---

### utils/

**db.go**
| Function | Purpose |
|----------|---------|
| ConnectDB() | Connect to PostgreSQL |
| CloseDB() | Close DB connection |

**databaseconnection.go**
| Function | Purpose |
|----------|---------|
| RegisterRoutes() | Registers /api/health endpoint |

**email.go**
| Function | Purpose |
|----------|---------|
| SendOTPEmail() | Send OTP via SMTP (pure Go — net/smtp) |

**otp.go**
| Function | Purpose |
|----------|---------|
| GenerateOTP() | Generate 6-char OTP (crypto/rand) |

**totp.go**
| Function | Purpose |
|----------|---------|
| GenerateTOTPSecret() | Generate 32-char Base32 secret |
| GenerateTOTPURI() | Generate otpauth:// URI for QR code |
| ValidateTOTP() | Validate 6-digit TOTP code (±1 window) |
| generateTOTPCode() | HMAC-SHA1 code generation (internal) |

---

## FRONTEND — Files & Purpose

### src/app/ (Root)

| File | Purpose |
|------|---------|
| layout.tsx | Root layout — wraps all pages |
| page.tsx | Landing/redirect page |
| globals.css | Global styles (Tailwind) |

---

### src/app/login/ (Mother: page.tsx)

| File | Purpose | Calls Backend |
|------|---------|---------------|
| page.tsx | Login page — email, OTP, TOTP steps | /api/login, /api/verify-otp, /api/verify-totp |
| components/EmailStep.tsx | Email input UI | — |
| components/OtpStep.tsx | OTP input UI | — |
| components/AuthenticatorStep.tsx | TOTP input UI | — |

---

### src/app/dashboard/ (Mother: page.tsx)

| File | Purpose | Calls Backend |
|------|---------|---------------|
| page.tsx | Dashboard — session check, app list, module open | /api/check-session, /api/check-totp-session, /api/get-apps, /api/appuserinfo/list |
| components/LeftUpper.tsx | Logo/branding area | — |
| components/LeftLower.tsx | Search + module count | — |
| components/RightUpper.tsx | User info bar + 2FA toggle | — |
| components/RightLower.tsx | Module cards display | — |

---

### src/app/2fa/ (Mother: page.tsx)

| File | Purpose | Calls Backend |
|------|---------|---------------|
| page.tsx | 2FA setup/manage page | /api/check-totp-status, /api/setup-totp, /api/verify-totp-setup, /api/disable-totp |

---

### src/app/appuserinfo/

| File | Purpose | Calls Backend |
|------|---------|---------------|
| rightbody/appuserinfoUSERDATA/page.tsx | User info module page | /api/appuserinfo/save, /api/appuserinfo/upload |

---

### src/app/centralizeaudit/ (Mother: centralizeaudit.ts)

| File | Purpose | Calls Backend |
|------|---------|---------------|
| centralizeaudit.ts | Main audit fetch function | /api/audit/log |
| auditdashboard/auditdashboard.ts | Dashboard audit (open module) | via centralizeaudit.ts |
| audituserinfo/audituserinfo.ts | Userinfo audit (add user, upload) | via centralizeaudit.ts |

---

## FRONTEND → BACKEND Connection Map

```
Frontend                          Backend
────────                          ───────
login/page.tsx
  ├── /api/login              →   credential/login.go → HandleLogin
  ├── /api/verify-otp         →   credential/login.go → HandleVerifyOTP
  └── /api/verify-totp        →   credential/totp.go → HandleVerifyTOTP

dashboard/page.tsx
  ├── /api/check-session      →   credential/session.go → HandleCheckSession
  ├── /api/check-totp-session →   credential/totpsession.go → HandleCheckTOTPSession
  ├── /api/get-apps           →   apps/apps.go → HandleGetApps
  └── /api/appuserinfo/list   →   appuserinfo/.../userdata.go → HandleListUsers

2fa/page.tsx
  ├── /api/check-totp-status  →   credential/totp.go → HandleCheckTOTPStatus
  ├── /api/setup-totp         →   credential/totp.go → HandleSetupTOTP
  ├── /api/verify-totp-setup  →   credential/totp.go → HandleVerifyTOTPSetup
  └── /api/disable-totp       →   credential/totp.go → HandleDisableTOTP

centralizeaudit/centralizeaudit.ts
  └── /api/audit/log          →   centralizeaudit/centralizeaudit.go → HandleAuditLog
```

---

## DATABASE — Tables, Columns & Data Types

### appaccess
| Column | Data Type | Nullable | Primary Key |
|--------|-----------|----------|-------------|
| id | bigint | NO | YES |
| emailx | character varying | YES | NO |
| writeremail | character varying | YES | NO |
| writemade | character varying | YES | NO |
| datemade | timestamp | YES | NO |
| logisticapp | character varying | YES | NO |
| userinfoapp | character varying | YES | NO |

---

### apptbl
| Column | Data Type | Nullable | Primary Key |
|--------|-----------|----------|-------------|
| id | bigint | NO | YES |
| appname | character varying | YES | NO |
| buttonname | character varying | YES | NO |
| appstatus | character varying | YES | NO |
| writeremail | character varying | YES | NO |
| datemade | timestamp | YES | NO |

---

### auditlog
| Column | Data Type | Nullable | Primary Key |
|--------|-----------|----------|-------------|
| id | bigint | NO | YES |
| emailx | character varying | YES | NO |
| action | character varying | YES | NO |
| module | character varying | YES | NO |
| details | character varying | YES | NO |
| ipaddress | character varying | YES | NO |
| reversedns | character varying | YES | NO |
| useragent | character varying | YES | NO |
| datemade | timestamp | YES | NO |

---

### dcappaccess
| Column | Data Type | Nullable | Primary Key |
|--------|-----------|----------|-------------|
| id | bigint | NO | YES |
| emailx | character varying | YES | NO |
| writeremail | character varying | YES | NO |
| writemade | character varying | YES | NO |
| datemade | timestamp | YES | NO |
| dcinbound | character varying | YES | NO |
| dcoutbound | character varying | YES | NO |

---

### dcapptbl
| Column | Data Type | Nullable | Primary Key |
|--------|-----------|----------|-------------|
| id | bigint | NO | YES |
| appname | character varying | YES | NO |
| buttonname | character varying | YES | NO |
| appstatus | character varying | YES | NO |
| writeremail | character varying | YES | NO |
| datemade | timestamp | YES | NO |

---

### userinfotbl
| Column | Data Type | Nullable | Primary Key |
|--------|-----------|----------|-------------|
| id | bigint | NO | YES |
| fname | character varying | YES | NO |
| lname | character varying | YES | NO |
| mname | character varying | YES | NO |
| sname | character varying | YES | NO |
| userid | character varying | YES | NO |
| emailx | character varying | YES | NO |
| usertin | character varying | YES | NO |
| userpagibig | character varying | YES | NO |
| userss | character varying | YES | NO |
| userphilihealth | character varying | YES | NO |
| useraddress | character varying | YES | NO |
| usertype | character varying | YES | NO |
| userdept | character varying | YES | NO |
| userposition | character varying | YES | NO |
| usercontact | character varying | YES | NO |
| usergender | character varying | YES | NO |
| userbirth | timestamp | YES | NO |
| companyid | character varying | YES | NO |
| companyname | character varying | YES | NO |
| companytype1 | character varying | YES | NO |
| companytype2 | character varying | YES | NO |
| businesstype | character varying | YES | NO |
| companytin | character varying | YES | NO |
| companycontact1 | character varying | YES | NO |
| companycontact2 | character varying | YES | NO |
| companyaddress | character varying | YES | NO |
| writeremail | character varying | YES | NO |
| writemade | character varying | YES | NO |
| datemade | timestamp | YES | NO |
| companyemail1 | character varying | YES | NO |
| companyemail2 | character varying | YES | NO |
| companysite | character varying | YES | NO |
| otpkey | character varying | YES | NO |
| otpstatus | character varying | YES | NO |
| userstatus | character varying | YES | NO |
| totp | character varying | YES | NO |
| usercontactinemergency | character varying | YES | NO |
| userpersoncontactno | character varying | YES | NO |
| totpverified | character varying | YES | NO |
| sessionid | character varying | YES | NO |
| otplogindate | timestamp | YES | NO |

---

### usertotp_sessions
| Column | Data Type | Nullable | Primary Key |
|--------|-----------|----------|-------------|
| id | bigint | NO | YES |
| emailx | character varying | YES | NO |
| sessionid | character varying | YES | NO |
| datemade | timestamp | YES | NO |

---

## DATABASE — Indexes

| Table | Index Name | Column | Type |
|-------|-----------|--------|------|
| appaccess | appaccess_pkey | id | Primary Key |
| appaccess | idx_appaccess_emailx | emailx | Performance |
| apptbl | apptbl_pkey | id | Primary Key |
| auditlog | auditlog_pkey | id | Primary Key |
| auditlog | idx_auditlog_emailx | emailx | Performance |
| auditlog | idx_auditlog_datemade | datemade | Performance |
| dcappaccess | dcappaccess_pkey | id | Primary Key |
| dcappaccess | idx_dcappaccess_emailx | emailx | Performance |
| dcapptbl | dcapptbl_pkey | id | Primary Key |
| userinfotbl | userinfotbl_pkey | id | Primary Key |
| userinfotbl | idx_userinfotbl_emailx | emailx | Performance |
| usertotp_sessions | usertotp_sessions_pkey | id | Primary Key |
| usertotp_sessions | idx_usertotp_sessions_emailx | emailx | Performance |
| usertotp_sessions | idx_usertotp_sessions_sessionid | sessionid | Performance |
