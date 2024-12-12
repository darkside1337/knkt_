/*
  Warnings:

  - The `gender` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `relationshipStatus` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Made the column `bio` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "bio" SET NOT NULL,
DROP COLUMN "gender",
ADD COLUMN     "gender" "Gender" NOT NULL DEFAULT 'NOT_MENTIONED',
DROP COLUMN "relationshipStatus",
ADD COLUMN     "relationshipStatus" "RelationshipStatus" NOT NULL DEFAULT 'NOT_MENTIONED';
