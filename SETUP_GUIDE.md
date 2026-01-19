# 🚀 Quick Start Guide

## First Time Setup

### 1. Install PostgreSQL

#### On Windows:
1. Download PostgreSQL from https://www.postgresql.org/download/windows/
2. Run the installer
3. Remember the password you set for the postgres user
4. Keep default port 5432

#### Or use Docker:
```bash
docker run --name society-postgres -e POSTGRES_PASSWORD=mysecretpassword -p 5432:5432 -d postgres:16
```

### 2. Configure Database

Update `.env` file with your database credentials:

```env
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/society_app?schema=public"
```

Replace `your_password` with your actual PostgreSQL password.

### 3. Initialize Database

```bash
# Create database migrations
npx prisma migrate dev --name init

# Generate Prisma client (should already be done during npm install)
npx prisma generate
```

### 4. Start Development Server

```bash
npm run dev
```

Open browser to: http://localhost:3000

## 📱 Using the Application

### Step 1: Sign Up
1. Click "Get Started" or "Sign Up"
2. Fill in:
   - Full Name
   - Email
   - Flat Number (e.g., "A-101")
   - Password (for login)
   - Folder Password 🔑 (protects your documents)
3. Click "Sign Up"

### Step 2: Sign In
1. Enter email and password
2. Click "Sign In"

### Step 3: Unlock Documents
1. Enter your Folder Password 🔑
2. Click "Unlock"

### Step 4: Upload Documents
1. Click "Upload Document"
2. Fill in:
   - Document Title
   - Document Type (select from dropdown)
   - Shareholding % (only for share certificates)
   - Description (optional)
   - Select PDF file (max 10MB)
3. Click "Upload Document"

### Step 5: Manage Documents
- **View**: Click eye icon 👁️ to view PDF
- **Mark as Superseded**: Click stamp icon 📝 to digitally stamp old documents
- **Delete**: Click trash icon 🗑️ to remove documents

## 🔧 Common Issues

### Database Connection Failed
```bash
# Make sure PostgreSQL is running
# On Windows: Check Services -> PostgreSQL
# On Docker: docker start society-postgres

# Test connection
npx prisma studio
```

### Port Already in Use
```bash
# Change port in package.json
"dev": "next dev -p 3001"
```

### Build Errors
```bash
# Clean and reinstall
rm -rf .next node_modules
npm install
npm run dev
```

## 📊 Database Management

### View Data in Browser
```bash
npx prisma studio
```
Opens at: http://localhost:5555

### Reset Database
```bash
npx prisma migrate reset
```

### Create New Migration
```bash
npx prisma migrate dev --name your_migration_name
```

## 🌐 Deploy to Production

### Option 1: Vercel (Easiest)

1. Push code to GitHub
2. Go to https://vercel.com
3. Import repository
4. Add environment variables:
   - `DATABASE_URL`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL`
5. Deploy!

### Option 2: Docker

```bash
# Build and run with docker-compose
docker-compose up -d

# Access at http://localhost:3000
```

### Option 3: Traditional Server

```bash
# Build for production
npm run build

# Start production server
npm start
```

## 📂 Folder Structure Explained

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # Backend API routes
│   │   ├── auth/          # Login, signup, logout
│   │   ├── documents/     # Upload, view, delete docs
│   │   └── folder/        # Folder password verification
│   ├── auth/              # Login & signup pages
│   ├── dashboard/         # Main user dashboard
│   └── page.tsx           # Home/landing page
├── components/            # Reusable React components
│   ├── ui/                # Button, Card, Input, etc.
│   ├── DocumentUpload.tsx # Document upload modal
│   ├── DocumentList.tsx   # Document listing
│   └── FolderAccessModal.tsx # Folder unlock modal
├── lib/                   # Utilities
│   ├── prisma.ts          # Database client
│   └── utils.ts           # Helper functions
└── hooks/                 # Custom React hooks
    └── use-toast.ts       # Toast notifications
```

## 🔐 Security Best Practices

1. **Change Default Secrets**:
   ```env
   NEXTAUTH_SECRET="generate-secure-random-string-here"
   ```

2. **Use Strong Passwords**:
   - Account password
   - Folder password
   - Database password

3. **Enable HTTPS** in production

4. **Regular Backups** of database

5. **Update Dependencies**:
   ```bash
   npm update
   npm audit fix
   ```

## 🆘 Getting Help

### Check Application Logs
```bash
# Development mode shows logs in terminal
npm run dev
```

### Check Database
```bash
# Open Prisma Studio
npx prisma studio
```

### Common Commands
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Generate Prisma client
npx prisma generate

# Create database migration
npx prisma migrate dev

# View database
npx prisma studio
```

## 📝 Document Types Reference

The system supports 15+ document types:

| Letter | Document Type |
|--------|--------------|
| a | Application for membership |
| b | Society Payment receipts |
| c | Share certificate details |
| d | Flat legal registration |
| e | Society approved Map |
| f | Corporation Completion certificate |
| g | Corporation completion certificate (2) |
| h | Corporation occupation Certificate |
| i | Society flat NOC |
| j | Society Nomination documentation |
| k | Corporation Tax Ownership documentation |
| l | MSEB power connection Ownership |
| m | Pipegas ownership documentation |
| n | Bank loan documentation |
| o | Gift deed / Sale deed / Will documents |
| p | Management Committee Meeting copy |

## 💡 Tips & Tricks

1. **Organize Documents**: Use clear titles like "Share Certificate 2024" or "MSEB Bill Jan 2024"

2. **Track Versions**: When uploading a new version, mark the old one as superseded

3. **Backup Files**: Download important documents regularly

4. **Use Descriptions**: Add notes in the description field for future reference

5. **Shareholding**: For share certificates, always specify the exact percentage

---

**Need More Help?** Check the full README.md for detailed documentation.
