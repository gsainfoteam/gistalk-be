/*
  Warnings:

  - The primary key for the `lecture_section` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the `lecture_section_info` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `semester` to the `bookmark` table without a default value. This is not possible if the table is not empty.
  - Added the required column `year` to the `bookmark` table without a default value. This is not possible if the table is not empty.
  - Added the required column `capacity` to the `lecture_section` table without a default value. This is not possible if the table is not empty.
  - Added the required column `full_capacity_time` to the `lecture_section` table without a default value. This is not possible if the table is not empty.
  - Added the required column `registration_count` to the `lecture_section` table without a default value. This is not possible if the table is not empty.
  - Added the required column `semester` to the `lecture_section` table without a default value. This is not possible if the table is not empty.
  - Added the required column `year` to the `lecture_section` table without a default value. This is not possible if the table is not empty.
  - Added the required column `semester` to the `lecture_section_professor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `year` to the `lecture_section_professor` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "bookmark" DROP CONSTRAINT "bookmark_lecture_id_section_id_fkey";

-- DropForeignKey
ALTER TABLE "lecture_section_info" DROP CONSTRAINT "lecture_section_info_lecture_id_section_id_fkey";

-- DropForeignKey
ALTER TABLE "lecture_section_professor" DROP CONSTRAINT "lecture_section_professor_section_id_lecture_id_fkey";

-- DropForeignKey
ALTER TABLE "record" DROP CONSTRAINT "record_lecture_id_section_id_fkey";

-- AlterTable
ALTER TABLE "bookmark" ADD COLUMN     "semester" "Semester" NOT NULL,
ADD COLUMN     "year" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "lecture_section" DROP CONSTRAINT "lecture_section_pkey",
ADD COLUMN     "capacity" INTEGER NOT NULL,
ADD COLUMN     "full_capacity_time" INTEGER NOT NULL,
ADD COLUMN     "registration_count" INTEGER NOT NULL,
ADD COLUMN     "semester" "Semester" NOT NULL,
ADD COLUMN     "year" INTEGER NOT NULL,
ADD CONSTRAINT "lecture_section_pkey" PRIMARY KEY ("id", "lecture_id", "year", "semester");

-- AlterTable
ALTER TABLE "lecture_section_professor" ADD COLUMN     "semester" "Semester" NOT NULL,
ADD COLUMN     "year" INTEGER NOT NULL;

-- DropTable
DROP TABLE "lecture_section_info";

-- AddForeignKey
ALTER TABLE "lecture_section_professor" ADD CONSTRAINT "lecture_section_professor_section_id_lecture_id_year_semes_fkey" FOREIGN KEY ("section_id", "lecture_id", "year", "semester") REFERENCES "lecture_section"("id", "lecture_id", "year", "semester") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookmark" ADD CONSTRAINT "bookmark_lecture_id_section_id_year_semester_fkey" FOREIGN KEY ("lecture_id", "section_id", "year", "semester") REFERENCES "lecture_section"("id", "lecture_id", "year", "semester") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "record" ADD CONSTRAINT "record_lecture_id_section_id_year_semester_fkey" FOREIGN KEY ("lecture_id", "section_id", "year", "semester") REFERENCES "lecture_section"("lecture_id", "id", "year", "semester") ON DELETE RESTRICT ON UPDATE CASCADE;
