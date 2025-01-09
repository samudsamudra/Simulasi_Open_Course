import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class ReviewsService {
  async createReview(userId: number, courseId: number, rating: number, comment?: string) {
    if (rating < 1 || rating > 5) {
      throw new BadRequestException('Rating harus antara 1 dan 5.');
    }

    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course) {
      throw new NotFoundException('Course tidak ditemukan.');
    }

    const enrollment = await prisma.courseEnrollment.findFirst({ where: { userId, courseId } });
    if (!enrollment) {
      throw new ForbiddenException('Anda belum terdaftar di course ini.');
    }

    const existingReview = await prisma.review.findFirst({ where: { userId, courseId } });
    if (existingReview) {
      throw new ForbiddenException('Anda sudah memberikan review untuk course ini.');
    }

    const review = await prisma.review.create({
      data: { userId, courseId, rating, comment },
    });

    return { message: 'Review berhasil ditambahkan.', data: review };
  }

  async getCourseReviews(courseId: number) {
    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course) {
      throw new NotFoundException('Course tidak ditemukan.');
    }

    const reviews = await prisma.review.findMany({
      where: { courseId },
      include: {
        user: { select: { email: true } },
      },
    });

    return {
      message: 'Daftar review untuk course ini.',
      data: reviews.map(review => ({
        id: review.id,
        userEmail: review.user.email,
        rating: review.rating,
        comment: review.comment,
        createdAt: review.createdAt,
      })),
    };
  }

  async getCourseRating(courseId: number) {
    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course) {
      throw new NotFoundException('Course tidak ditemukan.');
    }

    const ratings = await prisma.review.aggregate({
      where: { courseId },
      _avg: { rating: true },
      _count: { rating: true },
    });

    return {
      message: 'Rata-rata rating untuk course ini.',
      averageRating: ratings._avg.rating || 0,
      totalReviews: ratings._count.rating,
    };
  }

  async deleteReview(userId: number, reviewId: number) {
    const review = await prisma.review.findUnique({ where: { id: reviewId } });
    if (!review) {
      throw new NotFoundException('Review tidak ditemukan.');
    }

    if (review.userId !== userId) {
      throw new ForbiddenException('Anda hanya dapat menghapus review milik Anda sendiri.');
    }

    await prisma.review.delete({ where: { id: reviewId } });

    return { message: 'Review berhasil dihapus.' };
  }
  async updateReview(userId: number, reviewId: number, rating: number, comment?: string) {
    const review = await prisma.review.findUnique({where: {id: reviewId}});
    if (!review) {
      throw new NotFoundException('Review tidak ditemukan.');
    }

    if (review.userId !== userId) {
      throw new ForbiddenException('Kamu cuma bisa memperbarui review milik kamu sendiri.');
    }
    if (rating < 1 || rating > 5) {
      throw new BadRequestException('Kamu cuma bisa kasi review antara 1 dan 5.');
    }
    const updateReview = await prisma.review.update({
      where: {id: reviewId},
      data: {rating, comment},
    });

    return {message: 'yey review berhasil diperbarui.', data: updateReview};
  }
  
  async getUserReviews(userId: number) {
    const reviews = await prisma.review.findMany({
      where: { userId },
      include: {
        course: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });
  
    return {
      message: 'Daftar review yang telah kamu buat.',
      data: reviews.map((review) => ({
        id: review.id,
        courseId: review.course.id,
        courseTitle: review.course.title,
        rating: review.rating,
        comment: review.comment,
        createdAt: review.createdAt,
      })),
    };
  }
  
}
