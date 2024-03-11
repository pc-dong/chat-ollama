/*
  Warnings:

  - You are about to drop the column `url` on the `KnowledgeBaseFile` table. All the data in the column will be lost.
  - Added the required column `name` to the `KnowledgeBaseFile` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_KnowledgeBaseFile" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "knowledgeBaseId" INTEGER NOT NULL,
    CONSTRAINT "KnowledgeBaseFile_knowledgeBaseId_fkey" FOREIGN KEY ("knowledgeBaseId") REFERENCES "KnowledgeBase" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_KnowledgeBaseFile" ("id", "knowledgeBaseId") SELECT "id", "knowledgeBaseId" FROM "KnowledgeBaseFile";
DROP TABLE "KnowledgeBaseFile";
ALTER TABLE "new_KnowledgeBaseFile" RENAME TO "KnowledgeBaseFile";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
