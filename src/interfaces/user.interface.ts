import { Document, Types } from 'mongoose';

export interface UserInterface extends Document {
  name: string;
  email: string;
  password: string;
  trips: Types.ObjectId[];
  userType: number;
  isActive: boolean;
  refreshToken?: string;
  _id: Types.ObjectId;

  isPasswordCorrect(password: string): Promise<boolean>;
  generateAccessToken(): string;
  generateRefreshToken(): string;
}
