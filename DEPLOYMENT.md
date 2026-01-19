# 🚀 DEPLOYMENT INSTRUCTIONS

## Quick Start (Local Development)

### Prerequisites
- PostgreSQL database installed and running
- Node.js 18+ installed

### Steps

1. **Configure Database**
   
   Update `.env` file:
   ```env
   DATABASE_URL="postgresql://postgres:your_password@localhost:5432/society_app?schema=public"
   NEXTAUTH_SECRET="your-secret-key-change-this"
   NEXTAUTH_URL="http://localhost:3000"
   ```

2. **Initialize Database**
   ```bash
   npx prisma migrate dev --name init
   ```

3. **Start Application**
   ```bash
   npm run dev
   ```

4. **Access Application**
   
   Open: http://localhost:3000

---

## 🌐 Deploy to Cloud (Production Ready)

### Option 1: Vercel + Supabase (Recommended - Free Tier Available)

#### Step 1: Set up Supabase Database

1. Go to https://supabase.com
2. Create new project
3. Get connection string from Settings > Database
4. Format: `postgresql://postgres:[YOUR-PASSWORD]@[HOST]:5432/postgres`

#### Step 2: Deploy to Vercel

1. Push code to GitHub
2. Go to https://vercel.com and sign in
3. Click "New Project"
4. Import your GitHub repository
5. Add Environment Variables:
   ```
   DATABASE_URL=your-supabase-connection-string
   NEXTAUTH_SECRET=generate-random-secret
   NEXTAUTH_URL=your-vercel-url
   ```
6. Click "Deploy"

#### Step 3: Run Migrations on Production Database

```bash
# Set production database URL
export DATABASE_URL="your-supabase-connection-string"

# Run migrations
npx prisma migrate deploy
```

### Option 2: Railway.app (Easy Deployment)

1. Go to https://railway.app
2. Create new project
3. Add PostgreSQL database
4. Deploy from GitHub
5. Set environment variables in Railway dashboard
6. Railway will automatically run migrations

### Option 3: Docker (Self-Hosted)

1. **Update docker-compose.yml** with your settings

2. **Run**:
   ```bash
   docker-compose up -d
   ```

3. **Run Migrations**:
   ```bash
   docker-compose exec app npx prisma migrate deploy
   ```

4. **Access**: http://your-server-ip:3000

### Option 4: VPS/Cloud VM (AWS, Azure, DigitalOcean)

1. **Install Node.js and PostgreSQL**:
   ```bash
   # Ubuntu/Debian
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs postgresql
   ```

2. **Clone and Install**:
   ```bash
   cd /var/www
   git clone your-repo
   cd Society_app
   npm install
   ```

3. **Configure Environment**:
   ```bash
   nano .env
   # Add your production settings
   ```

4. **Setup Database**:
   ```bash
   sudo -u postgres psql
   CREATE DATABASE society_app;
   CREATE USER society_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE society_app TO society_user;
   \q
   ```

5. **Run Migrations**:
   ```bash
   npx prisma migrate deploy
   ```

6. **Build and Start**:
   ```bash
   npm run build
   npm start
   ```

7. **Setup PM2 (Process Manager)**:
   ```bash
   npm install -g pm2
   pm2 start npm --name "society-app" -- start
   pm2 startup
   pm2 save
   ```

8. **Setup Nginx Reverse Proxy**:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

---

## 🔐 Production Security Checklist

- [ ] Change `NEXTAUTH_SECRET` to a random string (generate with: `openssl rand -base64 32`)
- [ ] Use strong database password
- [ ] Enable HTTPS/SSL certificate
- [ ] Restrict database access (firewall rules)
- [ ] Set NODE_ENV=production
- [ ] Regular database backups
- [ ] Update dependencies regularly
- [ ] Enable rate limiting
- [ ] Set up monitoring and alerts

---

## 📊 Environment Variables

### Required for Production

```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/database?schema=public"

# Authentication
NEXTAUTH_SECRET="generate-a-very-long-random-string"
NEXTAUTH_URL="https://your-domain.com"

# Application
NODE_ENV="production"
MAX_FILE_SIZE=10485760
UPLOAD_DIR="./uploads"
```

### Optional

```env
# Monitoring (add if using services like Sentry)
SENTRY_DSN="your-sentry-dsn"

# Analytics
NEXT_PUBLIC_GA_ID="your-google-analytics-id"

# Email (if adding email notifications)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email"
SMTP_PASSWORD="your-password"
```

---

## 🧪 Testing Before Production

1. **Test Database Connection**:
   ```bash
   npx prisma studio
   ```

2. **Test Build**:
   ```bash
   npm run build
   npm start
   ```

3. **Test Production Mode Locally**:
   ```bash
   NODE_ENV=production npm start
   ```

4. **Test Document Upload**: Upload a large PDF (close to 10MB)

5. **Test Digital Stamping**: Upload document, mark as superseded, verify stamp

6. **Test Authentication**: Create account, logout, login

7. **Test Folder Protection**: Logout, login, verify folder password required

---

## 📈 Monitoring & Maintenance

### Database Backups

```bash
# Backup
pg_dump -U society_user -d society_app > backup_$(date +%Y%m%d).sql

# Restore
psql -U society_user -d society_app < backup_20260119.sql
```

### Application Logs

```bash
# PM2
pm2 logs society-app

# Docker
docker-compose logs -f app

# Vercel
View in Vercel dashboard
```

### Update Application

```bash
# Pull latest code
git pull origin main

# Install dependencies
npm install

# Run migrations
npx prisma migrate deploy

# Rebuild
npm run build

# Restart
pm2 restart society-app
# or
docker-compose restart app
```

---

## 🆘 Troubleshooting Production Issues

### Issue: Database Connection Timeout
```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Check connection
psql -U society_user -d society_app
```

### Issue: 502 Bad Gateway
```bash
# Check app is running
pm2 status
# or
docker-compose ps

# Restart app
pm2 restart society-app
```

### Issue: File Upload Fails
```bash
# Check uploads directory permissions
chmod 755 uploads
chown -R www-data:www-data uploads

# Check disk space
df -h
```

### Issue: Out of Memory
```bash
# Increase Node.js memory limit
node --max-old-space-size=4096 node_modules/next/dist/bin/next start
```

---

## 📞 Post-Deployment Checklist

- [ ] Application accessible at production URL
- [ ] HTTPS working correctly
- [ ] User registration working
- [ ] Login/logout functioning
- [ ] Document upload successful
- [ ] Document viewing works
- [ ] Digital stamping works
- [ ] Folder password protection active
- [ ] Database backups configured
- [ ] Monitoring set up
- [ ] Error logging enabled

---

## 🎉 You're Live!

Once deployed, your Society Document Management System will be accessible to all flat owners. They can:

1. Sign up with their details
2. Set a folder password
3. Upload their legal documents
4. View documents anytime
5. Mark old documents as superseded
6. Keep all documents organized in one place

**Congratulations! 🎊**
