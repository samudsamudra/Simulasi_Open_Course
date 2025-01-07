    import { Controller, Get, Post, Param, Body, UseGuards, BadRequestException } from '@nestjs/common';
    import { QuizzesService } from './quizzes.service';
    import { JwtAuthGuard } from '../auth/jwt-auth.guard';
    import { RolesGuard } from '../auth/roles.guard';
    import { Roles } from '../auth/roles.decorator';
    import { Role } from '../auth/roles.enum';

    @Controller('quizzes')
    @UseGuards(JwtAuthGuard, RolesGuard)
    export class QuizzesController {
    constructor(private readonly quizzesService: QuizzesService) {}

    @Roles(Role.Instructor, Role.Admin)
    @Post()
    async createQuiz(
        @Body('courseId') courseId: number,
        @Body('question') question: string,
        @Body('options') options: string[],
        @Body('correctAnswer') correctAnswer: string,
    ) {
        if (!Array.isArray(options) || options.length < 2) {
        throw new BadRequestException('Opsi harus minimal 2.');
        }

        return this.quizzesService.createQuiz(courseId, question, options, correctAnswer);
    }

    @Get('course/:courseId')
    async getCourseQuizzes(@Param('courseId') courseId: string) {
        return this.quizzesService.getCourseQuizzes(Number(courseId));
    }

    @Get(':id')
    async getQuizById(@Param('id') quizId: string) {
        return this.quizzesService.getQuizById(Number(quizId));
    }
    }
