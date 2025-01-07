import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  Request,
  BadRequestException,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/roles.enum';

@Controller('courses')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  // ✅ Pastikan ini ditaruh sebelum @Get(':id')
  @Get('available')
  async getAllAvailableCourses() {
    return this.coursesService.getAllAvailableCourses();
  }

  @Get()
  async findAll() {
    return this.coursesService.findAll();
  }

  @Get('enrolled')
  async getStudentEnrolledCourses(@Request() req) {
    if (!req.user || !req.user.id) {
      throw new BadRequestException('User tidak terautentikasi.');
    }
    return this.coursesService.getStudentCourses(req.user.id);
  }

  // ✅ Pindahkan ke bawah agar tidak salah membaca "available" sebagai ID
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const courseId = parseInt(id, 10);
    if (isNaN(courseId) || courseId <= 0) {
      throw new BadRequestException('ID course harus berupa angka positif.');
    }
    return this.coursesService.findOne(courseId);
  }

  @Roles(Role.Instructor, Role.Admin)
  @Post()
  async createCourse(
    @Body('title') title: string,
    @Body('description') description: string,
    @Body('category') category: string,
    @Body('price') price: any
  ) {
    const priceValue = parseFloat(price);
    if (isNaN(priceValue) || priceValue < 0) {
      throw new BadRequestException(
        'Harga course harus berupa angka positif atau nol.'
      );
    }
    return this.coursesService.createCourse(
      title,
      description,
      category,
      priceValue
    );
  }

  @Roles(Role.Instructor, Role.Admin)
  @Patch(':id')
  async updateCourse(
    @Param('id') id: string,
    @Body('title') title?: string,
    @Body('description') description?: string,
    @Body('category') category?: string,
    @Body('price') price?: any
  ) {
    const courseId = parseInt(id, 10);
    if (isNaN(courseId) || courseId <= 0) {
      throw new BadRequestException('ID course harus berupa angka positif.');
    }

    const priceValue = price !== undefined ? parseFloat(price) : undefined;
    if (priceValue !== undefined && (isNaN(priceValue) || priceValue < 0)) {
      throw new BadRequestException(
        'Harga course harus berupa angka positif atau nol.'
      );
    }

    return this.coursesService.updateCourse(
      courseId,
      title,
      description,
      category,
      priceValue
    );
  }

  @Roles(Role.Admin)
  @Delete(':id')
  async deleteCourse(@Param('id') id: string) {
    const courseId = parseInt(id, 10);
    if (isNaN(courseId) || courseId <= 0) {
      throw new BadRequestException('ID course harus berupa angka positif.');
    }
    return this.coursesService.deleteCourse(courseId);
  }

  @Post(':id/register')
  async registerStudent(@Param('id') courseId: string, @Request() req) {
    if (!req.user || !req.user.id) {
      throw new BadRequestException('User tidak terautentikasi.');
    }

    const parsedCourseId = parseInt(courseId, 10);
    if (isNaN(parsedCourseId) || parsedCourseId <= 0) {
      throw new BadRequestException('ID course harus berupa angka positif.');
    }

    return this.coursesService.registerStudent(parsedCourseId, req.user.id);
  }
}
