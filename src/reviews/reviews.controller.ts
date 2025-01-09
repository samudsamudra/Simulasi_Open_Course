import { Controller, Get, Post, Delete, Param, Body, UseGuards, Request, BadRequestException, Patch } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { request } from 'http';

@Controller('reviews')
@UseGuards(JwtAuthGuard)
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post(':courseId')
  async createReview(
    @Request() req,
    @Param('courseId') courseId: string,
    @Body('rating') rating: number,
    @Body('comment') comment?: string
  ) {
    const userId = req.user?.id;
    if (!userId) {
      throw new BadRequestException('User tidak terautentikasi.');
    }

    const parsedCourseId = Number(courseId);
    if (isNaN(parsedCourseId) || parsedCourseId <= 0) {
      throw new BadRequestException('ID course harus berupa angka positif.');
    }

    return this.reviewsService.createReview(userId, parsedCourseId, rating, comment);
  }

  @Get('course/:courseId')
  async getCourseReviews(@Param('courseId') courseId: string) {
    const parsedCourseId = Number(courseId);
    if (isNaN(parsedCourseId) || parsedCourseId <= 0) {
      throw new BadRequestException('ID course harus berupa angka positif.');
    }

    return this.reviewsService.getCourseReviews(parsedCourseId);
  }

  @Get('course/:courseId/rating')
  async getCourseRating(@Param('courseId') courseId: string) {
    const parsedCourseId = Number(courseId);
    if (isNaN(parsedCourseId) || parsedCourseId <= 0) {
      throw new BadRequestException('ID course harus berupa angka positif.');
    }

    return this.reviewsService.getCourseRating(parsedCourseId);
  }

  @Delete(':reviewId')
  async deleteReview(@Request() req, @Param('reviewId') reviewId: string) {
    const userId = req.user?.id;
    if (!userId) {
      throw new BadRequestException('User tidak terautentikasi.');
    }

    const parsedReviewId = Number(reviewId);
    if (isNaN(parsedReviewId) || parsedReviewId <= 0) {
      throw new BadRequestException('ID review harus berupa angka positif.');
    }

    return this.reviewsService.deleteReview(userId, parsedReviewId);
  }
  @Patch(':reviewId')
  async updateReview(
    @Request() req,
    @Param('reviewId') reviewId: string,
    @Body('rating') rating?: number,
    @Body('comment') comment?: string
  ) {
    const userId = req.user?.id;
    if (!userId) {
      throw new BadRequestException('User tidak terautentikasi.');
    }
  
    const parsedReviewId = Number(reviewId);
    if (isNaN(parsedReviewId) || parsedReviewId <= 0) {
      throw new BadRequestException('ID review harus berupa angka positif.');
    }
  
    return this.reviewsService.updateReview(userId, parsedReviewId, rating, comment);
  }
  @Get('my-reviews')
  async getMyReviews(@Request() req) {
    const userId = req.user?.id;
    if (!userId) {
      throw new BadRequestException('User tidak terautentikasi.');
    }

    return this.reviewsService.getUserReviews(userId);
  }
}