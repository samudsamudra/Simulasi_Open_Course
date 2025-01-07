import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class SubmissionsService {
  async submitAnswer(userId: number, quizId: number, answer: string) {
    const quiz = await prisma.quiz.findUnique({ where: { id: quizId } });
    if (!quiz) {
      throw new NotFoundException('Kuis tidak ditemukan.');
    }

    const existingSubmission = await prisma.submission.findFirst({
      where: { userId, quizId },
    });

    if (existingSubmission) {
      throw new ForbiddenException(
        'Anda sudah mengirim jawaban untuk kuis ini.'
      );
    }

    const submission = await prisma.submission.create({
      data: {
        userId,
        quizId,
        answer,
      },
    });

    const isCorrect = quiz.correctAnswer === answer;
    const resultMessage = isCorrect ? 'Jawaban benar! ✅' : 'Jawaban salah ❌';

    return {
      message: `Jawaban Anda telah dikirim.`,
      result: resultMessage,
      data: {
        id: submission.id,
        quizId: submission.quizId,
        submittedAt: submission.submittedAt,
      },
    };
  }

  async getSubmissionsByStudent(userId: number) {
    const submissions = await prisma.submission.findMany({
      where: { userId },
      include: {
        quiz: {
          select: {
            id: true,
            question: true,
          },
        },
      },
    });

    return {
      message: 'Daftar submission Anda.',
      data: submissions.map((submission) => ({
        id: submission.id,
        quizId: submission.quiz.id,
        question: submission.quiz.question,
        submittedAnswer: submission.answer,
        submittedAt: submission.submittedAt,
      })),
    };
  }

  async getSubmissionsForQuiz(quizId: number) {
    const submissions = await prisma.submission.findMany({
      where: { quizId },
      include: {
        user: {
          select: { id: true, email: true },
        },
      },
    });

    return {
      message: 'Daftar submission untuk kuis ini.',
      data: submissions.map((submission) => ({
        id: submission.id,
        userId: submission.user.id,
        email: submission.user.email,
        answer: submission.answer,
        submittedAt: submission.submittedAt,
      })),
    };
  }
}
