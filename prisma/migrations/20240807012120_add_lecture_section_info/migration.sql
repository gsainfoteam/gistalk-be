-- CreateTable
CREATE TABLE "lecture_section_info" (
    "lecture_id" INTEGER NOT NULL,
    "section_id" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "capacity" INTEGER NOT NULL,
    "registration_count" INTEGER NOT NULL,
    "full_capacity_time" INTEGER NOT NULL,

    CONSTRAINT "lecture_section_info_pkey" PRIMARY KEY ("lecture_id","section_id","year")
);

-- AddForeignKey
ALTER TABLE "lecture_section_info" ADD CONSTRAINT "lecture_section_info_lecture_id_section_id_fkey" FOREIGN KEY ("lecture_id", "section_id") REFERENCES "lecture_section"("id", "lecture_id") ON DELETE RESTRICT ON UPDATE CASCADE;
