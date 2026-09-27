# Login and admin setup

The website now opens on the sign-in page. Travellers can enter an email address or a phone number in international format (for example, `+919876543210`), receive a one-time code at that contact, and then open the preserved Dreampath Discover homepage. Admins sign in with the email and password configured in `.env`.

## Configure credentials

1. Copy `.env.example` to `.env` in this folder.
2. Replace `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `JWT_SECRET` with private values. Use a random JWT secret with at least 32 characters.
3. For email codes, configure a reachable SMTP server and sender address. Gmail requires an App Password.
4. For SMS codes, configure a Twilio account SID, auth token, and sending number. The number must be enabled for the recipient countries.

The `.env` file is ignored by Git. Do not commit provider credentials.

## Start the project

From this folder, run:

```powershell
docker compose up -d --build
```

Open `http://localhost:4200`. Docker starts PostgreSQL, Eureka, the gateway, the services, and the existing static website. User-service automatically adjusts the users table so an account can use either email or phone.

## Authentication API

All requests go through the gateway at `http://localhost:8080`:

| Method | Endpoint | Purpose |
| --- | --- | --- |
| POST | `/api/auth/otp/request` | Send a one-time code; JSON `{ "contact": "email or E.164 phone" }` |
| POST | `/api/auth/otp/verify` | Verify it; JSON `{ "contact": "...", "code": "123456" }` |
| POST | `/api/auth/admin-login` | Admin sign-in; JSON `{ "email": "...", "password": "..." }` |
| GET | `/api/auth/me` | Return the current token's role and contact; requires `Authorization: Bearer <token>` |

Codes expire after five minutes, can be requested once per minute per contact, and allow five attempts. Admin APIs require an `ADMIN` token. Public tour reads remain available to signed-in site users; tour create/update/deactivate operations require an admin token.

## Admin tour endpoints

All require `Authorization: Bearer <admin-token>`:

- `GET /api/tours/admin` — all active and inactive packages
- `POST /api/tours` — create a package
- `PUT /api/tours/{id}` — edit a package
- `DELETE /api/tours/{id}` — deactivate a package (soft delete)

The website's Journeys page reads current available packages from the tour service, so admin changes show there. Original page files and image assets are retained; the previous home page is now `frontend/home.html`, and `frontend/index.html` is the login entry page.
