import { ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
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

      const newTrip = new this.tripModel({
        userId,
        ...generateTrip,
      });

      await newTrip.save();

      user.trips.push(newTrip._id);
      await user.save();

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

  async deleteTripService(tripId: Types.ObjectId, userId: Types.ObjectId) {
    try {
      const user = await this.userModel.findById(userId);
      if (!user) {
        throw new NotFoundException('User does not exist!');
      }
  
      const trip = await this.tripModel.findById(tripId);
      if (!trip) {
        throw new NotFoundException('Trip does not exist!');
      }
  
      if (!user.trips.includes(tripId)) {
        throw new ForbiddenException('Unauthorized: You cannot delete this trip.');
      }
  
      await trip.deleteOne();
  
      await this.userModel.updateOne({ _id: userId }, { $pull: { trips: tripId } });
    } catch (error) {
      throw new InternalServerErrorException(error.message || 'Failed to delete trip.');
    }
  }
  
}
