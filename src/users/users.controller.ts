import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/roles.enum';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(@Request() req) {
    return this.usersService.findAll(req.user);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    return this.usersService.findOne(Number(id), req.user);
  }

  @Post()
  async createUser(
    @Body('email') email: string,
    @Body('password') password: string,
    @Body('role') role: string
  ) {
    return this.usersService.createUser(email, password, role);
  }

  @Roles(Role.Admin)
  @Patch(':id')
  async updateUser(
    @Param('id') id: string,
    @Body('email') email?: string,
    @Body('password') password?: string,
    @Body('role') role?: string
  ) {
    return this.usersService.updateUser(Number(id), email, password, role);
  }

  @Roles(Role.Admin)
  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUser(Number(id));
  }
}
