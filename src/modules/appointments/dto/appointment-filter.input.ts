import { InputType, Field } from '@nestjs/graphql';
import { IsISO8601, IsOptional } from 'class-validator';

@InputType()
export class AppointmentFilterInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsISO8601()
  startDate?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsISO8601()
  endDate?: string;

  @Field({ nullable: true })
  @IsOptional()
  patientId?: string;
}
