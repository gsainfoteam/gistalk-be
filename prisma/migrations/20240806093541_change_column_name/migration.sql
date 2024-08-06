/*
  Warnings:

  - You are about to drop the column `fullCapacityTime` on the `course_registration_rate` table. All the data in the column will be lost.
  - You are about to drop the column `registrationCount` on the `course_registration_rate` table. All the data in the column will be lost.
  - Added the required column `full_capacity_time` to the `course_registration_rate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `registration_count` to the `course_registration_rate` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "course_registration_rate" DROP COLUMN "fullCapacityTime",
DROP COLUMN "registrationCount",
ADD COLUMN     "full_capacity_time" INTEGER NOT NULL,
ADD COLUMN     "registration_count" INTEGER NOT NULL;
