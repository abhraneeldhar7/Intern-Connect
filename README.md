<div align="center">

# 🚀 InternConnect

### The Modern Internship Platform That Connects Talent with Opportunity

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.7-green?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![NextAuth](https://img.shields.io/badge/NextAuth-5.0-purple?style=for-the-badge)](https://next-auth.js.org/)

[Features](#-features) • [Tech Stack](#-tech-stack) • [Quick Start](#-quick-start) • [Screenshots](#-screenshots) • [Documentation](#-documentation)

</div>

---

## ✨ Overview

**InternConnect** is a cutting-edge, full-stack internship management platform that revolutionizes how students discover opportunities and companies manage their internship programs. Built with modern web technologies, it offers a seamless, secure, and intuitive experience for both applicants and administrators.

### 🎯 Why InternConnect?

- 🔐 **Secure & Reliable** - Enterprise-grade authentication with NextAuth.js
- ⚡ **Lightning Fast** - Optimized performance with Next.js 14 App Router
- 📱 **Fully Responsive** - Beautiful UI that works on all devices
- 🎨 **Modern Design** - Premium SaaS dashboard with shadcn/ui components
- 🔍 **Smart Search** - Advanced filtering and search capabilities
- 📊 **Analytics Dashboard** - Real-time insights for admins and applicants

---

## 🎨 Features

### For Applicants 👨‍🎓
- ✅ **Browse Internships** - Discover opportunities with advanced search and filters
- ✅ **Apply with Ease** - One-click application with resume upload
- ✅ **Track Applications** - Real-time status updates (Pending/Accepted/Rejected)
- ✅ **Bookmark Favorites** - Save internships for later
- ✅ **Personal Dashboard** - View all applications and recommendations
- ✅ **Profile Management** - Update your information anytime

### For Administrators 👔
- ✅ **Manage Internships** - Create, edit, and delete internship postings
- ✅ **Review Applications** - Accept or reject applications with ease
- ✅ **View Analytics** - Comprehensive dashboard with statistics
- ✅ **Applicant Management** - View all applicants and their details
- ✅ **Search & Filter** - Find internships quickly with powerful filters
- ✅ **Company Logo Upload** - Showcase your brand

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) v3
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Forms**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)

### Backend
- **Runtime**: Next.js API Routes & Server Actions
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/) v5
- **Password Hashing**: [bcryptjs](https://www.npmjs.com/package/bcryptjs)
- **File Upload**: [UploadThing](https://uploadthing.com/)

### Development Tools
- **Package Manager**: npm
- **Linting**: ESLint
- **Type Checking**: TypeScript
- **Version Control**: Git

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- MongoDB Atlas account (free tier available)
- UploadThing account (free tier available)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/internconnect.git
   cd internconnect
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   NEXTAUTH_SECRET=your_generated_secret
   NEXTAUTH_URL=http://localhost:3000
   UPLOADTHING_SECRET=your_uploadthing_secret
   UPLOADTHING_APP_ID=your_uploadthing_app_id
   ```

   Generate `NEXTAUTH_SECRET`:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
   ```

4. **Create admin user**
   ```bash
   npm run seed:admin
   ```
   Default credentials:
   - Email: `admin@example.com`
   - Password: `admin123`
   
   ⚠️ **Change password after first login!**

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📸 Screenshots

<div align="center">

### Landing Page
![Landing Page](./docs/screenshots/landing.png)

### Dashboard
![Dashboard](./docs/screenshots/dashboard.png)

### Internships
![Internships](./docs/screenshots/internships.png)

</div>

---

## 📚 Documentation

### Project Structure

```
internconnect/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication pages
│   ├── dashboard/         # Dashboard pages
│   ├── internships/       # Internship pages
│   └── api/               # API routes
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   └── ...               # Custom components
├── lib/                   # Utility functions
│   ├── actions/          # Server actions
│   ├── models/           # Mongoose models
│   └── ...               # Helpers and configs
├── public/                # Static assets
└── types/                 # TypeScript type definitions
```

### Key Features Documentation

- 📖 [Setup Guide](./SETUP.md) - Detailed setup instructions
- 🚀 [Quick Start](./QUICK_START.md) - 5-minute setup guide
- 📋 [SRS Document](./docs/SRS.md) - Software Requirements Specification
- 📊 [SPMP Document](./docs/SPMP.md) - Software Project Management Plan

---

## 🔐 Security

- ✅ Passwords hashed with bcrypt (12 rounds)
- ✅ JWT-based session management
- ✅ Role-based access control (RBAC)
- ✅ Protected API routes
- ✅ Input validation and sanitization
- ✅ Secure file upload validation

---

## 🧪 Testing

```bash
# Run linter
npm run lint

# Build for production
npm run build

# Start production server
npm start
```

---

## 🚢 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy! 🎉

### Environment Variables for Production

Make sure to set these in your hosting platform:
- `MONGODB_URI`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL` (your production domain)
- `UPLOADTHING_SECRET`
- `UPLOADTHING_APP_ID`

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Authors

- **Your Name** - *Initial work* - [YourGitHub](https://github.com/yourusername)

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing framework
- [shadcn/ui](https://ui.shadcn.com/) for beautiful components
- [Vercel](https://vercel.com/) for hosting
- [MongoDB](https://www.mongodb.com/) for the database
- [UploadThing](https://uploadthing.com/) for file uploads

---

<div align="center">

### ⭐ Star this repo if you find it helpful!

Made with ❤️ using Next.js and TypeScript

[Report Bug](https://github.com/yourusername/internconnect/issues) • [Request Feature](https://github.com/yourusername/internconnect/issues)

</div>
