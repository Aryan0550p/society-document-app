# Housing Society Legal Document Management System

A comprehensive full-stack application for managing legal documents for housing society flat owners with password-protected folders and digital stamping capabilities.

## 🌟 Features

### Core Functionality
- **Document Upload System**: Upload PDF documents with organized categorization
- **15+ Document Types**: Support for all essential legal documents
- **Password-Protected Folders**: Individual folder protection for each owner with secure password encryption
- **Digital Stamping**: Mark superseded documents with digital stamps for version control
- **Document Viewer**: Click to view documents directly in browser
- **User Authentication**: Secure sign-up and sign-in system
- **Flat Owner Management**: Track documents by flat number

### Supported Document Types
a) Application for membership  
b) Society Payment receipts  
c) Share certificate details (with % shareholding)  
d) Flat legal registration  
e) Society approved Map  
f) Corporation Completion certificate  
g) Corporation completion certificate  
h) Corporation occupation Certificate  
i) Society flat no objection certificate  
j) Society Nomination documentation  
k) Corporation Tax Ownership documentation  
l) MSEB power connection Ownership documentation  
m) Pipegas ownership documentation  
n) Bank loan documentation  
o) Gift deed / Sale deed / Will documents  
p) Society Management Committee Meeting copy

## 🛠️ Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Custom session-based auth with bcrypt
- **PDF Processing**: pdf-lib for digital stamping
- **UI Components**: Radix UI primitives with custom styling
- **File Storage**: Local file system (easily adaptable to cloud storage)

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm or yarn package manager

## 🚀 Getting Started

### 1. Clone the Repository

```bash
cd Society_app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Database Setup

Create a PostgreSQL database and update the `.env` file:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/society_app?schema=public"
NEXTAUTH_SECRET="your-secret-key-here-change-in-production"
NEXTAUTH_URL="http://localhost:3000"
```

### 4. Run Prisma Migrations

```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 5. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## 📁 Project Structure

```
Society_app/
├── src/
│   ├── app/
│   │   ├── api/              # API routes
│   │   │   ├── auth/         # Authentication endpoints
│   │   │   ├── documents/    # Document management endpoints
│   │   │   └── folder/       # Folder access verification
│   │   ├── auth/             # Auth pages (signin, signup)
│   │   ├── dashboard/        # Main dashboard
│   │   ├── globals.css       # Global styles
│   │   ├── layout.tsx        # Root layout
│   │   └── page.tsx          # Landing page
│   ├── components/           # React components
│   │   ├── ui/               # UI components (buttons, cards, etc.)
│   │   ├── DocumentUpload.tsx
│   │   ├── DocumentList.tsx
│   │   └── FolderAccessModal.tsx
│   ├── lib/                  # Utilities
│   │   ├── prisma.ts         # Prisma client
│   │   └── utils.ts          # Helper functions
│   └── hooks/                # Custom React hooks
├── prisma/
│   └── schema.prisma         # Database schema
├── uploads/                  # Document storage (gitignored)
├── .env                      # Environment variables
├── next.config.ts            # Next.js configuration
├── tailwind.config.ts        # Tailwind CSS configuration
├── tsconfig.json             # TypeScript configuration
└── package.json              # Dependencies
```

## 🔐 Security Features

1. **Password Encryption**: All passwords hashed with bcrypt
2. **Session Management**: Secure session tokens with expiration
3. **Folder Protection**: Separate password for document folder access
4. **File Validation**: PDF-only uploads with size limits
5. **User Isolation**: Documents isolated per user

## 📝 Usage Guide

### For Flat Owners

1. **Sign Up**: Create an account with your details and flat number
2. **Set Folder Password**: Set a secure password for your document folder
3. **Sign In**: Log in with your credentials
4. **Unlock Documents**: Enter your folder password to access documents
5. **Upload Documents**: Click "Upload Document" and select from 15+ document types
6. **View Documents**: Click the eye icon to view documents in browser
7. **Mark as Superseded**: Click the stamp icon to digitally stamp old documents
8. **Delete Documents**: Remove documents when no longer needed

### Document Upload

- Supported format: PDF only
- Maximum file size: 10MB
- Required fields: Title, Document Type
- Optional: Description, Shareholding percentage (for share certificates)

### Digital Stamping

When you mark a document as superseded:
- A red "SUPERSEDED" stamp is applied to the PDF
- The date of superseding is recorded
- The document status changes to "Superseded"
- The original file is modified with the stamp

## 🚀 Deployment

### Vercel Deployment (Recommended)

1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Environment Variables for Production

```env
DATABASE_URL="your-production-database-url"
NEXTAUTH_SECRET="generate-a-secure-random-string"
NEXTAUTH_URL="https://your-domain.com"
NODE_ENV="production"
```

### Docker Deployment

```bash
# Build image
docker build -t society-app .

# Run container
docker run -p 3000:3000 -e DATABASE_URL="your-db-url" society-app
```

## 📊 Database Schema

- **User**: Stores user information, flat number, and encrypted passwords
- **Session**: Manages user sessions
- **Document**: Stores document metadata and file references

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new user account
- `POST /api/auth/signin` - Sign in user
- `POST /api/auth/signout` - Sign out user
- `GET /api/auth/me` - Get current user

### Documents
- `POST /api/documents` - Upload document
- `GET /api/documents?userId=xxx` - Get user documents
- `GET /api/documents/[id]/view` - View document
- `POST /api/documents/[id]/supersede` - Mark document as superseded
- `DELETE /api/documents/[id]` - Delete document

### Folder Access
- `POST /api/folder/verify` - Verify folder password

## 🎨 Customization

### Adding New Document Types

Edit `prisma/schema.prisma`:

```prisma
enum DocumentType {
  // ... existing types
  YOUR_NEW_TYPE
}
```

Then update `src/components/DocumentUpload.tsx` to add the option in DOCUMENT_TYPES array.

### Changing Theme Colors

Edit `tailwind.config.ts` and `src/app/globals.css` to customize colors.

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🤝 Contributing

This is a custom project for housing society document management. For enhancements or bug fixes, please create an issue or pull request.

## 📄 License

Private project - All rights reserved

## 💡 Future Enhancements

- [ ] Cloud storage integration (AWS S3, Azure Blob)
- [ ] Email notifications for document updates
- [ ] Society admin dashboard
- [ ] Bulk document upload
- [ ] Document search and filtering
- [ ] Mobile app (React Native)
- [ ] Document expiry reminders
- [ ] Audit trail for document changes
- [ ] Role-based access control
- [ ] Export documents as ZIP

## 🐛 Troubleshooting

### Database Connection Issues
```bash
# Check PostgreSQL is running
# Verify DATABASE_URL in .env
# Run migrations: npx prisma migrate dev
```

### File Upload Issues
```bash
# Check uploads directory exists and is writable
# Verify file size < 10MB
# Ensure PDF format
```

### Build Errors
```bash
# Clear cache
rm -rf .next node_modules
npm install
npm run dev
```

## 📞 Support

For issues or questions, please create an issue in the repository.

---

Built with ❤️ for Housing Societies
