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
CREATE TABLE "lecture_code" (
    "code" TEXT NOT NULL,
    "lecture_id" INTEGER NOT NULL,

    CONSTRAINT "lecture_code_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "lecture" (
    "id" SERIAL NOT NULL,
    "lecture_name" TEXT NOT NULL,

    CONSTRAINT "lecture_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lecture_professor" (
    "lecture_id" INTEGER NOT NULL,
    "professor_id" INTEGER NOT NULL,

    CONSTRAINT "lecture_professor_pkey" PRIMARY KEY ("lecture_id","professor_id")
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
    "user_uuid" UUID NOT NULL,
    "lecture_id" INTEGER NOT NULL,
    "professor_id" INTEGER NOT NULL,

    CONSTRAINT "record_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "lecture_code" ADD CONSTRAINT "lecture_code_lecture_id_fkey" FOREIGN KEY ("lecture_id") REFERENCES "lecture"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lecture_professor" ADD CONSTRAINT "lecture_professor_lecture_id_fkey" FOREIGN KEY ("lecture_id") REFERENCES "lecture"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lecture_professor" ADD CONSTRAINT "lecture_professor_professor_id_fkey" FOREIGN KEY ("professor_id") REFERENCES "professor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "record" ADD CONSTRAINT "record_user_uuid_fkey" FOREIGN KEY ("user_uuid") REFERENCES "user"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "record" ADD CONSTRAINT "record_lecture_id_professor_id_fkey" FOREIGN KEY ("lecture_id", "professor_id") REFERENCES "lecture_professor"("lecture_id", "professor_id") ON DELETE RESTRICT ON UPDATE CASCADE;
