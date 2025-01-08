import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as PDFDocument from 'pdfkit';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

@Injectable()
export class CertificatesService {
  async issueCertificate(userId: number, courseId: number) {
    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course) {
      throw new NotFoundException('Course tidak ditemukan.');
    }

    const enrollment = await prisma.courseEnrollment.findFirst({
      where: { userId, courseId },
    });

    if (!enrollment) {
      throw new ForbiddenException('Anda belum terdaftar di course ini.');
    }

    const totalQuizzes = await prisma.quiz.count({ where: { courseId } });
    const completedQuizzes = await prisma.submission.count({
      where: { userId, quiz: { courseId } },
    });

    if (totalQuizzes > 0 && completedQuizzes < totalQuizzes) {
      throw new ForbiddenException('Anda belum menyelesaikan semua kuis.');
    }

    const existingCertificate = await prisma.certificate.findFirst({
      where: { userId, courseId },
    });

    if (existingCertificate) {
      return {
        message: 'Anda sudah memiliki sertifikat untuk course ini.',
        data: existingCertificate,
      };
    }

    const certificate = await prisma.certificate.create({
      data: {
        userId,
        courseId,
      },
    });

    // Generate Sertifikat PDF
    const pdfPath = await this.generateCertificatePDF(userId, courseId);

    return {
      message: 'Selamat! Anda mendapatkan sertifikat dari course ini 🎉',
      data: {
        id: certificate.id,
        courseId: certificate.courseId,
        issuedAt: certificate.issuedAt,
        pdfUrl: pdfPath,
      },
    };
  }

  async generateCertificatePDF(userId: number, courseId: number): Promise<string> {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    const course = await prisma.course.findUnique({ where: { id: courseId } });

    if (!user || !course) {
      throw new NotFoundException('User atau course tidak ditemukan.');
    }

    
    const certificatesFolder = path.join(process.cwd(), 'public/certificates');
    if (!fs.existsSync(certificatesFolder)) {
      fs.mkdirSync(certificatesFolder, { recursive: true });
    }

    const filePath = path.join(certificatesFolder, `${userId}_${courseId}.pdf`);
    console.log(`📂 Generating certificate: ${filePath}`);

    const doc = new PDFDocument({ size: 'A4', layout: 'landscape' });
    doc.pipe(fs.createWriteStream(filePath));

    doc
      .fontSize(24)
      .text('Certificate of Completion', { align: 'center' })
      .moveDown();

    doc
      .fontSize(20)
      .text(`Diberikan kepada:`, { align: 'center' })
      .moveDown(0.5);

    doc
      .fontSize(28)
      .text(`${user.email}`, { align: 'center', bold: true })
      .moveDown();

    doc
      .fontSize(20)
      .text(`Karena telah menyelesaikan course:`, { align: 'center' })
      .moveDown(0.5);

    doc
      .fontSize(28)
      .text(`"${course.title}"`, { align: 'center', bold: true })
      .moveDown();

    doc
      .fontSize(16)
      .text(`Diterbitkan pada: ${new Date().toLocaleDateString()}`, { align: 'center' });

    doc.end();

    console.log(`Certificate generated: ${filePath}`);
    return `/certificates/${userId}_${courseId}.pdf`;
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
      message: 'Daftar sertifikat Anda.',
      data: certificates.map((cert) => {
        const pdfPath = path.join(process.cwd(), `public/certificates/${cert.userId}_${cert.courseId}.pdf`);
        const fileExists = fs.existsSync(pdfPath);

        return {
          id: cert.id,
          courseId: cert.course.id,
          courseTitle: cert.course.title,
          issuedAt: cert.issuedAt,
          pdfUrl: fileExists ? `/certificates/${cert.userId}_${cert.courseId}.pdf` : null,
        };
      }),
    };
  }
}
