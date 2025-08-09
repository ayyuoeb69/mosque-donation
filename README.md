# Mosque Donation Platform

A modern, responsive web application built with Next.js for mosque donation campaigns. Features an admin panel for content management and a beautiful landing page optimized for donations.

## Features

### Admin Panel
- 🔐 **Secure Authentication** - Admin login with NextAuth.js
- 📝 **Content Management** - Edit title, description, and fundraising goal
- 🖼️ **Image Upload** - Upload logo, banner image, and QR code
- 📊 **Real-time Stats** - Track donations and progress
- 📱 **Responsive Design** - Works on all devices

### Landing Page
- 🎨 **Modern UI** - Clean, professional design with Islamic themes
- 📱 **Mobile Optimized** - Responsive design for all screen sizes
- 💰 **Donation Form** - Easy-to-use donation interface with preset amounts
- 📈 **Progress Tracking** - Visual progress bar and statistics
- 👥 **Recent Donations** - Display recent donor contributions
- 🔍 **SEO Optimized** - Meta tags and Open Graph support
- 📱 **QR Code Support** - Quick donation via QR code scanning

## Technology Stack

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **UI Components**: Lucide React icons
- **Form Handling**: React Hook Form with Zod validation
- **File Upload**: Built-in file handling system

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   ```

3. **Seed the database with admin user and default content**
   ```bash
   node scripts/seed.mjs
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Access the application**
   - Landing Page: http://localhost:3002
   - Admin Panel: http://localhost:3002/admin/login
   - Admin Credentials: admin@mail.com / admin123

## Deployment to Vercel

### Prerequisites
- Vercel account
- PostgreSQL database (you can use Vercel Postgres, Supabase, or any other PostgreSQL provider)

### Steps

1. **Set up PostgreSQL Database**
   - Create a PostgreSQL database (Vercel Postgres, Supabase, PlanetScale, etc.)
   - Get your connection string

2. **Deploy to Vercel**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Deploy
   vercel
   ```

3. **Configure Environment Variables**
   In your Vercel project settings, add these environment variables:
   ```
   DATABASE_URL=postgresql://username:password@host:port/database
   NEXTAUTH_URL=https://your-domain.vercel.app
   NEXTAUTH_SECRET=your-secret-key-here
   ```

4. **Run Database Migrations**
   ```bash
   # Connect to your production database
   npx prisma migrate deploy
   ```

### Important Notes
- The build process automatically runs `prisma generate` to create the Prisma client
- Make sure your PostgreSQL database is accessible from Vercel's servers
- For production, use a strong NEXTAUTH_SECRET (generate with: `openssl rand -base64 32`)

## Usage

### For Administrators

1. **Login to Admin Panel**
   - Navigate to `/admin/login`
   - Default credentials: admin@mail.com / admin123

2. **Manage Content**
   - Update mosque title, description, and fundraising goal
   - Upload logo, banner image, and QR code for payments
   - View real-time donation statistics

### For Donors

1. **Visit Landing Page**
   - View mosque information and fundraising progress
   - See recent donations from other contributors

2. **Make a Donation**
   - Click "Donate Now" button
   - Choose preset amount or enter custom amount
   - Optionally provide name, email, and message
   - Option to donate anonymously

## Database Schema

### Models
- **Admin**: Administrator accounts with authentication
- **MosqueContent**: Editable content for the landing page  
- **Donation**: Individual donation records

## API Endpoints

### Public Endpoints
- `POST /api/donate` - Submit a new donation

### Admin Endpoints (Authentication Required)
- `GET /api/admin/content` - Get mosque content
- `PUT /api/admin/content` - Update mosque content
- `POST /api/upload` - Upload images

## Security Features

- Secure admin authentication with NextAuth.js
- Password hashing with bcryptjs
- File upload validation
- SQL injection protection with Prisma
- Environment variable protection

## License

This project is open source and available under the MIT License.

---

**May Allah bless this project and all who contribute to building places of worship.**
