# Attendance Management System

Smart attendance via QR codes. Admins add students and generate QR codes; teachers scan to mark attendance.

## Tech
- Node.js + Express
- MongoDB Atlas (Mongoose)
- QR Code generation

## Setup
1. Copy env file:
```bash
cp .env.example .env
```
2. Edit `.env` with your `MONGODB_URI`. Set `BASE_URL` to your public URL (for local dev use a tunnel like ngrok or Cloudflared).

3. Install deps:
```bash
npm install
```

4. Run dev:
```bash
npm run dev
```

## API
- POST `/students` create student
```json
{ "name": "Alice", "email": "alice@example.com", "rollNumber": "CS-001" }
```
Response includes `qrUrl` like `BASE_URL/scan?roll=CS-001`.

- GET `/students` list students

- GET `/students/:rollNumber/qr.png` QR image (PNG)

- GET `/scan?roll=CS-001` mark attendance with simple HTML result

- POST `/attendance` mark via API
```json
{ "rollNumber": "CS-001", "date": "2025-01-01" }
```
Date defaults to today in `YYYY-MM-DD`.

## Notes
- Duplicate attendance per student per date is prevented by unique index.
- Ensure `BASE_URL` is accessible from the scanner device; otherwise use a tunnel.

