/*
  Warnings:

  - The primary key for the `lecture_section` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the `_LectureSectionToProfessor` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `lecture_id` to the `record` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_LectureSectionToProfessor" DROP CONSTRAINT "_LectureSectionToProfessor_A_fkey";

-- DropForeignKey
ALTER TABLE "_LectureSectionToProfessor" DROP CONSTRAINT "_LectureSectionToProfessor_B_fkey";

-- DropForeignKey
ALTER TABLE "record" DROP CONSTRAINT "record_section_id_fkey";

-- AlterTable
ALTER TABLE "lecture_section" DROP CONSTRAINT "lecture_section_pkey",
ADD CONSTRAINT "lecture_section_pkey" PRIMARY KEY ("id", "lecture_id");

-- AlterTable
ALTER TABLE "record" ADD COLUMN     "lecture_id" INTEGER NOT NULL;

-- DropTable
DROP TABLE "_LectureSectionToProfessor";

-- CreateTable
CREATE TABLE "lecture_section_professor" (
    "section_id" INTEGER NOT NULL,
    "lecture_id" INTEGER NOT NULL,
    "professor_id" INTEGER NOT NULL,

    CONSTRAINT "lecture_section_professor_pkey" PRIMARY KEY ("section_id","lecture_id","professor_id")
);

-- AddForeignKey
ALTER TABLE "lecture_section_professor" ADD CONSTRAINT "lecture_section_professor_section_id_lecture_id_fkey" FOREIGN KEY ("section_id", "lecture_id") REFERENCES "lecture_section"("id", "lecture_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lecture_section_professor" ADD CONSTRAINT "lecture_section_professor_professor_id_fkey" FOREIGN KEY ("professor_id") REFERENCES "professor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "record" ADD CONSTRAINT "record_lecture_id_section_id_fkey" FOREIGN KEY ("lecture_id", "section_id") REFERENCES "lecture_section"("lecture_id", "id") ON DELETE RESTRICT ON UPDATE CASCADE;
