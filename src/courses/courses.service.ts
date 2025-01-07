import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class CoursesService {
  async findAll() {
    return {
      message: 'Daftar semua course.',
      data: await prisma.course.findMany(),
    };
  }

  async findOne(id: number) {
    if (!id || isNaN(id) || id <= 0) {
      throw new BadRequestException('ID course tidak valid.');
    }

    const course = await prisma.course.findUnique({
      where: { id },
    });

    if (!course) {
      throw new NotFoundException('Course tidak ditemukan.');
    }

    return { message: 'Berhasil mengambil course.', data: course };
  }

  async createCourse(
    title: string,
    description: string,
    category: string,
    price: number
  ) {
    if (price < 0) {
      throw new BadRequestException('Harga course tidak bisa negatif.');
    }

    const newCourse = await prisma.course.create({
      data: { title, description, category, price },
    });

    return { message: 'Berhasil membuat course.', data: newCourse };
  }

  async updateCourse(
    id: number,
    title?: string,
    description?: string,
    category?: string,
    price?: number
  ) {
    if (!id || isNaN(id) || id <= 0) {
      throw new BadRequestException('ID course tidak valid.');
    }

    const existingCourse = await prisma.course.findUnique({ where: { id } });

    if (!existingCourse) {
      throw new NotFoundException('Course tidak ditemukan.');
    }

    if (price !== undefined && price < 0) {
      throw new BadRequestException('Harga course tidak bisa negatif.');
    }

    const updatedCourse = await prisma.course.update({
      where: { id },
      data: { title, description, category, price },
    });

    return { message: 'Berhasil memperbarui course.', data: updatedCourse };
  }

  async deleteCourse(id: number) {
    if (!id || isNaN(id) || id <= 0) {
      throw new BadRequestException('ID course tidak valid.');
    }

    const existingCourse = await prisma.course.findUnique({ where: { id } });

    if (!existingCourse) {
      throw new NotFoundException('Course tidak ditemukan.');
    }

    await prisma.course.delete({ where: { id } });
    return { message: 'Course berhasil dihapus.' };
  }

  async registerStudent(courseId: number, studentId: number) {
    if (!courseId || isNaN(courseId) || courseId <= 0) {
      throw new BadRequestException('ID course tidak valid.');
    }

    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course) {
      throw new NotFoundException('Course tidak ditemukan.');
    }

    const student = await prisma.user.findUnique({
      where: { id: studentId },
      select: { role: true },
    });

    if (!student || student.role !== 'student') {
      throw new ForbiddenException(
        'Hanya student yang dapat mendaftar ke course.'
      );
    }

    const existingEnrollment = await prisma.courseEnrollment.findFirst({
      where: { userId: studentId, courseId }, // ✅ Perbaikan di sini!
    });

    if (existingEnrollment) {
      throw new ForbiddenException('Anda sudah terdaftar di course ini.');
    }

    const enrollment = await prisma.courseEnrollment.create({
      data: { userId: studentId, courseId },
      select: {
        enrolledAt: true,
        course: {
          select: {
            id: true,
            title: true,
            description: true,
            category: true,
            price: true,
          },
        },
      },
    });

    return {
      message: `Berhasil mendaftar ke course "${enrollment.course.title}". Selamat belajar!`,
      data: {
        id: enrollment.course.id,
        title: enrollment.course.title,
        description: enrollment.course.description,
        category: enrollment.course.category,
        price: enrollment.course.price,
        enrolledAt: enrollment.enrolledAt,
      },
    };
  }

  async getStudentCourses(studentId: number) {
    const student = await prisma.user.findUnique({
      where: { id: studentId },
    });

    if (!student) {
      throw new NotFoundException('User tidak ditemukan.');
    }

    const enrolledCourses = await prisma.courseEnrollment.findMany({
      where: { userId: studentId },
      select: {
        enrolledAt: true, // ✅ Pastikan ini ada
        course: {
          select: {
            id: true,
            title: true,
            description: true,
            category: true,
            price: true,
          },
        },
      },
    });

    return {
      message: 'Daftar course yang telah didaftarkan.',
      data: enrolledCourses.map((enrollment) => ({
        id: enrollment.course.id,
        title: enrollment.course.title,
        description: enrollment.course.description,
        category: enrollment.course.category,
        price: enrollment.course.price,
        enrolledAt: enrollment.enrolledAt,
      })),
    };
  }
  async getAllAvailableCourses() {
    const courses = await prisma.course.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        category: true,
        price: true,
        createdAt: true,
      },
    });

    return {
      message: 'Daftar semua course yang tersedia.',
      data: courses,
    };
  }
}
