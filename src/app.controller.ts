import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { PublicRoute } from './auth/constants';
import { RefreshTokenGuard } from './auth/jwt-refresh-auth.guard';
import { LocalAuthGuard } from './auth/local-auth.guard';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private authService: AuthService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @PublicRoute()
  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    const result = await this.authService.login(req.user);
    return {
      statusCode: 200,
      message: 'Login Berhasil',
      result,
    };
  }

  @PublicRoute()
  @UseGuards(RefreshTokenGuard)
  @Get('auth/refresh-login')
  async refreshLogin(@Request() req) {
    const { userId, refreshToken } = req.user;
    // return refreshToken;
    return this.authService.refreshLogin(userId, refreshToken);
  }

  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
