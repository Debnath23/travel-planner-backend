import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Types } from 'mongoose';

@Schema({ _id: false })
export class CoordinatesInfoEntity {
  @Prop({ required: true })
  lat: number;

  @Prop({ required: true })
  lng: number;
}

@Schema({ _id: false })
export class LocationInfoEntity {
  @Prop({ required: true })
  name: string;

  @Prop({ type: CoordinatesInfoEntity, required: true })
  coordinates: CoordinatesInfoEntity;

  @Prop({ required: true })
  photoRef: string;

  @Prop({ required: true })
  url: string;
}

export const LocationInfoSchema =
  SchemaFactory.createForClass(LocationInfoEntity);

@Schema({ timestamps: true })
export class TripEntity {
  _id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'UserEntity', required: true })
  userId: Types.ObjectId;

  @Prop({ type: LocationInfoSchema, required: true })
  locationInfo: LocationInfoEntity;

  @Prop({ required: true })
  traveler: string;

  @Prop({ required: true })
  statDate: string;

  @Prop({ required: true })
  endDate: string;

  @Prop({ required: true })
  totalNoOfDays: number;

  @Prop({ required: true })
  budget: string;

  @Prop({ type: mongoose.Schema.Types.Mixed, required: true })
  tripPlan: any;
}

export const TripEntitySchema = SchemaFactory.createForClass(TripEntity);
