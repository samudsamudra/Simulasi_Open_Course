    import { Controller, Get, Post, Param, UseGuards, Request, BadRequestException, NotFoundException } from '@nestjs/common';
    import { CertificatesService } from './certificates.service';
    import { JwtAuthGuard } from '../auth/jwt-auth.guard';

    @Controller('certificates')
    @UseGuards(JwtAuthGuard) // Menggunakan autentikasi JWT
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

        const certificates = await this.certificatesService.getUserCertificates(userId);
        if (!certificates.data.length) {
        throw new NotFoundException('Anda belum memiliki sertifikat.');
        }

        return certificates;
    }
    }
