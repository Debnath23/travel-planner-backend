import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  NotFoundException,
  Patch,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { Request } from 'express';
import { UpdateUserDto } from 'src/dtos/updateUser.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { diskStorage } from 'multer';

@Controller('user')
@ApiTags('User')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async userDetails(@Req() req: Request) {
    try {
      if (!req.user) {
        throw new NotFoundException('User not found!');
      }

      const userId = req.user._id;

      const response = await this.userService.userDetails(userId);

      return response;
    } catch (error) {
      throw error;
    }
  }

  @Patch()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('profileImg', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  async updateUserDetails(
    @Req() req: Request,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      if (!req.user) {
        throw new NotFoundException('User not found!');
      }

      const userId = req.user._id;

      if (file) {
        updateUserDto.profileImg = file.path;
      }

      const updatedUser = await this.userService.updateUserDetails(
        userId,
        updateUserDto,
      );

      return {
        message: 'User details updated successfully!',
        user: updatedUser,
      };
    } catch (error) {
      throw new BadRequestException(
        error.message || 'Failed to update user details',
      );
    }
  }
}
