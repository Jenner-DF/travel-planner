-- DropForeignKey
ALTER TABLE "public"."Location" DROP CONSTRAINT "Location_tripId_fkey";

-- AddForeignKey
ALTER TABLE "public"."Location" ADD CONSTRAINT "Location_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "public"."Trip"("id") ON DELETE CASCADE ON UPDATE CASCADE;
