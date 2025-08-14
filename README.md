# Mosque Donation Project

A comprehensive donation management system built with Next.js 15, designed specifically for mosque fundraising campaigns.

## ✨ Features

### 🏛️ Public Features
- **Modern Landing Page** - Responsive design with mosque information
- **Donation System** - Secure donation collection with receipt generation
- **Progress Tracking** - Real-time funding progress with visual indicators
- **Construction Progress** - Photo timeline of building progress
- **Prayer Requests** - Community prayer submission system
- **Social Media Integration** - WhatsApp, Email, Instagram, Twitter, TikTok links
- **SEO Optimized** - Dynamic metadata, structured data, sitemap

### 🔐 Admin Features
- **Content Management** - Update mosque information, goals, descriptions
- **Image Management** - Upload logos, banners, before/after photos
- **Progress Images** - Manage construction progress photos with captions
- **Donation Verification** - Review and approve donation confirmations
- **PDF Proposals** - Upload and manage detailed project proposals

### 🌐 Multi-language Support
- **Indonesian Interface** - Fully localized for Indonesian users
- **Cultural Sensitivity** - Islamic-appropriate design and messaging

## 🚀 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Database**: PostgreSQL (via Prisma ORM)
- **Authentication**: NextAuth.js
- **File Storage**: Cloudinary (production) / Local (development)
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + Lucide Icons
- **Forms**: React Hook Form + Zod validation
- **Deployment**: Vercel

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

## 🚀 Deployment

### Vercel Deployment (Recommended)

This project is optimized for Vercel deployment with PostgreSQL and Cloudinary.

**Quick Deploy:**
1. Push your code to GitHub
2. Connect to Vercel
3. Set environment variables
4. Deploy!

**For detailed step-by-step instructions, see [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)**

### Database Migration

If migrating from SQLite to PostgreSQL:
```bash
npm run migrate-to-postgres
```

## 📦 Environment Variables

### Required
```env
DATABASE_URL=               # PostgreSQL connection string
NEXTAUTH_URL=              # Your domain URL
NEXTAUTH_SECRET=           # 32-character secret key
ADMIN_EMAIL=               # Admin login email
ADMIN_PASSWORD=            # Admin login password
NEXT_PUBLIC_SITE_URL=      # Public site URL
```

### Optional (Production)
```env
CLOUDINARY_CLOUD_NAME=     # Cloudinary cloud name
CLOUDINARY_API_KEY=        # Cloudinary API key
CLOUDINARY_API_SECRET=     # Cloudinary API secret
```

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
