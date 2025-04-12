import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.tto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from 'src/user/entities/user.entity';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { GoogleAuthGuard } from './guards/google-auth';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('refresh')
  async refreshToken(
    @Body() RefreshTokenDto: RefreshTokenDto,
    @CurrentUser() user: User,
  ) {
    return this.authService.refreshToken(
      user._id as string,
      RefreshTokenDto.refreshToken,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@CurrentUser() user: User) {
    return this.authService.logout(user._id as string);
  }

  @UseGuards(GoogleAuthGuard)
  @Get('google')
  async googleAuth() {
    //this route initiates google authentication
  }

  @UseGuards(GoogleAuthGuard)
  @Get('google/callback')
  async googleAuthCallback(@Req() req: Request) {
    return this.authService.googleLogin(req.user);
  }

  @UseGuards(AuthGuard('snapchat'))
  @Get('snapchat')
  async snapchatAuth() {
    // this route initiates Snapchat authentication
  }

  @UseGuards(AuthGuard('snapchat'))
  @Get('snapchat/callback')
  async snapchatAuthCallback(@Req() req: Request) {
    return this.authService.snapChatLogin(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@CurrentUser() user: User) {
    return user;
  }
}
