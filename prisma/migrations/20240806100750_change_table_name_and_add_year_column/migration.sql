/*
  Warnings:

  - You are about to drop the `course_registration_rate` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "course_registration_rate" DROP CONSTRAINT "course_registration_rate_lecture_id_section_id_fkey";

-- DropTable
DROP TABLE "course_registration_rate";

-- CreateTable
CREATE TABLE "lecture_section_info" (
    "lecture_id" INTEGER NOT NULL,
    "section_id" INTEGER NOT NULL,
    "capacity" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "registration_count" INTEGER NOT NULL,
    "full_capacity_time" INTEGER NOT NULL,

    CONSTRAINT "lecture_section_info_pkey" PRIMARY KEY ("lecture_id","section_id","year")
);

-- AddForeignKey
ALTER TABLE "lecture_section_info" ADD CONSTRAINT "lecture_section_info_lecture_id_section_id_fkey" FOREIGN KEY ("lecture_id", "section_id") REFERENCES "lecture_section"("id", "lecture_id") ON DELETE RESTRICT ON UPDATE CASCADE;
