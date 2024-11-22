import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class locationInfoDto {
  @ApiProperty({ required: true })
  @IsString()
  readonly name: string;

  @ApiProperty({ required: true })
  @IsString()
  readonly coordinates: string;

  @ApiProperty({ required: true })
  @IsString()
  readonly photoRef: string;

  @ApiProperty({ required: true })
  @IsString()
  readonly url: string;
}
