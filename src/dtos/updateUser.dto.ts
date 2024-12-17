import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ required: false, description: 'User name' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ required: false, description: 'User profile image' })
  @IsOptional()
  @IsString()
  profileImg?: string;

  @ApiProperty({ required: false, description: 'User phone number' })
  @IsOptional()
  @IsString()
  phoneNumber?: string;
}
