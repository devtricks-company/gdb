import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { AuthProvider, User, UserRole } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findAll(role?: UserRole): Promise<User[]> {
    const query = role ? { role } : {};
    return this.userModel.find(query).exec();
  }

  async findById(id: string): Promise<User> {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException(`User with Id "${id}" Not found`);
    }

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.userModel
      .findOne({ email: email.toLocaleLowerCase() })
      .exec();

    return user!;
  }

  async findByProviderId(
    provider: AuthProvider,
    providerId: string,
  ): Promise<User> {
    const user = await this.userModel.findOne({ provider, providerId }).exec();
    if (!user) {
      throw new NotFoundException(`User with providerId Not found`);
    }

    return user;
  }

  async create(userData: Partial<User>): Promise<User> {
    //Check if user with this email already exists
    if (userData.email) {
      const exsitingUser = await this.findByEmail(userData.email);
      if (exsitingUser) {
        throw new BadRequestException(` User with this email already exists`);
      }
      // Create new User
      const newUser = new this.userModel(userData);
      return newUser.save();
    }
    throw new BadRequestException(
      ` Email is requier. please set email for this user`,
    );
  }

  async createOAuthUser(
    email: string,
    fullName: string,
    firstName: string,
    lastName: string,
    provider: AuthProvider,
    providerId: string,
    profilePicture?: string,
  ): Promise<User> {
    //Check if user exists
    let user = await this.findByEmail(email);
    if (user && user.provider !== provider) {
      //Link this provider to existing account
      const updateUser = new this.userModel(user);
      updateUser.provider = provider;
      updateUser.providerId = providerId;
      if (profilePicture) updateUser.profilePicture = profilePicture;
      user = await updateUser.save();
    }

    if (!user) {
      user = await this.create({
        email,
        fullName,
        firstName,
        lastName,
        provider,
        providerId,
        profilePicture,
      });
    }

    return user;
  }

  async update(id: string, userData: Partial<User>): Promise<User> {
    if (userData.password) {
      const salt = await bcrypt.genSalt(10);
      userData.password = await bcrypt.hash(userData.password, salt);
    }

    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, userData, { new: true, runValidators: true })
      .exec();
    if (!updatedUser) {
      throw new NotFoundException(`User with ID "${id} not found"`);
    }
    return updatedUser;
  }

  async setRefreshToken(userId: string, refreshToken: string): Promise<void> {
    //Hash refreshToken before storing
    const salt = await bcrypt.genSalt(10);
    const hashedRefreshToken = await bcrypt.hash(refreshToken, salt);

    await this.userModel.updateOne(
      { _id: userId },
      { refreshToken: hashedRefreshToken },
    );
  }

  async validateRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<boolean> {
    const user = await this.findById(userId);
    if (!user || !user.refreshToken) return false;
    return bcrypt.compare(refreshToken, user.refreshToken);
  }

  async removeRefreshToken(userId: string): Promise<void> {
    await this.userModel.updateOne({ _id: userId }, { refreshToken: null });
  }

  async updateLastLogin(userId: string): Promise<void> {
    await this.userModel.updateOne({ _id: userId }, { lastLogin: new Date() });
  }
}
