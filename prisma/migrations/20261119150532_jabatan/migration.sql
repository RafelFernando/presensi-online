-- CreateTable
CREATE TABLE "Jabatan" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "nama_jabatan" TEXT NOT NULL,

    CONSTRAINT "Jabatan_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Jabatan" ADD CONSTRAINT "Jabatan_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
