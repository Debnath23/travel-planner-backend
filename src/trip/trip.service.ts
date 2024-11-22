import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreatePlanDto } from 'src/dtos/createPlan.dto';
import { TripEntity } from 'src/entities/trip.entity';
import { UserEntity } from 'src/entities/user.entity';

@Injectable()
export class TripService {
  constructor(
    @InjectModel(UserEntity.name) private userModel: Model<UserEntity>,
    @InjectModel(TripEntity.name) private tripModel: Model<TripEntity>,
  ) {}

  async generateTripService(
    userId: Types.ObjectId,
    generateTrip: CreatePlanDto,
  ) {
    try {
      const user = await this.userModel.findById(userId);

      if (!user) {
        throw new NotFoundException('User does not exist!');
      }

      const existingTrip = await this.tripModel.findOne({ userId });

      if (existingTrip) {
        throw new Error('Trip already exists!');
      }

      const newTrip = new this.tripModel({
        userId,
        ...generateTrip,
      });

      await newTrip.save();

      return newTrip;
    } catch (error) {
      throw error;
    }
  }

  async tripsDetailsService(userId: Types.ObjectId) {
    try {
      const user = await this.userModel.findById(userId);

      if (!user) {
        throw new NotFoundException('User does not exist!');
      }

      const trips = await this.tripModel.find({ userId: userId._id });

      if (!trips || trips.length === 0) {
        throw new NotFoundException('No trips found for this user.');
      }

      return trips;
    } catch (error) {
      throw error;
    }
  }
}
