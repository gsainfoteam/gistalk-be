-- CreateEnum
CREATE TYPE "Semester" AS ENUM ('SPRING', 'SUMMER', 'FALL', 'WINTER', 'ALL');

-- CreateEnum
CREATE TYPE "RECOMMENDATION" AS ENUM ('YES', 'NO', 'MAYBE');

-- CreateTable
CREATE TABLE "user" (
    "uuid" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "consent" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "professor" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "professor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lecture" (
    "id" SERIAL NOT NULL,
    "lecture_code" TEXT[],
    "lecture_name" TEXT NOT NULL,

    CONSTRAINT "lecture_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lecture_professor" (
    "id" SERIAL NOT NULL,
    "lectureId" INTEGER NOT NULL,
    "professorId" INTEGER NOT NULL,

    CONSTRAINT "lecture_professor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "record" (
    "id" SERIAL NOT NULL,
    "difficulty" INTEGER NOT NULL,
    "skill" INTEGER NOT NULL,
    "helpfulness" INTEGER NOT NULL,
    "interest" INTEGER NOT NULL,
    "load" INTEGER NOT NULL,
    "generosity" INTEGER NOT NULL,
    "review" TEXT NOT NULL,
    "recommendation" "RECOMMENDATION" NOT NULL,
    "semester" "Semester" NOT NULL,
    "year" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userUuid" UUID NOT NULL,
    "lectureProfessorId" INTEGER NOT NULL,

    CONSTRAINT "record_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "lecture_professor" ADD CONSTRAINT "lecture_professor_lectureId_fkey" FOREIGN KEY ("lectureId") REFERENCES "lecture"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lecture_professor" ADD CONSTRAINT "lecture_professor_professorId_fkey" FOREIGN KEY ("professorId") REFERENCES "professor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "record" ADD CONSTRAINT "record_userUuid_fkey" FOREIGN KEY ("userUuid") REFERENCES "user"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "record" ADD CONSTRAINT "record_lectureProfessorId_fkey" FOREIGN KEY ("lectureProfessorId") REFERENCES "lecture_professor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
