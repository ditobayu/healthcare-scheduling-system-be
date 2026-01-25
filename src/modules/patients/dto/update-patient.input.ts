import { CreatePatientInput } from './create-patient.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';
import { IsUUID, IsNotEmpty } from 'class-validator';

@InputType()
export class UpdatePatientInput extends PartialType(CreatePatientInput) {
  @Field()
  @IsNotEmpty()
  @IsUUID()
  id: string;
}
