-- CreateEnum
CREATE TYPE "Semester" AS ENUM ('SPRING', 'SUMMER', 'FALL', 'WINTER', 'ALL');

-- CreateEnum
CREATE TYPE "Recommendation" AS ENUM ('YES', 'NO', 'MAYBE');

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
CREATE TABLE "LectureCode" (
    "code" TEXT NOT NULL,
    "lecture_id" INTEGER NOT NULL,

    CONSTRAINT "LectureCode_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "lecture" (
    "id" SERIAL NOT NULL,
    "lecture_name" TEXT NOT NULL,

    CONSTRAINT "lecture_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lecture_professor" (
    "lectureId" INTEGER NOT NULL,
    "professorId" INTEGER NOT NULL,

    CONSTRAINT "lecture_professor_pkey" PRIMARY KEY ("lectureId","professorId")
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
    "recommendation" "Recommendation" NOT NULL,
    "semester" "Semester" NOT NULL,
    "year" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userUuid" UUID NOT NULL,
    "lectureId" INTEGER NOT NULL,
    "professorId" INTEGER NOT NULL,

    CONSTRAINT "record_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "LectureCode" ADD CONSTRAINT "LectureCode_lecture_id_fkey" FOREIGN KEY ("lecture_id") REFERENCES "lecture"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lecture_professor" ADD CONSTRAINT "lecture_professor_lectureId_fkey" FOREIGN KEY ("lectureId") REFERENCES "lecture"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lecture_professor" ADD CONSTRAINT "lecture_professor_professorId_fkey" FOREIGN KEY ("professorId") REFERENCES "professor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "record" ADD CONSTRAINT "record_userUuid_fkey" FOREIGN KEY ("userUuid") REFERENCES "user"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "record" ADD CONSTRAINT "record_lectureId_professorId_fkey" FOREIGN KEY ("lectureId", "professorId") REFERENCES "lecture_professor"("lectureId", "professorId") ON DELETE RESTRICT ON UPDATE CASCADE;
