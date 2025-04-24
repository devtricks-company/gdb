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
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @ApiOperation({ summary: 'login user' })
  @ApiResponse({ status: 201, description: 'User successfully loged in' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'UnAuthorized' })
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('register')
    @ApiOperation({ summary: 'register user' })
  @ApiResponse({ status: 201, description: 'User successfully registerd' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'UnAuthorized' })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('refresh')
  @ApiOperation({ summary: 'refresh token' })
  @ApiResponse({ status: 201, description: 'refresh token successfully changd' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'UnAuthorized' })
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
  @ApiOperation({ summary: 'logout' })
  @ApiResponse({ status: 201, description: 'logout successfully done' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'UnAuthorized' })
  async logout(@CurrentUser() user: User) {
    return this.authService.logout(user._id as string);
  }

  @UseGuards(GoogleAuthGuard)
  @Get('google')
  @ApiOperation({ summary: 'google authentication ' })
  @ApiResponse({ status: 200, description: 'google authentication successfully ' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'UnAuthorized' })
  async googleAuth() {
    //this route initiates google authentication
  }

  @UseGuards(GoogleAuthGuard)
  @Get('google/callback')
  async googleAuthCallback(@Req() req: Request) {
    return this.authService.googleLogin(req.user);
  }

  @UseGuards(AuthGuard('snapchat'))
  @ApiOperation({ summary: 'snapchat authentication ' })
  @ApiResponse({ status: 200, description: 'snapchat authentication successfully ' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'UnAuthorized' })
  @Get('snapchat')
  async snapchatAuth() {
    // this route initiates Snapchat authentication
  }

  @UseGuards(AuthGuard('snapchat'))
  @Get('snapchat/callback')
  async snapchatAuthCallback(@Req() req: Request) {
    return this.authService.snapChatLogin(req.user);
  }

  @ApiTags('secured-endpoints')
@ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiOperation({ summary: 'Me' })
  @ApiResponse({ status: 200, description: 'me' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'UnAuthorized' })
  getProfile(@CurrentUser() user: User) {
    return user;
  }
}
