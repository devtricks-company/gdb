import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Document } from 'mongoose';

export enum UserRole {
  ULTRA = 'ultra',
  SUPER = 'super',
  ADMIN = 'admin',
  STUDENT = 'student',
}

export enum AuthProvider {
  LOCAL = 'local',
  GOOGLE = 'google',
  SNAPCHAT = 'snapchat',
}

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true, unique: true, lowercase: true })
  email: string;

  @Prop()
  password: string;

  @Prop({
    type: String,
    enum: UserRole,
    default: UserRole.STUDENT,
  })
  role: UserRole;

  @Prop({
    type: String,
    enum: AuthProvider,
    default: AuthProvider.LOCAL,
  })
  provider: AuthProvider;

  @Prop()
  providerId: string;

  @Prop()
  profilePicture: string;

  @Prop({ default: false })
  emailVerified: boolean;

  @Prop({ default: false })
  isActive: boolean;

  @Prop()
  lastLogin: Date;

  @Prop()
  refreshToken: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Pre-Save, hook to hash passowrd
UserSchema.pre('save', async function (next) {
  try {
    if (!this.isModified('password')) {
      return next();
    }

    // Only hash the passowrd if it exist (not using OAuth)
    if (this.password) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }

    return next();
  } catch (error) {
    return next(error);
  }
});
