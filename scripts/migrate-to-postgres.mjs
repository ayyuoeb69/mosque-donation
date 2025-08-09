#!/usr/bin/env node

import { PrismaClient } from "@prisma/client";
import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

async function migrateToPostgres() {
  console.log("🚀 Starting migration from SQLite to PostgreSQL...");

  try {
    // 1. Generate Prisma client for new schema
    console.log("📦 Generating Prisma client...");
    execSync("npx prisma generate", { stdio: "inherit" });

    // 2. Create new migration for PostgreSQL
    console.log("🗄️ Creating PostgreSQL migration...");
    execSync("npx prisma migrate dev --name migrate-to-postgres", {
      stdio: "inherit",
    });

    // 3. Seed the new database
    console.log("🌱 Seeding new database...");
    execSync("node scripts/seed.mjs", { stdio: "inherit" });

    console.log("✅ Migration completed successfully!");
    console.log("\n📝 Next steps:");
    console.log("1. Update your DATABASE_URL environment variable");
    console.log("2. Deploy to Vercel");
    console.log("3. Run: npx prisma migrate deploy");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

migrateToPostgres();
