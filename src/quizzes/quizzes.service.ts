    import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
    import { PrismaClient } from '@prisma/client';

    const prisma = new PrismaClient();

    @Injectable()
    export class QuizzesService {
    async createQuiz(courseId: number, question: string, options: string[], correctAnswer: string) {
        const course = await prisma.course.findUnique({ where: { id: courseId } });
        if (!course) {
        throw new NotFoundException('Course tidak ditemukan.');
        }

        if (!options.includes(correctAnswer)) {
        throw new BadRequestException('Jawaban yang benar harus ada di antara opsi yang diberikan.');
        }

        const quiz = await prisma.quiz.create({
        data: {
            courseId,
            question,
            options,
            correctAnswer,
        },
        });

        return {
        message: 'Kuis berhasil dibuat!',
        data: quiz,
        };
    }

    async getCourseQuizzes(courseId: number) {
        const quizzes = await prisma.quiz.findMany({
        where: { courseId },
        select: {
            id: true,
            question: true,
            options: true,
        },
        });

        return {
        message: 'Daftar kuis untuk course ini.',
        data: quizzes,
        };
    }

    async getQuizById(quizId: number) {
        const quiz = await prisma.quiz.findUnique({
        where: { id: quizId },
        select: {
            id: true,
            question: true,
            options: true,
        },
        });

        if (!quiz) {
        throw new NotFoundException('Kuis tidak ditemukan.');
        }

        return {
        message: 'Detail kuis.',
        data: quiz,
        };
    }
    }
