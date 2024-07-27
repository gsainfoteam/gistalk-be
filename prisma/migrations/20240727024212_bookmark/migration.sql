-- AlterTable
ALTER TABLE "lecture_section" ALTER COLUMN "id" DROP DEFAULT;
DROP SEQUENCE "lecture_section_id_seq";

-- CreateTable
CREATE TABLE "bookmark" (
    "lecture_id" INTEGER NOT NULL,
    "section_id" INTEGER NOT NULL,
    "user_uuid" UUID NOT NULL,

    CONSTRAINT "bookmark_pkey" PRIMARY KEY ("section_id","user_uuid")
);

-- AddForeignKey
ALTER TABLE "bookmark" ADD CONSTRAINT "bookmark_lecture_id_section_id_fkey" FOREIGN KEY ("lecture_id", "section_id") REFERENCES "lecture_section"("id", "lecture_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookmark" ADD CONSTRAINT "bookmark_user_uuid_fkey" FOREIGN KEY ("user_uuid") REFERENCES "user"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;
