# Quick Start Guide

## 🚀 Setup in 5 Minutes

### 1. Install Dependencies
```bash
npm install
```

### 2. Create Environment File
Create a `.env.local` file in the root directory with:

```env
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_SECRET=your_generated_secret
NEXTAUTH_URL=http://localhost:3000
UPLOADTHING_SECRET=your_uploadthing_secret
UPLOADTHING_APP_ID=your_uploadthing_app_id
```

### 3. Set Up External Services

#### MongoDB (Required)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account → Create cluster → Get connection string
3. Add connection string to `.env.local`

#### NextAuth Secret (Required)
Generate a secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```
Add to `.env.local` as `NEXTAUTH_SECRET`

#### UploadThing (Required for Resume Uploads)
1. Go to https://uploadthing.com
2. Sign up → Create app → Get API keys
3. Add keys to `.env.local`

### 4. Create Admin User
```bash
npm run seed:admin
```
Default credentials:
- Email: `admin@example.com`
- Password: `admin123`

**⚠️ Change password after first login!**

### 5. Run the App
```bash
npm run dev
```

Visit http://localhost:3000

---

## 📋 External Services Checklist

- [ ] **MongoDB Atlas** - Database (Free tier available)
- [ ] **NextAuth Secret** - Generate random secret
- [ ] **UploadThing** - File uploads (Free tier available)

## 🔑 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGODB_URI` | ✅ Yes | MongoDB connection string |
| `NEXTAUTH_SECRET` | ✅ Yes | Random 32-byte base64 string |
| `NEXTAUTH_URL` | ✅ Yes | App URL (http://localhost:3000 for dev) |
| `UPLOADTHING_SECRET` | ✅ Yes | UploadThing API secret |
| `UPLOADTHING_APP_ID` | ⚠️ Optional | UploadThing app ID (if required) |

## 📚 Detailed Setup

See [SETUP.md](./SETUP.md) for detailed instructions.

