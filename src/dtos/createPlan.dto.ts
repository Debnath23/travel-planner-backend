import { ApiProperty } from '@nestjs/swagger';
import { IsJSON, IsNumber, IsString, ValidateNested } from 'class-validator';
import { locationInfoDto } from './locationInfo.dto';
import { Type } from 'class-transformer';

export class CreatePlanDto {
  @ApiProperty({ required: true })
  @ValidateNested()
  @Type(() => locationInfoDto)
  readonly locationInfo: locationInfoDto;

  @ApiProperty({ required: true })
  readonly traveler: any;

  @ApiProperty({ required: true })
  @IsString()
  readonly statDate: string;

  @ApiProperty({ required: true })
  @IsString()
  readonly endDate: string;

  @ApiProperty({ required: true })
  @IsNumber()
  readonly totalNoOfDays: number;

  @ApiProperty({ required: true })
  @IsString()
  readonly budget: string;

  @ApiProperty({ required: true })
  readonly tripPlan: any;
}
