/*
  Warnings:

  - Added the required column `address` to the `Location` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Location" ADD COLUMN     "address" TEXT NOT NULL;
