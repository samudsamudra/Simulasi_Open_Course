import { Controller, Get, Post, Param, UseGuards, Request, BadRequestException, NotFoundException, Res } from '@nestjs/common';
import { Response } from 'express';
import { CertificatesService } from './certificates.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import * as fs from 'fs';
import * as path from 'path';

@Controller('certificates')
@UseGuards(JwtAuthGuard)
export class CertificatesController {
  constructor(private readonly certificatesService: CertificatesService) {}

  @Post(':courseId')
  async issueCertificate(@Request() req, @Param('courseId') courseId: string) {
    const userId = req.user?.id;
    if (!userId) {
      throw new BadRequestException('User tidak terautentikasi.');
    }

    const parsedCourseId = Number(courseId);
    if (isNaN(parsedCourseId) || parsedCourseId <= 0) {
      throw new BadRequestException('ID course harus berupa angka positif.');
    }

    return this.certificatesService.issueCertificate(userId, parsedCourseId);
  }

  @Get('my-certificates')
  async getUserCertificates(@Request() req) {
    const userId = req.user?.id;
    if (!userId) {
      throw new BadRequestException('User tidak terautentikasi.');
    }

    return this.certificatesService.getUserCertificates(userId);
  }

  @Get('download/:userId/:courseId')
  async downloadCertificate(@Param('userId') userId: string, @Param('courseId') courseId: string, @Res() res: Response) {
    const filePath = path.join(process.cwd(), `public/certificates/${userId}_${courseId}.pdf`);

    if (!fs.existsSync(filePath)) {
      throw new NotFoundException('Sertifikat tidak ditemukan.');
    }

    return res.download(filePath);
  }
}
