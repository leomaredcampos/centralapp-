# CentralApp - Development Log

## Date: May 18, 2026

---

## 1. Project Structure

### Frontend
```
frontend/src/app/
├── page.tsx                    ← redirects to /login
├── layout.tsx                  ← global font (Calibri 11pt)
├── login/
│   ├── page.tsx                ← step switching logic (email → otp → totp)
│   └── components/
│       ├── EmailStep.tsx       ← email input + continue button
│       ├── OtpStep.tsx         ← OTP input + verify button
│       └── AuthenticatorStep.tsx ← TOTP input for Microsoft Authenticator
├── dashboard/
│   ├── page.tsx                ← session check + app fetching + search logic
│   └── components/
│       ├── LeftUpper.tsx       ← RA.png logo
│       ├── LeftLower.tsx       ← search input + module count + logout
│       ├── RightUpper.tsx      ← Module label + 2FA button + email display
│       └── RightLower.tsx      ← app cards grid / 2FA setup page
└── 2fa/
    └── page.tsx                ← 2FA setup (QR code + verify + disable)
```

### Backend
```
backend/
├── main.go                     ← route registration + server start
├── login/
│   ├── login.go                ← HandleLogin, HandleVerifyOTP
│   ├── logout.go               ← HandleLogout
│   ├── session.go              ← HandleCheckSession
│   └── totp.go                 ← HandleSetupTOTP, HandleVerifyTOTP, HandleDisableTOTP, HandleCheckTOTPStatus
├── apps/
│   └── apps.go                 ← HandleGetApps
└── utils/
    ├── db.go                   ← PostgreSQL connection
    └── .env                    ← credentials
```

---

## 2. Dashboard Layout

4-panel layout (no page navigation — single page):

| | Left (20%) | Right (80%) |
|---|---|---|
| Upper (10%) | RA.png logo | Module label + 2FA button + email |
| Lower (90%) | Search + count + logout | App cards / 2FA setup |

---

## 3. Login Flow

### OTP Flow (no TOTP set up)
1. User enters email → backend checks if email exists + `otpstatus != 'locked'`
2. Backend generates 6-char OTP → saves to `otpkey` in DB → sends via Gmail SMTP
3. User enters OTP → backend verifies → updates `otpstatus = 'locked'` → redirect to `/dashboard`

### TOTP Flow (Microsoft Authenticator set up)
1. User enters email → backend checks `totp` column → returns `totp_required`
2. User enters 6-digit authenticator code → backend verifies via `pquerna/otp`
3. Updates `otpstatus = 'locked'` → redirect to `/dashboard`

### Logout
1. Calls `/api/logout` → clears `otpstatus` and `otpkey` in DB
2. Clears `localStorage` → redirect to `/login`

---

## 4. Session Protection
- Dashboard checks `localStorage` for email on load
- Calls `/api/check-session` → verifies `otpstatus = 'locked'` in DB
- If invalid → redirect to `/login`
- Prevents direct URL access to `/dashboard` without login

---

## 5. Account Lock
- `otpstatus = 'locked'` after successful login
- Attempting to login with a locked account → "This account is currently in use."
- Only cleared on logout

---

## 6. 2FA Setup (Microsoft Authenticator)
- Click 2FA button on dashboard → RightLower shows 2FA page, label changes to "2FA", button changes to "Back"
- If no TOTP set up → shows QR code to scan in Microsoft Authenticator
- User scans QR → enters 6-digit code → verified → `totp` saved in DB
- If TOTP already set up → shows "2FA is enabled" + Disable button
- Disable → clears `totp` in DB → can set up again

---

## 7. App Modules (RightLower)
- Fetches from `apptbl` where `appstatus != 'deactivated'`
- Checks `appaccess` table — column name = `appname` value, must be `'Yes'`
- Dynamic column query using `fmt.Sprintf` in Go
- Displays as cards: folder icon + buttonname label
- 5 per row, left-aligned grid, thin scrollbar
- Search in LeftLower filters cards in real-time

---

## 8. Packages Used

### Backend (Go)
| Package | Purpose |
|---------|---------|
| `github.com/joho/godotenv` | Load .env file |
| `github.com/lib/pq` | PostgreSQL driver |
| `gopkg.in/gomail.v2` | Email sending via Gmail SMTP |
| `github.com/pquerna/otp` | TOTP generation and validation |

### Frontend (Next.js)
| Package | Purpose |
|---------|---------|
| `next` | React framework |
| `tailwindcss` | Utility-first CSS |

---

## 9. Why `pquerna/otp` over `speakeasy` (Node.js)
- `speakeasy` is **archived** — no active maintenance, no security updates
- `pquerna/otp` is actively maintained, widely used in Go community
- Both implement RFC 6238 (TOTP standard) — compatible with Microsoft Authenticator

---

## 10. Design Decisions
- **Font**: Calibri 11pt — global, applied in `layout.tsx`
- **Colors**: Minimal — white background, gray borders, red logout
- **Cards**: Rounded corners, subtle shadow, white background
- **Hover**: Scale up only — no color change (clean corporate feel)
- **Scrollbar**: `scrollbar-width: thin` — appears only when needed
- **Layout**: Left-aligned grid — corporate internal tool standard, not centered (pambata yun)
