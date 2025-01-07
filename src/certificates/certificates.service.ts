    import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
    import { PrismaClient } from '@prisma/client';

    const prisma = new PrismaClient();

    @Injectable()
    export class CertificatesService {
    async issueCertificate(userId: number, courseId: number) {
        const course = await prisma.course.findUnique({ where: { id: courseId } });
        if (!course) {
        throw new NotFoundException('Coursenya ga ditemukan.');
        }

        const totalQuizzes = await prisma.quiz.count({ where: { courseId } });
        const completedQuizzes = await prisma.submission.count({ where: { userId, quiz: { courseId } } });

        if (totalQuizzes === 0) {
        throw new NotFoundException('Course ini tidak memiliki kuis.');
        }

        if (completedQuizzes < totalQuizzes) {
        throw new ForbiddenException('Kamu belum menyelesaikan semua kuis.');
        }

        const existingCertificate = await prisma.certificate.findFirst({
        where: { userId, courseId },
        });

        if (existingCertificate) {
        return { message: 'Kamu sudah memiliki sertifikat untuk course ini.', data: existingCertificate };
        }

        const certificate = await prisma.certificate.create({
        data: {
            userId,
            courseId,
        },
        });

        return {
        message: 'Selamat ya, kamu mendapatkan sertifikat dari course ini :3',
        data: {
            id: certificate.id,
            courseId: certificate.courseId,
            issuedAt: certificate.issuedAt,
        },
        };
    }

    async getUserCertificates(userId: number) {
        const certificates = await prisma.certificate.findMany({
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
        message: 'Daftar sertifikat kamu.',
        data: certificates.map((cert) => ({
            id: cert.id,
            courseId: cert.course.id,
            courseTitle: cert.course.title,
            issuedAt: cert.issuedAt,
        })),
        };
    }
    }
