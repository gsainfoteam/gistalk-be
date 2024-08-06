-- CreateTable
CREATE TABLE "course_registration_rate" (
    "lecture_id" INTEGER NOT NULL,
    "section_id" INTEGER NOT NULL,
    "capacity" INTEGER NOT NULL,
    "registrationCount" INTEGER NOT NULL,
    "fullCapacityTime" INTEGER NOT NULL,

    CONSTRAINT "course_registration_rate_pkey" PRIMARY KEY ("lecture_id","section_id")
);

-- AddForeignKey
ALTER TABLE "course_registration_rate" ADD CONSTRAINT "course_registration_rate_lecture_id_section_id_fkey" FOREIGN KEY ("lecture_id", "section_id") REFERENCES "lecture_section"("id", "lecture_id") ON DELETE RESTRICT ON UPDATE CASCADE;
