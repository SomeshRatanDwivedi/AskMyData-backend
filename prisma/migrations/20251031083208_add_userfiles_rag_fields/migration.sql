/*
  Warnings:

  - You are about to drop the column `chromaIds` on the `UserFiles` table. All the data in the column will be lost.
  - You are about to drop the column `chunks` on the `UserFiles` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_UserFiles" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "originalName" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "qDrantIds" JSONB,
    CONSTRAINT "UserFiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("userId") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_UserFiles" ("createdAt", "filePath", "id", "mimeType", "originalName", "size", "status", "userId") SELECT "createdAt", "filePath", "id", "mimeType", "originalName", "size", "status", "userId" FROM "UserFiles";
DROP TABLE "UserFiles";
ALTER TABLE "new_UserFiles" RENAME TO "UserFiles";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
