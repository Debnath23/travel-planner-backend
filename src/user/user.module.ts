import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserEntity, UserEntitySchema } from 'src/entities/user.entity';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TripEntity, TripEntitySchema } from 'src/entities/trip.entity';
import { JwtAuthGuard } from 'src/guards/jwt.guard';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserEntity.name, schema: UserEntitySchema },
      { name: TripEntity.name, schema: TripEntitySchema },
    ]),
    JwtModule.register({
      secret: process.env.ACCESS_TOKEN_SECRET,
      signOptions: { expiresIn: process.env.ACCESS_TOKEN_EXPIRY },
    }),
  ],
  controllers: [UserController, JwtAuthGuard, JwtService],
  providers: [UserService, JwtService]
})
export class UserModule {}
