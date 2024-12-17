import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { UserEntity } from 'src/entities/user.entity';
import { UpdateUserDto } from 'src/dtos/updateUser.dto';
import { uploadOnCloudinary } from 'src/utils/cloudinary';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(UserEntity.name) private userModel: Model<UserEntity>,
  ) {}

  async userDetails(userId: Types.ObjectId) {
    try {
      const user = await this.userModel
        .findById(userId)
        .select('-password -refreshToken -trips');

      if (!user) {
        throw new NotFoundException('User does not exist!');
      }

      return {
        user: user,
        message: 'User details fetch Successfully!',
      };
    } catch (error) {
      throw error;
    }
  }

  async updateUserDetails(
    userId: Types.ObjectId,
    updateUserDto: UpdateUserDto,
  ) {
    try {
      const user = await this.userModel
        .findById(userId)
        .select('-password -refreshToken -trips');

      if (!user) {
        throw new NotFoundException('User does not exist!');
      }

      console.log('profileImg:', updateUserDto.profileImg);

      if (updateUserDto.profileImg) {
        const cloudinaryResponse = await this.uploadProfileImage(
          updateUserDto.profileImg,
        );

        console.log("cloudinaryResponse: ", cloudinaryResponse);
        

        if (!cloudinaryResponse?.url) {
          throw new InternalServerErrorException(
            'Failed to upload profile image.',
          );
        }
        updateUserDto.profileImg = cloudinaryResponse.url;
      }

      const updatedUser = await this.userModel.findByIdAndUpdate(
        userId,
        updateUserDto,
        { new: true, select: '-password -refreshToken -trips' },
      );

      console.log(">>>>>>>>>>>>");
      

      return updatedUser;
    } catch (error) {
      throw new InternalServerErrorException(
        error.message || 'Error updating user details',
      );
    }
  }

  private async uploadProfileImage(filePath: string) {
    try {
      return await uploadOnCloudinary(filePath);
    } catch (error) {
      throw new InternalServerErrorException(
        'Error uploading file to Cloudinary',
      );
    }
  }
}
