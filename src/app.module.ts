import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TripModule } from './trip/trip.module';
import { ConfigModule } from '@nestjs/config';
import { envOptions } from './config/envOptions';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot(envOptions),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    UserModule,
    TripModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
