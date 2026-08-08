import { Controller, Get, Put, Body, Post } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { UpdateProfileDto } from './dto/task.dto';

@Controller('api/user')
export class UsersController {
  constructor(private prisma: PrismaService) {}

  @Get('profile')
  async getProfile() {
    let user = await this.prisma.user.findFirst();
    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email: 'dexter@gmail.com',
          fullName: 'Dexter',
          title: 'Designer',
          username: 'Dexuser',
          avatar: '/avatar.png',
          theme: 'light',
          colorMode: 'blue',
        },
      });
    }
    return user;
  }

  @Put('profile')
  async updateProfile(@Body() dto: UpdateProfileDto) {
    let user = await this.prisma.user.findFirst();
    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email: 'dexter@gmail.com',
          fullName: 'Dexter',
          title: 'Designer',
          username: 'Dexuser',
        },
      });
    }

    return this.prisma.user.update({
      where: { id: user.id },
      data: dto,
    });
  }
}

@Controller('api/auth')
export class AuthController {
  constructor(private prisma: PrismaService) {}

  @Post('guest')
  async loginAsGuest() {
    let user = await this.prisma.user.findFirst({
      where: { email: 'guest@pyramid.app' },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email: 'guest@pyramid.app',
          fullName: 'Guest User',
          title: 'Visitor',
          username: 'guest',
          theme: 'light',
          colorMode: 'blue',
        },
      });
    }

    return {
      token: 'guest-session-token-12345',
      user,
      message: 'Guest login successful',
    };
  }
}
