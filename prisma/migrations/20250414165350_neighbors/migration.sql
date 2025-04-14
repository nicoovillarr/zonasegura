/*
  Warnings:

  - You are about to drop the column `hour` on the `Incident` table. All the data in the column will be lost.
  - You are about to drop the column `neighbor` on the `Incident` table. All the data in the column will be lost.
  - Added the required column `neighborId` to the `Incident` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Incident" DROP COLUMN "hour",
DROP COLUMN "neighbor",
ADD COLUMN     "neighborId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Neighbor" (
    "gid" INTEGER NOT NULL,
    "nro" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "codba" TEXT NOT NULL,

    CONSTRAINT "Neighbor_pkey" PRIMARY KEY ("gid")
);

-- AddForeignKey
ALTER TABLE "Incident" ADD CONSTRAINT "Incident_neighborId_fkey" FOREIGN KEY ("neighborId") REFERENCES "Neighbor"("gid") ON DELETE RESTRICT ON UPDATE CASCADE;
