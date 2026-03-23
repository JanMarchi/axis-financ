import { Controller, Post, Body, Get, UseGuards, Request, Response } from '@nestjs/common';
import { Response as ExpResponse } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  async login(@Body() dto: LoginDto, @Response() res: ExpResponse) {
    const result = await this.authService.login(dto);

    // Set HttpOnly cookies
    res.cookie('accessToken', result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000,
    });

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      data: result.user,
    });
  }

  @Post('refresh')
  async refresh(@Request() req, @Response() res: ExpResponse) {
    const token = req.cookies.refreshToken;
    if (!token) throw new Error('No refresh token');

    const result = await this.authService.refreshToken(token);

    res.cookie('accessToken', result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 15 * 60 * 1000,
    });

    return res.json({ data: { success: true } });
  }

  @Post('logout')
  logout(@Response() res: ExpResponse) {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    return res.json({ data: { success: true } });
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@Request() req) {
    return { data: req.user };
  }
}
