    import { Injectable, UnauthorizedException } from '@nestjs/common';
    import { UsersService } from '../users/users.service';
    import { JwtService } from '@nestjs/jwt';
    import * as bcrypt from 'bcrypt';

    @Injectable()
    export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) {}

    async login(email: string, password: string) {
        const user = await this.usersService.findByEmail(email);
        if (!user) {
        throw new UnauthorizedException('Email atau password salah.');
        }

        // Periksa apakah password cocok
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
        throw new UnauthorizedException('Email atau password salah.');
        }

        // Generate JWT Token
        const payload = { id: user.id, email: user.email, role: user.role };
        const token = this.jwtService.sign(payload);

        return {
        message: 'Login berhasil!',
        token,
        user: {
            id: user.id,
            email: user.email,
            role: user.role,
        },
        };
    }
    }
