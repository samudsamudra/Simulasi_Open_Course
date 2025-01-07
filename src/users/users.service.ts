    import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
    import { PrismaClient } from '@prisma/client';
    import * as bcrypt from 'bcrypt';

    const prisma = new PrismaClient();
    const SALT_ROUNDS = 10; // Jumlah salt untuk hashing

    @Injectable()
    export class UsersService {
    async findAll(requestUser: any) {
        if (requestUser.role === 'admin') {
        // Admin bisa melihat semua pengguna dengan data lengkap
        return {
            message: 'Berhasil mengambil daftar pengguna.',
            data: await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                role: true,
                createdAt: true,
            },
            }),
        };
        } else if (requestUser.role === 'student') {
        // Student hanya bisa melihat student lain (hanya email dan role)
        return {
            message: 'Berhasil mengambil daftar sesama temen-temen mu nih.',
            data: await prisma.user.findMany({
            where: { role: 'student' },
            select: {
                email: true,
                role: true,
            },
            }),
        };
        } else {
        throw new ForbiddenException('Anda tidak memiliki izin untuk melihat daftar pengguna.');
        }
    }

    async findOne(id: number, requestUser: any) {
        const user = await prisma.user.findUnique({
        where: { id },
        select: {
            id: true,
            email: true,
            role: true,
            createdAt: true,
        },
        });

        if (!user) throw new NotFoundException('Pengguna tidak ditemukan.');

        // Student hanya bisa melihat student lain
        if (requestUser.role === 'student' && user.role !== 'student') {
        throw new ForbiddenException('Anda hanya bisa melihat data sesama student.');
        }

        return { message: 'Berhasil mengambil data pengguna.', data: user };
    }

    async createUser(email: string, password: string, role: string) {
        // Hash password sebelum menyimpan ke database
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        const user = await prisma.user.create({
        data: { email, password: hashedPassword, role },
        select: {
            id: true,
            email: true,
            role: true,
            createdAt: true,
        },
        });

        return {
        message: `Yey! Berhasil menambahkan kamu sebagai ${role}. Selamat belajar!`,
        data: user,
        };
    }

    async updateUser(id: number, email?: string, password?: string, role?: string) {
        let dataToUpdate: any = { email, role };

        // Jika password di-update, hash terlebih dahulu
        if (password) {
        dataToUpdate.password = await bcrypt.hash(password, SALT_ROUNDS);
        }

        const updatedUser = await prisma.user.update({
        where: { id },
        data: dataToUpdate,
        select: {
            id: true,
            email: true,
            role: true,
            createdAt: true,
        },
        });

        return {
        message: `Berhasil memperbarui data pengguna dengan ID ${id}.`,
        data: updatedUser,
        };
    }

    async deleteUser(id: number) {
        await prisma.user.delete({ where: { id } });
        return { message: `Akun dengan ID ${id} telah berhasil dihapus.` };
    }

    async findByEmail(email: string) {
        return prisma.user.findUnique({ where: { email } });
    }
    }
