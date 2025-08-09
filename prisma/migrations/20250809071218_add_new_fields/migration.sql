-- AlterTable
ALTER TABLE "Donation" ADD COLUMN "notes" TEXT;

-- CreateTable
CREATE TABLE "DonationRecap" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "donationId" TEXT NOT NULL,
    "donorName" TEXT NOT NULL,
    "donorEmail" TEXT,
    "donorPhone" TEXT,
    "transferProof" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_MosqueContent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "goal" REAL NOT NULL,
    "currentAmount" REAL NOT NULL DEFAULT 0,
    "donorCount" INTEGER NOT NULL DEFAULT 0,
    "logoUrl" TEXT,
    "bannerImageUrl" TEXT,
    "qrCodeUrl" TEXT,
    "beforeRenovationImageUrl" TEXT,
    "afterRenovationImageUrl" TEXT,
    "beforeRenovationDesc" TEXT,
    "afterRenovationDesc" TEXT,
    "bankName" TEXT,
    "accountNumber" TEXT,
    "accountName" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_MosqueContent" ("bannerImageUrl", "createdAt", "currentAmount", "description", "goal", "id", "isActive", "logoUrl", "qrCodeUrl", "title", "updatedAt") SELECT "bannerImageUrl", "createdAt", "currentAmount", "description", "goal", "id", "isActive", "logoUrl", "qrCodeUrl", "title", "updatedAt" FROM "MosqueContent";
DROP TABLE "MosqueContent";
ALTER TABLE "new_MosqueContent" RENAME TO "MosqueContent";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
