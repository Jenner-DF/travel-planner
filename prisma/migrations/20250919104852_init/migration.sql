/*
  Warnings:

  - You are about to drop the column `name` on the `Trip` table. All the data in the column will be lost.
  - Added the required column `description` to the `Trip` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endDate` to the `Trip` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imageUrl` to the `Trip` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `Trip` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Trip` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Trip` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Trip" DROP COLUMN "name",
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "endDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "imageUrl" TEXT NOT NULL,
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL,
ADD COLUMN     "userId" UUID NOT NULL;
