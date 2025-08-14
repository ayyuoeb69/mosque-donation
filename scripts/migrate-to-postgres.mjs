#!/usr/bin/env node

/**
 * Migration script to help transition from SQLite to PostgreSQL
 * This script provides helpful instructions and checks for the migration
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🏗️  Mosque Donation - PostgreSQL Migration Helper\n');

// Check if .env.local exists
const envPath = '.env.local';
if (!fs.existsSync(envPath)) {
    console.log('❌ .env.local file not found');
    console.log('📝 Please create .env.local from .env.example\n');
    process.exit(1);
}

// Read environment variables
const envContent = fs.readFileSync(envPath, 'utf8');
const databaseUrl = envContent.match(/DATABASE_URL="([^"]+)"/)?.[1];

if (!databaseUrl) {
    console.log('❌ DATABASE_URL not found in .env.local');
    console.log('📝 Please add DATABASE_URL to your .env.local file\n');
    process.exit(1);
}

if (databaseUrl.includes('sqlite') || databaseUrl.includes('file:')) {
    console.log('❌ DATABASE_URL is still using SQLite');
    console.log('📝 Please update DATABASE_URL to use PostgreSQL format:');
    console.log('   postgresql://username:password@localhost:5432/database_name\n');
    process.exit(1);
}

console.log('✅ PostgreSQL DATABASE_URL detected');

try {
    console.log('🔄 Generating Prisma client...');
    execSync('npx prisma generate', { stdio: 'inherit' });
    
    console.log('🔄 Pushing schema to database...');
    execSync('npx prisma db push', { stdio: 'inherit' });
    
    console.log('\n✅ Migration completed successfully!');
    console.log('🎉 Your project is now ready for PostgreSQL');
    console.log('\n📋 Next steps:');
    console.log('1. Test your application locally: npm run dev');
    console.log('2. Create initial admin user if needed');
    console.log('3. Deploy to Vercel following VERCEL_DEPLOYMENT.md');
    
} catch (error) {
    console.log('\n❌ Migration failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Ensure your PostgreSQL database is running');
    console.log('2. Verify DATABASE_URL is correct');
    console.log('3. Check database credentials and permissions');
}
