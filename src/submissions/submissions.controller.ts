import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  UseGuards,
  Request,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { SubmissionsService } from './submissions.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/roles.enum';

@Controller('submissions')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SubmissionsController {
  constructor(private readonly submissionsService: SubmissionsService) {}

  @Post()
  async submitAnswer(
    @Request() req,
    @Body('quizId') quizId: number,
    @Body('answer') answer: string
  ) {
    if (!req.user || !req.user.id) {
      throw new BadRequestException('User tidak terautentikasi.');
    }

    return this.submissionsService.submitAnswer(req.user.id, quizId, answer);
  }

  @Get('student')
  async getSubmissionsByStudent(@Request() req) {
    if (!req.user || !req.user.id) {
      throw new BadRequestException('User tidak terautentikasi.');
    }

    return this.submissionsService.getSubmissionsByStudent(req.user.id);
  }

  @Roles(Role.Instructor, Role.Admin)
  @Get('quiz/:quizId')
  async getSubmissionsForQuiz(@Param('quizId') quizId: string) {
    return this.submissionsService.getSubmissionsForQuiz(Number(quizId));
  }
}
