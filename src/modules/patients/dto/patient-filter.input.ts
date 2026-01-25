import { InputType, Field } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';

@InputType()
export class PatientFilterInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  search?: string;
}
