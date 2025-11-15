# InternConnect Setup Guide

This guide will help you set up all external services and configure the application.

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- A code editor (VS Code recommended)

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Set Up MongoDB Database

### Option A: MongoDB Atlas (Cloud - Recommended)

1. **Create a MongoDB Atlas Account**
   - Go to https://www.mongodb.com/cloud/atlas
   - Sign up for a free account

2. **Create a Cluster**
   - Click "Build a Database"
   - Choose the FREE tier (M0)
   - Select a cloud provider and region (choose closest to you)
   - Click "Create"

3. **Create Database User**
   - Go to "Database Access" in the left sidebar
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Create a username and password (save these!)
   - Set privileges to "Atlas admin" or "Read and write to any database"
   - Click "Add User"

4. **Configure Network Access**
   - Go to "Network Access" in the left sidebar
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for development) or add your IP
   - Click "Confirm"

5. **Get Connection String**
   - Go to "Database" in the left sidebar
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `<database_name>` with your desired database name (e.g., `internconnect`)

### Option B: Local MongoDB

1. **Install MongoDB**
   - Download from https://www.mongodb.com/try/download/community
   - Follow installation instructions for your OS

2. **Start MongoDB**
   ```bash
   # Windows
   net start MongoDB

   # macOS/Linux
   mongod
   ```

3. **Connection String**
   - Use: `mongodb://localhost:27017/internconnect`

## Step 3: Set Up NextAuth

1. **Generate NEXTAUTH_SECRET**
   - Option 1: Use online generator: https://generate-secret.vercel.app/32
   - Option 2: Use OpenSSL:
     ```bash
     openssl rand -base64 32
     ```
   - Option 3: Use Node.js:
     ```bash
     node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
     ```

2. **Set NEXTAUTH_URL**
   - For local development: `http://localhost:3000`
   - For production: Your production domain (e.g., `https://yourdomain.com`)

## Step 4: Set Up UploadThing (For Resume Uploads)

1. **Create UploadThing Account**
   - Go to https://uploadthing.com
   - Sign up for a free account

2. **Create a New App**
   - Click "Create App" or "New App"
   - Give it a name (e.g., "InternConnect")
   - Select a plan (Free tier is sufficient for development)

3. **Get API Keys**
   - Go to your app dashboard
   - Navigate to "API Keys" or "Settings"
   - Copy your `UPLOADTHING_SECRET`
   - Copy your `UPLOADTHING_APP_ID` (if required)

4. **Configure UploadThing**
   - The app is already configured to use the `resumeUploader` endpoint
   - File type: PDF only
   - Max file size: 4MB

## Step 5: Configure Environment Variables

1. **Copy the example file**
   ```bash
   cp .env.local.example .env.local
   ```

2. **Edit `.env.local`** and fill in all the values:
   ```env
   MONGODB_URI=your_mongodb_connection_string_here
   NEXTAUTH_SECRET=your_generated_secret_here
   NEXTAUTH_URL=http://localhost:3000
   UPLOADTHING_SECRET=your_uploadthing_secret_here
   UPLOADTHING_APP_ID=your_uploadthing_app_id_here
   ```

## Step 6: Run the Application

1. **Start the development server**
   ```bash
   npm run dev
   ```

2. **Open your browser**
   - Navigate to http://localhost:3000

## Step 7: Create Your First Admin User

Since there's no admin registration page, you'll need to create an admin user manually:

### Option A: Using MongoDB Compass or MongoDB Shell

1. Connect to your MongoDB database
2. Navigate to the `users` collection
3. Insert a new document:
   ```json
   {
     "name": "Admin User",
     "email": "admin@example.com",
     "password": "$2a$12$hashed_password_here",
     "role": "admin",
     "createdAt": new Date(),
     "updatedAt": new Date()
   }
   ```

### Option B: Create a Seed Script

Create a file `scripts/seed-admin.ts`:

```typescript
import bcrypt from 'bcryptjs';
import connectDB from '../lib/db';
import User from '../lib/models/User';

async function seedAdmin() {
  await connectDB();
  
  const hashedPassword = await bcrypt.hash('your_admin_password', 12);
  
  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@example.com',
    password: hashedPassword,
    role: 'admin',
  });
  
  console.log('Admin user created:', admin);
  process.exit(0);
}

seedAdmin();
```

Then run:
```bash
npx tsx scripts/seed-admin.ts
```

## External Services Summary

| Service | Purpose | Free Tier | Setup Required |
|---------|---------|-----------|----------------|
| **MongoDB Atlas** | Database | ✅ Yes (512MB) | Account + Cluster |
| **NextAuth** | Authentication | ✅ Yes | Secret generation |
| **UploadThing** | File uploads | ✅ Yes (1GB/month) | Account + API keys |

## Troubleshooting

### MongoDB Connection Issues
- Verify your connection string is correct
- Check that your IP is whitelisted in MongoDB Atlas
- Ensure your database user has proper permissions

### NextAuth Issues
- Verify `NEXTAUTH_SECRET` is set and is a valid base64 string
- Check that `NEXTAUTH_URL` matches your current URL
- Clear browser cookies if session issues occur

### UploadThing Issues
- Verify API keys are correct
- Check that your UploadThing app is active
- Ensure file size is under 4MB and file type is PDF

### TypeScript Errors
- Run `npm install` to ensure all dependencies are installed
- Restart your TypeScript server in VS Code (Cmd/Ctrl + Shift + P → "TypeScript: Restart TS Server")
- Clear `.next` folder and rebuild: `rm -rf .next && npm run build`

## Production Deployment

When deploying to production (Vercel, Netlify, etc.):

1. Set all environment variables in your hosting platform's dashboard
2. Update `NEXTAUTH_URL` to your production domain
3. Update MongoDB network access to allow your hosting platform's IPs
4. Ensure UploadThing is configured for production domain

## Support

If you encounter any issues, check:
- Console logs for error messages
- Network tab in browser DevTools
- Server logs in terminal
- MongoDB Atlas logs
- UploadThing dashboard logs

