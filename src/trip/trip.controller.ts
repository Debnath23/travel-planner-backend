import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TripService } from './trip.service';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { CreatePlanDto } from 'src/dtos/createPlan.dto';
import { Request } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { Types } from 'mongoose';

@Controller('trip')
@ApiTags('Trip')
export class TripController {
  constructor(private readonly tripService: TripService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async generateTrip(@Req() req: Request, @Body() generateTrip: CreatePlanDto) {
    try {
      if (!req.user) {
        throw new NotFoundException('User not found!');
      }

      const userId = req.user._id;

      const response = await this.tripService.generateTripService(
        userId,
        generateTrip,
      );

      return {
        message: 'Trip generated successfully!',
        trip: response,
      };
    } catch (error) {
      throw error;
    }
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async tripsDetails(@Req() req: Request) {
    try {
      if (!req.user) {
        throw new NotFoundException('User not found!');
      }

      const userId = req.user._id;

      const response = await this.tripService.tripsDetailsService(userId);

      return {
        message: 'Trip details fetched successfully!',
        trips: response,
      };
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteTrip(@Param('id') tripId: string, @Req() req: Request) {
    try {
      if (!req.user) {
        throw new NotFoundException('User not found!');
      }
  
      const userId = req.user._id;
      if (!Types.ObjectId.isValid(tripId)) {
        throw new BadRequestException('Invalid trip ID!');
      }
  
      await this.tripService.deleteTripService(new Types.ObjectId(tripId), new Types.ObjectId(userId));
  
      return {
        message: 'Trip deleted successfully!',
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message || 'An error occurred while deleting the trip.');
    }
  }
  
}
