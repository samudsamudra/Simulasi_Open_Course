import { Module } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [CoursesController],
  providers: [CoursesService, PrismaService], // ✅ Pastikan PrismaService di-provide
})
export class CoursesModule {}
