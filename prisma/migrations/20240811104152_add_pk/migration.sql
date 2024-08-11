/*
  Warnings:

  - The primary key for the `lecture_section_professor` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "lecture_section_professor" DROP CONSTRAINT "lecture_section_professor_pkey",
ADD CONSTRAINT "lecture_section_professor_pkey" PRIMARY KEY ("section_id", "lecture_id", "professor_id", "year", "semester");
