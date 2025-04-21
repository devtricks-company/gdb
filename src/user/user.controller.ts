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
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiTags('secured-endpoints')
@ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role(UserRole.ULTRA, UserRole.SUPER, UserRole.ADMIN)
  @Get()
  @ApiOperation({ summary: 'Find all users' })
  @ApiResponse({ status: 200, description: 'User successfully created' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'UnAutorize Request' })
  async findAll(@Query('role') role?: UserRole) {
    const users = await this.userService.findAll(role);
    return users.map((user) => this.excludeSensitiveFields(user));
  }

  @ApiTags('secured-endpoints')
@ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiOperation({ summary: 'get profile' })
  @ApiResponse({ status: 200, description: 'Get User profile' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'UnAutorize Request or you have not Permission with this role' })
  async getProfile(@CurrentUser() user: User) {
    return this.excludeSensitiveFields(user.toObject());
  }

  @ApiTags('secured-endpoints')
@ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role(UserRole.ULTRA, UserRole.SUPER, UserRole.ADMIN)
  @Get(':id')
  @ApiOperation({ summary: 'get user by id' })
  @ApiResponse({ status: 200, description: 'Get User By ID' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'UnAutorize Request or you have not Permission with this role' })
  async findByID(@Param('id') id: string) {
    const user = await this.userService.findById(id);
    return this.excludeSensitiveFields(user);
  }

  @ApiTags('secured-endpoints')
@ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role(UserRole.ULTRA, UserRole.SUPER)
  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User successfully updated' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'UnAutorize Request or you have not Permission with this role' })
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.create(createUserDto);
    return this.excludeSensitiveFields(user);
  }

  @ApiTags('secured-endpoints')
@ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  @ApiOperation({ summary: 'update profile' })
  @ApiResponse({ status: 201, description: 'User profile successfully updated' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'UnAutorize Request or you have not Permission with this role' })
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

  @ApiTags('secured-endpoints')
@ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role(UserRole.ULTRA, UserRole.SUPER)
  @Patch(':id')
 @ApiOperation({ summary: 'update user by id' })
  @ApiResponse({ status: 201, description: 'User successfully updated by id' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'UnAutorize Request or you have not Permission with this role' })
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
