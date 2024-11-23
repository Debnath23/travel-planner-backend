import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsString, ValidateNested } from 'class-validator';

export class coordinatesInfoDto {
  @ApiProperty({ required: true })
  @IsNumber()
  readonly lat: number;

  @ApiProperty({ required: true })
  @IsNumber()
  readonly lng: number;
}

export class locationInfoDto {
  @ApiProperty({ required: true })
  @IsString()
  readonly name: string;

  @ApiProperty({ required: true })
  @ValidateNested()
  @Type(() => coordinatesInfoDto)
  readonly coordinates: coordinatesInfoDto;

  @ApiProperty({ required: true })
  @IsString()
  readonly photoRef: string;

  @ApiProperty({ required: true })
  @IsString()
  readonly url: string;
}
