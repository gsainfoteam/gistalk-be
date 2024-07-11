-- CreateTable
CREATE TABLE "record_like" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),
    "user_uuid" UUID NOT NULL,
    "record_id" INTEGER NOT NULL,

    CONSTRAINT "record_like_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "record_like" ADD CONSTRAINT "record_like_user_uuid_fkey" FOREIGN KEY ("user_uuid") REFERENCES "user"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "record_like" ADD CONSTRAINT "record_like_record_id_fkey" FOREIGN KEY ("record_id") REFERENCES "record"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
