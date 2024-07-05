/*
  Warnings:

  - You are about to drop the column `lecture_id` on the `record` table. All the data in the column will be lost.
  - You are about to drop the column `professor_id` on the `record` table. All the data in the column will be lost.
  - You are about to drop the `lecture_professor` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `section_id` to the `record` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "lecture_professor" DROP CONSTRAINT "lecture_professor_lecture_id_fkey";

-- DropForeignKey
ALTER TABLE "lecture_professor" DROP CONSTRAINT "lecture_professor_professor_id_fkey";

-- DropForeignKey
ALTER TABLE "record" DROP CONSTRAINT "record_lecture_id_professor_id_fkey";

-- AlterTable
ALTER TABLE "record" DROP COLUMN "lecture_id",
DROP COLUMN "professor_id",
ADD COLUMN     "section_id" INTEGER NOT NULL;

-- DropTable
DROP TABLE "lecture_professor";

-- CreateTable
CREATE TABLE "lecture_section" (
    "id" SERIAL NOT NULL,
    "lecture_id" INTEGER NOT NULL,

    CONSTRAINT "lecture_section_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lecture_section_professor" (
    "section_id" INTEGER NOT NULL,
    "professor_id" INTEGER NOT NULL,

    CONSTRAINT "lecture_section_professor_pkey" PRIMARY KEY ("section_id","professor_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "lecture_section_professor_section_id_key" ON "lecture_section_professor"("section_id");

-- AddForeignKey
ALTER TABLE "lecture_section" ADD CONSTRAINT "lecture_section_lecture_id_fkey" FOREIGN KEY ("lecture_id") REFERENCES "lecture"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lecture_section_professor" ADD CONSTRAINT "lecture_section_professor_section_id_fkey" FOREIGN KEY ("section_id") REFERENCES "lecture_section"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lecture_section_professor" ADD CONSTRAINT "lecture_section_professor_professor_id_fkey" FOREIGN KEY ("professor_id") REFERENCES "professor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "record" ADD CONSTRAINT "record_section_id_fkey" FOREIGN KEY ("section_id") REFERENCES "lecture_section"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
