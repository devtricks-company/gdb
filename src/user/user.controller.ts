import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { Role } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.gurad';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserRole } from './entities/user.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role(UserRole.ULTRA, UserRole.SUPER, UserRole.ADMIN)
  @Get()
  async findAll(@Query('role') role?: UserRole) {
    const users = await this.userService.findAll(role);
    return users.map((user) => this.excludeSensitiveFields(user));
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@CurrentUser() user: User) {
    return this.excludeSensitiveFields(user.toObject());
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role(UserRole.ULTRA, UserRole.SUPER, UserRole.ADMIN)
  @Get(':id')
  async findByID(@Param('id') id: string) {
    const user = await this.userService.findById(id);
    return this.excludeSensitiveFields(user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role(UserRole.ULTRA, UserRole.SUPER)
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.create(createUserDto);
    return this.excludeSensitiveFields(user);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  async updateProfile(
    @CurrentUser() user: User,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const updatedUser = await this.userService.update(
      user._id as string,
      updateUserDto,
    );
    return this.excludeSensitiveFields(user.toObject());
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role(UserRole.ULTRA, UserRole.SUPER)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const updatedUser = await this.userService.update(id, updateUserDto);
    return this.excludeSensitiveFields(updatedUser);
  }

  private excludeSensitiveFields(user: any) {
    delete user.passowrd;
    delete user.refreshToken;
    return user;
  }
}
