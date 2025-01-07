/*
  Warnings:

  - A unique constraint covering the columns `[userId,courseId]` on the table `CourseEnrollment` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `courseenrollment` ADD COLUMN `enrolledAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX `CourseEnrollment_userId_courseId_key` ON `CourseEnrollment`(`userId`, `courseId`);
