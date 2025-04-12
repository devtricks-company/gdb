import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthProvider, User, UserRole } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.tto';
import { JWTPayload } from './interfaces/jwt-payload.interface';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    //TODO: user can login with all providers

    const user = await this.userService.findByEmail(email);
    if (!user) {
      return null;
    }
    if (user.provider !== AuthProvider.LOCAL) {
      throw new UnauthorizedException(
        `Please login with you ${user.provider} account`,
      );
    }

    const isPasswordValid = await this.validatePassowrd(
      password,
      user.password,
    );
    if (!isPasswordValid) {
      return null;
    }

    return user;
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    //Check if user is an admin panel user
    if (
      ![UserRole.ULTRA, UserRole.SUPER, UserRole.ADMIN].includes(user.role) &&
      loginDto.isAdminPanel
    ) {
      throw new UnauthorizedException(`You don not hav access to admin panle`);
    }
    // Update last loing timestamp
    await this.userService.updateLastLogin(user._id as string);

    // Genarate Tokens
    const tokens = await this.getTokens(user);

    //Store refresh Token
    await this.userService.setRefreshToken(
      user._id as string,
      tokens.refresToken,
    );

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refresToken,
      user: this.sanitizerUser(user),
    };
  }

  async register(registerDto: RegisterDto) {
    // Create user with student role by default
    const newUser = await this.userService.create({
      ...registerDto,
      role: UserRole.STUDENT,
      provider: AuthProvider.LOCAL,
    });

    //Generate tokens
    const tokens = await this.getTokens(newUser);

    //Store Refres token
    await this.userService.setRefreshToken(
      newUser._id as string,
      tokens.refresToken,
    );
    return {
      accessToken: tokens.accessToken,
      refreshTokens: tokens.refresToken,
      user: this.sanitizerUser(newUser),
    };
  }

  async refreshToken(userId: string, refreshToken: string) {
    const isValid = await this.userService.validateRefreshToken(
      userId,
      refreshToken,
    );
    if (!isValid) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.userService.findById(userId);
    const tokens = await this.getTokens(user);

    //Update refresh token
    await this.userService.setRefreshToken(
      user._id as string,
      tokens.refresToken,
    );

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refresToken,
    };
  }

  async logout(userId: string) {
    await this.userService.removeRefreshToken(userId);
    return { success: true };
  }

  async googleLogin(profile: any) {
    const { email, name, picture, sub } = profile;
    const user = await this.userService.createOAuthUser(
      email,
      name,
      name,
      name,
      AuthProvider.GOOGLE,
      sub,
      picture,
    );

    //Generate tokens
    const tokens = await this.getTokens(user);

    // Store refresh token
    await this.userService.setRefreshToken(
      user._id as string,
      tokens.refresToken,
    );

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refresToken,
      user: this.sanitizerUser(user),
    };
  }

  async snapChatLogin(profile: any) {
    const { email, displayName, id, photos } = profile;
    const picture = photos && photos.length > 0 ? photos[0].value : undefined;

    const user = await this.userService.createOAuthUser(
      email,
      displayName,
      displayName,
      displayName,
      AuthProvider.SNAPCHAT,
      id,
      picture,
    );

    //Generate Tokens
    const tokens = await this.getTokens(user);

    //Store refreshtoken
    await this.userService.setRefreshToken(
      user._id as string,
      tokens.refresToken,
    );

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refresToken,
      user: this.sanitizerUser(user),
    };
  }

  private async getTokens(user: User) {
    const payload: JWTPayload = {
      sub: user._id as string,
      email: user.email,
      role: user.role,
    };

    const [accessToken, refresToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        expiresIn: '15m',
        secret: this.configService.get<string>('jwt.secret'),
      }),
      this.jwtService.signAsync(payload, {
        expiresIn: '70d',
        secret: this.configService.get<string>('jwt.secret'),
      }),
    ]);
    return {
      accessToken,
      refresToken,
    };
  }

  private sanitizerUser(user: User): User {
    const sanitized = user.toObject();
    delete sanitized.password;
    delete sanitized.refresToken;
    return sanitized;
  }

  private async validatePassowrd(
    psasowrd: string,
    userPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(psasowrd, userPassword);
  }
}
