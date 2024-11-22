import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { LoginDto } from '../dtos/login.dto';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../dtos/createUser.dto';
import { ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { SetCookiesInterceptor } from 'src/interceptors/set-cookies.interceptor';
import { ClearCookiesInterceptor } from 'src/interceptors/clear-cookies.interceptor';

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    try {
      return await this.authService.createUser(createUserDto);
    } catch (error) {
      throw error;
    }
  }

  @Post('login')
  @UseInterceptors(SetCookiesInterceptor)
  async login(@Body() loginDto: LoginDto) {
    try {
      if (!loginDto) {
        throw new BadRequestException('All fields are required');
      }

      return await this.authService.loginUser(loginDto);
    } catch (error: any) {
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete('logout')
  @UseInterceptors(ClearCookiesInterceptor)
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    try {
      if (!req.user) {
        throw new UnauthorizedException('Unauthorized');
      }

      return await this.authService.logoutUser(req.user._id, res);
    } catch (error) {
      throw error;
    }
  }

  @Get('verify')
  @UseGuards(JwtAuthGuard)
  async verifyToken(@Req() req: Request) {
    return { isValid: true, user: req.user };
  }
}
